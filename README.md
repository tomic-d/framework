# OneType Framework

Full-stack isomorphic JavaScript framework built from scratch. No React, no Express, no Vue: original architecture from zero.

One universal abstraction, the **addon**, powers databases, servers, commands, pages, directives, queues, and more. Define an addon with fields, and you get: data validation, event system, middleware chains, CRUD with PostgreSQL, automatic API exposure, frontend reactivity, and DOM manipulation, all from a single definition.

Built by [Dejan Tomic](https://github.com/tomic-d). Around 43,000 lines across 650+ files and 17 addon categories: its own ORM (SQLite, MySQL, Postgres), HTTP and gRPC servers and clients, task queues, an asset pipeline, a rendering engine with reactive directives, and an AI agents module. Every production project I run consumes it as a versioned npm dependency, including [iamdejan.com](https://iamdejan.com), the site itself.

## Quick Look

```js
import onetype from 'onetype';
import database from 'onetype/database';
import commands from 'onetype/commands';

// Define an addon: typed, persistent, full CRUD
const users = onetype.Addon('users', (addon) => {
    addon.Table('users');
    addon.Field('id', ['string']);
    addon.Field('name', ['string', null, true]);
    addon.Field('email', ['string', null, true]);
    addon.Field('created_at', ['string']);
});

// Connect database: all addons with Table() persist automatically
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
onetype.AddonReady('commands', (commands) => {
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

## What's inside

| Area | What it does |
|---|---|
| Addons | The core abstraction: fields, items, functions, lifecycle events, mixin composition |
| Database | Fluent ORM over SQLite, MySQL and Postgres: query builder, 17+ operators, joins |
| Commands | Typed API endpoints exposed over four transports from one definition |
| Servers and clients | HTTP and gRPC, including streaming and binary transport |
| Rendering | Reactive Proxy-based renders, directives (ot-if, ot-for, ot-click), lifecycle hooks |
| Pages | Routing, grid layouts, SPA navigation |
| Queues | Background task processing |
| Assets | Bundling and serving of JS/CSS from addon folders |
| Agents | AI agents module: tool calling and orchestration primitives |

## Install

```bash
npm install @onetype/framework
```

Requires Node.js >= 18.

## Origin

Originally built as the core of [Divhunt](https://divhunt.com), a cloud SaaS web builder that grew to 30,000+ users. The framework (v1) powered the entire platform, backend and frontend, for 4+ years. This is v2, the foundation of the OneType platform: rebuilt with Proxy-based reactivity, improved addon architecture, gRPC transport, and a complete render system.

## License

[MIT](LICENSE)
