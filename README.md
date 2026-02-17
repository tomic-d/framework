# Divhunt Framework

Full-stack isomorphic JavaScript framework built from scratch. No React, no Express, no Vue — original architecture from zero.

One universal abstraction — the **addon** — powers databases, servers, commands, pages, directives, queues, and more. Define an addon with fields, and you get: data validation, event system, middleware chains, CRUD with PostgreSQL, automatic API exposure, frontend reactivity, and DOM manipulation — all from a single definition.

Built by [Dejan Tomic](https://github.com/tomic-d). Powers multiple production applications including a cloud SaaS platform serving thousands of users, a travel agency website with 27 addons and 50+ frontend components, a distributed function execution gateway, and a multi-tenant CMS.

## Quick Look

```js
import divhunt from '#framework/load.js';
import database from '#database/load.js';
import commands from '#commands/load.js';

// Define an addon — typed, persistent, full CRUD
const users = divhunt.Addon('users', (addon) => {
    addon.Table('users');
    addon.Field('id', ['string']);
    addon.Field('name', ['string', null, true]);
    addon.Field('email', ['string', null, true]);
    addon.Field('created_at', ['string']);
});

// Connect database — all addons with Table() persist automatically
database.Item({
    id: 'primary',
    hostname: process.env.DB_HOSTNAME,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
});

// Start HTTP server
commands.Fn('http.server', 3000, {
    onStart: () => console.log('Server started on port 3000')
});

// Define an API endpoint with typed input/output
divhunt.AddonReady('commands', (commands) => {
    commands.Item({
        id: 'users:get:many',
        method: 'GET',
        endpoint: '/api/users',
        exposed: true,
        callback: async function(properties, resolve) {
            const items = await users.Find()
                .sort('created_at', 'desc')
                .page(properties.page || 1)
                .limit(properties.limit || 20)
                .many();

            resolve({
                users: items.map(u => u.Get(['id', 'name', 'email', 'created_at']))
            });
        }
    });
});
```

## Documentation

| Topic | What's covered |
|---|---|
| [Addons](docs/addons.md) | Addon definition, fields, functions, lifecycle events, preloading |
| [Database](docs/database.md) | Connection, fluent ORM, query builder, 17+ operators, joins |
| [Commands](docs/commands.md) | API endpoints, typed input/output, CRUD patterns, dynamic registration |
| [Servers](docs/servers.md) | HTTP setup, gRPC streaming, binary transport, Store API |
| [Frontend](docs/frontend.md) | Pages, components, directives, asset bundling, reactivity |
| [Architecture](docs/architecture.md) | File structure, design decisions, mixin composition |

## Install

```bash
npm install divhunt
```

Requires Node.js >= 18.

## Origin

Originally built as the core of [Divhunt](https://divhunt.com), a cloud SaaS platform. The framework (v1) powered the entire platform — backend and frontend — serving thousands of users for 4+ years. This is v2: rebuilt with Proxy-based reactivity, improved addon architecture, gRPC transport, and a complete render system.

## License

[MIT](LICENSE)
