# Database addon

Sloj iznad knex-a koji daje CRUD, find chain, auto-sync sheme, versioning, prevode,
relacije i metrike, na PostgreSQL, sa minimumom sirovog SQL-a. Konekcije su itemi,
addoni deklarisu tabelu i ponasanje.

Import: `import database from '@onetype/framework/database'`

## Konekcije

Svaka konekcija je item (uvek PostgreSQL).

```js
database.Item({ id: 'primary', hostname, username, password, database });
```

Vise konekcija koegzistira. Svaka operacija prima `{ connection: 'id' }` (default 'primary'),
pa isti addon moze da cita i pise u razlicite baze. Na dodavanje konekcije gradi se knex
i pokrece auto-sync sheme (vidi dole). Spremnost se ceka sa `await database.Fn('ready')`.

## Addon setup

Addon deklarise tabelu, shemu (sirovi pg DDL, linija po linija) i opciono versioning,
prevode, pretragu. `Field()` definise tip za kastovanje i API; `Schema()` je cist DDL.

```js
const blog = onetype.Addon('blog', (addon) =>
{
    addon.Table('blog');

    addon.Field('id', ['string']);          // id je UVEK string (bigint stize kao string)
    addon.Field('slug', ['string']);
    addon.Field('title', ['string']);
    addon.Field('views', ['number', 0]);
    addon.Field('tags', ['array']);         // array i object idu u jsonb kolonu
    addon.Field('created_at', ['string']);
    addon.Field('updated_at', ['string']);
    addon.Field('deleted_at', ['string']);

    addon.Schema('id bigserial primary key');
    addon.Schema('slug varchar(255)');
    addon.Schema('title text');
    addon.Schema('views bigint default 0');
    addon.Schema('tags jsonb');
    addon.Schema('author_id bigint references author(id) on delete cascade');
    addon.Schema('created_at timestamptz');
    addon.Schema('updated_at timestamptz');
    addon.Schema('deleted_at timestamptz');
    addon.Schema('unique (slug)');          // unique indeks
    addon.Schema('index (views)');          // obican indeks

    addon.Versions('*');                    // versioning svih polja
    addon.Translations(['title']);          // prevodljiva polja
    addon.Search(['title']);                // polja za pretragu
});
```

Schema linija je kolona (`'views bigint default 0'`), table constraint
(`'primary key (entity, language)'`, `'foreign key (...) references ...'`), indeks
(`'index (a, b)'`, `'unique (slug)'`, `'index using gin (data)'`) ili table clause
(`'partition by list (collection)'`). Svi setteri imaju i getter oblik bez argumenta.
U INSERT/UPDATE ulaze samo polja koja imaju Schema kolonu.

Polje moze da zivi u drugacije imenovanoj koloni preko `metadata: { column: 't1' }`
(slot storage): ceo read/write put (filteri, sort, select, search, agregati, metrike,
versions, translations) govori imenom polja, a SQL kolonom. Object polje sa
`metadata: { spread: true }` je torba: svako polje bez fizicke kolone se pri upisu
pakuje u nju (jsonb), pri citanju rasprostire nazad, a restore je rekonstruise.

## Auto-sync (DDL)

Kad se addon sa `Table()` + `Schema()` i konekcija sretnu, DDL se izvrsi automatski,
redosledom registracije addona (FK targeti se definisu pre onih koji ih referenciraju).
`await database.Fn('ready')` ceka da sve do tada zakazano prodje. Rucno: `addon.SchemaRun()`.

Sync je idempotentan i radi na svaki boot:

- Tabela ne postoji: `CREATE TABLE IF NOT EXISTS` sa svim kolonama i constraintima.
- Kolona fali: `ADD COLUMN` iz njene Schema linije.
- Tip kolone ne odgovara: `ALTER COLUMN TYPE` sa `USING` castom (ako pg ne moze da
  kastuje podatke, greska ispliva, cela transakcija se vrati i migracija je rucna).
- Default i NOT NULL ne odgovaraju: `SET/DROP DEFAULT`, `SET/DROP NOT NULL`
  (serial/identity default se ne dira; SET NOT NULL preko null podataka pukne i vrati sve).
- Kolona postoji u bazi a nema Schema liniju: `DROP COLUMN`.
- Indeksi: `CREATE [UNIQUE] INDEX IF NOT EXISTS` (`{table}_{kolone}_index|unique`);
  indeks po toj konvenciji koji vise nije deklarisan se brise, tudji indeksi se ne diraju.

Deklarisane linije parsira sam pg (scratch tabela u istoj transakciji + `format_type` /
`pg_get_expr`), pa radi svaki pg tip — `varchar(255)`, `numeric(10,2)`, `text[]`,
`varchar[]`, `uuid default gen_random_uuid()`... — i poredjenje je egzaktno, ukljucujuci
duzine. Ceo sync jednog addona je jedna transakcija iza globalnog advisory locka, pa su
i paralelni boot-ovi bezbedni.

Table constrainti (composite PK, foreign key linije) se primenjuju samo pri kreiranju
tabele; naknadno dodavanje constrainta je rucna migracija. FK preko inline `references`
na koloni radi i pri ADD COLUMN.

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
`CONTAINS/OVERLAP/HAS` rade nad jsonb array kolonom (pg @>).

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
jsonb pivota). Restore: entiteti napravljeni posle preseka se soft-brisu,
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
sa stranice, povuce povezane jednim `id IN (...)` upitom, mapira nazad u JS. Nije SQL JOIN.
`*` prefiks (`'*authors'`) cini join obaveznim (drop reda bez matcha).
Builder dobija pun Find chain (filter/select/sort). Many-to-many ide preko junction kolekcije.

## Metrike

```js
await orders.Find().filter('status', 'paid').metrics('created_at', 'day', 'sum', 'amount');
// -> [{ date, value }, ...]
```

Bucketovanje vremena preko `date_trunc`. Intervali: minute hour day week month year.
Default agregat: count.

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

## Granice i napomene

- Array/object polje moze u `jsonb` ili u native array kolonu (`varchar[]`, `text[]`...).
  Native array se upisuje/cita direktno (bez JSON serijalizacije); `CONTAINS/OVERLAP/HAS`
  filteri rade nad jsonb kolonom.
- id polja su uvek `['string']` (bigint stize kao string; sigurno za velike vrednosti).
- Kolona bez Schema linije se BRISE na syncu; kolona bez Field-a se ne upisuje kroz CRUD.

## Struktura foldera

```
back/
  addon.js                konekcija (polja: host, user, ...)
  events/                 addon (Table), connection (knex build)
  functions/              cast, serialize, connection, transaction
  addons/                 subaddoni: schema, crud, versions, translations, filters, joins, search, metrics
    schema/               Schema linije, parse, idempotentan DDL run, auto-run + ready
    crud/                 chain, write operacije, find terminali, HTTP komande
```

Pravilo: jedan fajl definise tacno jednu funkciju; srodne se grupisu u folder a ime funkcije
nosi namespace (`fields/build.js` -> `fields.build`).
