# Addons

Everything in the framework is an addon. An addon is a typed, persistent entity with fields, items, functions, lifecycle events, and in-memory storage.

## Defining an addon

An addon is defined in an `addon.js` file:

```js
import divhunt from '#framework/load.js';

const users = divhunt.Addon('users', (addon) => {
    addon.Table('users');

    addon.Field('id', ['string']);
    addon.Field('name', ['string']);
    addon.Field('email', ['string']);
    addon.Field('password', ['string']);
    addon.Field('is_verified', ['boolean']);
    addon.Field('created_at', ['string']);
});

export default users;
```

## Table

`addon.Table(tableName, columnPrefix)` maps the addon to a PostgreSQL table.

```js
addon.Table('offers', 'offer_');
```

With prefix `offer_`, field `name` maps to column `offer_name` in the database. Without a prefix, field names match column names directly.

## Fields

`addon.Field(name, [type, default, required])`

```js
addon.Field('id', ['number|string']);            // union type
addon.Field('name', ['string', null, true]);     // required
addon.Field('status', ['string', 'Draft']);       // with default
addon.Field('tags', ['array']);
addon.Field('metadata', ['object']);
addon.Field('active', ['boolean', false]);
```

**Types:** `string`, `number`, `boolean`, `array`, `object`, `function`, `binary`.

**Union types:** `'number|string'` accepts either type.

Every `Get()` and `Set()` runs through field transform pipelines (`get[]`, `set[]`) then validates against the schema.

## Items

Items are instances of an addon. Full CRUD through middleware chains.

```js
// Create an item (in-memory)
const user = users.Item({
    name: 'Dejan',
    email: 'hi@iamdejan.com'
});

// Persist to database
await user.Create();

// Read fields
user.Get('name');                                    // single field
user.Get(['id', 'name', 'email', 'created_at']);     // multiple → plain object

// Update
user.Set('name', 'Dejan Tomic');
await user.Update();

// Delete
await user.Delete();

// Remove from memory (without database delete)
user.Remove();
```

### Bulk operations

```js
// Add multiple items at once
addon.ItemsAdd(items, null, false);

// Remove all items from memory
addon.ItemsRemove(false);

// Get all items
const all = Object.values(addon.Items());
```

### Get by ID

```js
const user = users.Item(42);          // get by ID
const user = users.ItemGet(42);       // same thing
```

## Functions

Functions are reusable business logic attached to an addon.

```js
// Define
users.Fn('password.hash', async function(password) {
    return await bcrypt.hash(password, 10);
});

users.Fn('password.verify', async function(password, hash) {
    return await bcrypt.compare(password, hash);
});

// Call
const hash = await users.Fn('password.hash', 'secret123');
const valid = await users.Fn('password.verify', 'secret123', hash);
```

Functions can have any number of arguments. Inside the function, `this` gives access to the addon's methods.

## Lifecycle events

React to item operations:

```js
// When an item is added
users.ItemOn('add', function(item) {
    console.log('User added:', item.Get('name'));
});

// When a field is set
users.ItemOn('set', async function(item, key, value) {
    if (key === 'password' && value) {
        // false = skip callbacks, prevents infinite loop
        item.Set('password', await users.Fn('password.hash', value), false);
    }
});

// When an item is modified (before data changes)
users.ItemOn('modify', function(item, key, value, prevValue) {
    console.log(`${key}: ${prevValue} → ${value}`);
});

// When an item is removed
users.ItemOn('remove', function(item) {
    console.log('User removed:', item.Get('id'));
});
```

**Available events:** `add`, `added`, `set`, `modify`, `modified`, `remove`, `removed`.

The `callback` parameter on `Set(key, value, callback)` controls whether lifecycle events fire. Pass `false` to skip them — essential when setting values inside a `set` listener to avoid loops.

## AddonReady

Wait for an addon to be loaded before using it:

```js
divhunt.AddonReady('commands', (commands) => {
    commands.Item({
        id: 'users:create',
        method: 'POST',
        endpoint: '/api/users',
        // ...
    });
});
```

Import order doesn't matter. `AddonReady` handles async dependency resolution.

## Preloading data

Load database data into memory on startup:

```js
divhunt.AddonReady('organizations', async function(organizations) {
    await organizations.Find()?.limit(50000).many(true);
    console.log(`Loaded ${Object.keys(organizations.Items()).length} items`);

    // Optional: periodic refresh
    setInterval(async () => {
        const items = await organizations.Find()?.limit(50000).many();
        organizations.ItemsRemove(false);
        items.forEach(item => organizations.Item(item.data));
    }, 600000);
});
```

`.many(true)` loads query results into in-memory addon storage.

## Store

Per-item and per-addon in-memory key-value storage:

```js
// Set
connection.StoreSet('node', nodeItem);
connection.StoreSet('stream', streamObject);

// Get
const node = connection.StoreGet('node');
const stream = connection.StoreGet('stream');
```

Useful for attaching runtime state to items without persisting it.

## DataSchema

Register a named schema for use in command `in`/`out` validation:

```js
divhunt.DataSchema('user', {
    id: ['string'],
    name: ['string', null, true],
    email: ['string', null, true],
    is_verified: ['boolean'],
    created_at: ['string']
});
```

Reference it in commands with `config: 'user'`.

## Addon file structure

Each addon follows this convention:

```
addons/users/
    addon.js              Define addon, table, fields
    load.js               Import addon + commands + functions + events
    functions/
        password/
            hash.js
            verify.js
    items/
        commands/
            create.js
            get.many.js
            get.one.js
            update.js
            delete.js
    item/
        catch/
            set.js        Lifecycle hooks
    events/
        ready.back.js     Startup logic (preload data, etc.)
```

The `load.js` file imports everything and is the single entry point:

```js
import divhunt from '#framework/load.js';
import users from './addon.js';

import './items/commands/create.js';
import './items/commands/get.many.js';
import './items/commands/get.one.js';
import './items/commands/update.js';
import './items/commands/delete.js';

import './functions/password/hash.js';
import './functions/password/verify.js';

import './item/catch/set.js';

import './events/ready.back.js';

divhunt.DataSchema('user', {
    id: ['string'],
    name: ['string', null, true],
    email: ['string', null, true],
    is_verified: ['boolean'],
    created_at: ['string']
});

export default users;
```
