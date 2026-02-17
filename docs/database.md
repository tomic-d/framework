# Database

Custom ORM built on Knex with a fluent query interface. Supports PostgreSQL with 17+ operators including JSONB.

## Connection

```js
import database from '#database/load.js';
import dotenv from 'dotenv';

dotenv.config();

database.Item({
    id: 'primary',
    port: 5432,
    hostname: process.env.DB_HOSTNAME,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
});
```

Every addon with a `Table()` definition now persists to this database automatically. You can define multiple database connections by using different IDs.

## How it works

The database addon intercepts CRUD middleware channels:
- `item.crud.create` — `item.Create()`
- `item.crud.update` — `item.Update()`
- `item.crud.delete` — `item.Delete()`
- `addon.items.find` — `addon.Find()`

Without the database addon loaded, the same item API works entirely in-memory. Swap storage without touching business logic.

## Query builder

```js
// Find one
const user = await users.Find().filter('id', id).one();

// Find many
const items = await offers.Find()
    .filter('deleted', false)
    .filter('status', 'Aktivna')
    .sort('score', 'desc')
    .many();

// Find with specific database connection
const items = await offers.Find('primary')
    .filter('organization_id', 9)
    .many();
```

## Pagination

```js
const items = await offers.Find()
    .page(2)
    .limit(20)
    .many();

// Plain result — raw objects with pagination metadata
const { items, total, pages } = await offers.Find()
    .page(page)
    .limit(limit)
    .plain();

// Count
const total = await offers.Find()
    .filter('status', 'Aktivna')
    .count();
```

## Filtering

```js
// Equals (default)
.filter('status', 'Aktivna')

// Not equals
.filter('id', excludeId, 'NOT EQUALS')

// IN
.filter('organization_id', [1, 2, 9], 'IN')

// LIKE / ILIKE (case-insensitive)
.filter('name', '%beach%', 'ILIKE')

// Comparison
.filter('age', 18, '>=')
.filter('age', 65, '<=')

// BETWEEN
.filter('price', [100, 500], 'BETWEEN')

// NULL / NOT NULL
.filter('deleted_at', null, 'NULL')
.filter('email', null, 'NOT NULL')

// PostgreSQL JSONB
.filter('tags', 'featured', 'CONTAINS')
.filter('metadata', '{"active": true}', 'CONTAINED')
.filter('tags', 'premium', 'HAS')
```

**All operators:** `EQUALS`, `NOT EQUALS`, `IN`, `LIKE`, `ILIKE`, `CONTAINS`, `CONTAINED`, `HAS`, `BETWEEN`, `NULL`, `NOT NULL`, `>`, `>=`, `<`, `<=`, and more.

## Sorting

```js
.sort('created_at', 'desc')
.sort('name', 'asc')
```

## Select

Return only specific fields:

```js
.select(['id', 'name', 'slug', 'type', 'stars'])
```

## Joins

```js
// Join addon by field
.join('files', 'cover_id', 'cover')
// → Resolves cover_id into the full file object as 'cover'

// Join addon by array field
.join('countries', 'countries', 'countries')
// → Resolves array of country IDs into full country objects

// Join with field selection
.join('files', 'cover_id', 'cover', ['id', 'hash', 'extension'])
// → Only include specific fields from the joined items

// Multiple joins
.join('files', 'cover_id', 'cover')
.join('files', 'images')
.join('countries', 'countries', 'countries')
.join('cities', 'cities', 'cities')
.join('areas', 'areas', 'areas')
```

## Offset

```js
.offset(50)
```

## Full example

```js
const offerItems = await offers.Find('primary')
    .filter('deleted', false)
    .filter('status', 'Aktivna')
    .filter('organization_id', [...orgIds, 9], 'IN')
    .join('countries', 'countries', 'countries')
    .join('cities', 'cities', 'cities')
    .join('areas', 'areas', 'areas')
    .sort('score', 'desc')
    .select(['id', 'name', 'slug', 'type', 'stars', 'pricing'])
    .page(1)
    .limit(12)
    .many();

offerItems.forEach(offer => {
    console.log(offer.Get('name'), offer.Get('stars'));
});
```
