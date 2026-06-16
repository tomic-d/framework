# Database addon

Sloj iznad knex-a koji daje CRUD, find chain, auto-sync sheme, versioning, prevode,
relacije i metrike, i radi na PostgreSQL, MySQL 8 i SQLite kroz isti API sa minimumom
sirovog SQL-a. Konekcije su itemi, addoni deklarisu tabelu i ponasanje, a sve dijalekt
razlike zive na jednom mestu.

Import: `import database from '@onetype/framework/database'`

## Konekcije

Svaka konekcija je item. Bira se klijent (pg, mysql2, better-sqlite3); sqlite ide preko
filename, ostali preko host/user/pass.

```js
database.Item({ id: 'primary', client: 'pg', hostname, username, password, database });
database.Item({ id: 'site2', client: 'better-sqlite3', filename: '/data/site2.sqlite' });
```

Vise konekcija koegzistira. Svaka operacija prima `{ connection: 'id' }` (default 'primary'),
pa isti addon moze da cita i pise u razlicite baze. Na dodavanje konekcije gradi se knex
i pokrece auto-sync (vidi dole). Spremnost se ceka sa `await database.Fn('ready', 'primary')`.

## Addon setup

Addon deklarise tabelu i opciono versioning, prevode, pretragu.

```js
const blog = onetype.Addon('blog', (addon) =>
{
    addon.Field('id', ['string']);          // id je UVEK string (bigint stize kao string)
    addon.Field('title', ['string']);
    addon.Field('views', ['number', 0]);
    addon.Field('tags', ['array']);         // array i object idu u jsonb kolonu
    addon.Field('created_at', ['string']);
    addon.Field('updated_at', ['string']);
    addon.Field('deleted_at', ['string']);

    addon.Table('blog');                    // ili Table('blog', { connection: 'site2', prune: true })
    addon.Versions('*');                    // versioning svih polja
    addon.Translations(['title']);          // prevodljiva polja
    addon.Search(['title']);                // polja za pretragu
});
```

`Table(name, options)`: `connection` veze addon za odredjenu konekciju (sync ga primeni
samo kad se ta konekcija dodaje); `prune: true` dozvoljava brisanje viska kolona.
Svi setteri imaju i getter oblik bez argumenta (`addon.Table()` vraca `{ name, connection, prune }`).

## Auto-sync (DDL)

Kad konekcija postane spremna, sync prolazi kroz svaki addon koji ima `Table()` i uskladi
bazu sa definicijom polja:

- Tabela ne postoji: napravi je iz polja. id -> bigserial PK, *_at -> timestamp,
  number -> bigint, boolean -> boolean, object/array -> jsonb, indeksiran string -> varchar(255),
  ostalo -> text. Mapiranje je knex-native pa radi na sve tri baze.
- Tabela postoji: doda kolone koje fale (ADD COLUMN). Visak kolona NE brise (loguje upozorenje,
  osim ako `prune: true`). Kolonu pogresnog tipa NE menja (loguje upozorenje; migracija je rucna).
- Sistemske tabele `database_versions` i `database_translations` se uvek osiguraju (framework ih
  inace nikad ne pravi sam).

Sync je idempotentan, radi na svaki boot, dodaje samo nove stvari. Jedina destruktivna operacija
(drop kolone) je iza eksplicitnog `prune` flaga.

## CRUD

```js
const item = blog.ItemAdd({ title: 'Hello', views: 5, tags: ['a'] });
await item.Create({ connection: 'primary', language, languages });

item.Set('title', 'Bye');
await item.Update({ connection: 'primary', whitelist: ['title'] });   // whitelist ogranicava upis

await item.Delete({ connection: 'primary' });   // soft delete ako Versions() postoji, inace hard
```

Sve ide kroz transakciju. Vrednosti se na upisu serijalizuju (object/array -> JSON string),
a na citanju kastuju nazad u deklarisani tip polja (bool 0/1 -> true/false, bigint -> string,
JSON string -> objekat). Tip se odredjuje iz definicije polja; za union (`number|string`) vazi
prvi tip.

## Find chain

```js
await blog.Find({ connection: 'primary', language, languages })
    .filter('status', 'published')
    .orFilter('featured', true)
    .group('OR').filter('a', 1).filter('b', 2).end()
    .search('term')
    .sort('created_at', 'desc')
    .limit(20).page(2)
    .select(['id', 'title'])
    .join('authors', 'author_id', 'author', (j) => j.select(['name']))
    .version(42)
    .many();
```

Terminali: `.many(set)` `.one(set)` `.plain()` `.count()` `.exists()` `.sum/avg/min/max(field)`
`.metrics(field, interval, aggregate, valueField)`.

Operatori filtera: `EQUALS NOT EQUALS LESS GREATER LESS EQUALS GREATER EQUALS LIKE NOT LIKE
ILIKE NOT ILIKE IN NOT IN BETWEEN NOT BETWEEN NULL NOT NULL CONTAINS OVERLAP HAS`.
`CONTAINS/OVERLAP/HAS` rade nad jsonb array kolonom (pg @>, mysql JSON_CONTAINS, sqlite json_each).
`ILIKE` ide preko knex `whereILike` (case-insensitive na sve tri).

## Versioning i point-in-time

Sa `addon.Versions('*')` svaki write dopisuje red u `database_versions` sa diffom
`{ field: { old, new } }`. Delete postaje soft (`deleted_at`), a Find sam krije obrisane.
`id` u `database_versions` je jedan globalan niz, pa je jedan broj koherentan presek za ceo sajt.

```js
await item.History();                          // audit log jednog itema
await blog.History();                          // ceo addon
await blog.Find().version(42).many();          // citanje stanja na verziji 42 (read-only)
await blog.Restore(42);                         // vrati sve entitete na verziju 42
```

Rekonstrukcija stanja na verziji se radi JS foldom diff redova (bez LATERAL / DISTINCT ON /
jsonb pivota), pa je multi-db. Restore: entiteti napravljeni posle preseka se soft-brisu,
entiteti zivi na preseku se vracaju na to stanje. Restore je append-only (sam je dogadjaj u
istoriji) pa je i sam undo-abilan vracanjem na kasniju verziju.

## Prevodi

Sa `addon.Translations(['title'])`, podrazumevani jezik (`languages[0]`) pise u glavnu tabelu,
ostali jezici u `database_translations`. Citanje u jeziku radi batched id-IN overlay nad
strancom rezultata i COALESCE u JS (default kao fallback), bez sirovog pivota. Pisanje u
ne-podrazumevani jezik NE dira glavnu tabelu (prevodljiva polja idu u prevode, ostala ostaju
na default vrednosti). Kodovi jezika su dva velika slova (`EN`, `SR`).

## Relacije

`join('addon', 'fk', 'output', builder)` radi app-level batched lookup: skupi strane kljuceve
sa stranice, povuce povezane jednim `id IN (...)` upitom, mapira nazad u JS. Nije SQL JOIN pa
je dijalekt-agnostican. `*` prefiks (`'*authors'`) cini join obaveznim (drop reda bez matcha).
Builder dobija pun Find chain (filter/select/sort). Many-to-many ide preko junction kolekcije.

## Metrike

```js
await orders.Find().filter('status', 'paid').metrics('created_at', 'day', 'sum', 'amount');
// -> [{ date, value }, ...]
```

Bucketovanje vremena preko dialekta (pg date_trunc, mysql DATE_FORMAT, sqlite strftime).
Intervali: minute hour day week month year. Default agregat: count.

## Expose (HTTP)

```js
blog.Expose({
    filter: ['status'], sort: ['created_at'], select: ['id', 'title'],
    find: function(query) { query.filter('site_id', this.http.state.site.id); return true; },
    create: function() { return this.http.state.user ? true : 'Login required.'; },
    update() {}, delete() {}, history() {}, restore() {}
});
```

Callback vraca `true` za dozvolu ili string za odbijanje. Endpointi:
`/api/database/{find,create,update,delete,batch,history,restore}`.

## Sistemske tabele

```
database_versions(id bigserial pk, site_id, addon, entity_id, operation, changes jsonb, language, created_at)
  index (addon, entity_id, id), (site_id, id)
database_translations(entity, entity_id, language, field, value, updated_at, created_at)
  primary (entity, entity_id, language, field)
```

## Dijalekt

Sve razlike izmedju baza zive u `dialect.js` (`database.Fn('dialect', knex)`):
`stamp` (format datuma, mysql trazi 'YYYY-MM-DD HH:MM:SS' umesto ISO), `insert` (pg/sqlite
RETURNING, mysql insertId pa select), `cast` (normalizacija citanja po tipu), `dateTrunc`,
`jsonContains`, `now`. Sve ostalo je knex-native i prevodi se samo.

## Granice i napomene

- SQLite je single-writer: paralelni write-ovi se zakljucavaju. Za multi-tenant promet ide
  pg ili mysql; sqlite je za dev ili mali sajt.
- Sve array/object kolone su jsonb (native pg array ne postoji na mysql/sqlite). Stare native
  array kolone treba rucno migrirati na jsonb.
- id polja su uvek `['string']` (bigint stize kao string; sigurno za velike vrednosti).
- Auto-sync ne menja tip postojece kolone (samo loguje mismatch). Promene tipa su svesna migracija.

## Struktura foldera

```
back/
  addon.js                konekcija (polja: client, host, ...)
  dialect.js              jedini izvor dijalekt razlika
  events/                 addon (Table/Versions/...), item (Create/Update/...), connection (knex + sync)
  functions/              cast, serialize, create, update, delete, save, connection, transaction, validation
    fields/build.js       gradi mapu za upis iz polja itema
    fields/apply.js       upisuje DB red nazad u item (kastovano)
    find/                 find chain + terminali (many/one/count/...)
  sync/                   columns, column, diff, system, table, sync, ready (auto-sync DDL)
  commands/               HTTP komande (find/create/update/delete/batch/history/restore)
  addons/                 subaddoni: versions, translations, filters, joins, search, metrics
```

Pravilo: jedan fajl definise tacno jednu funkciju; srodne se grupisu u folder a ime funkcije
nosi namespace (`fields/build.js` -> `fields.build`).
