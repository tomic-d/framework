# Commands

Every API endpoint is a typed, named operation with validated input and output. Commands work over both HTTP and gRPC.

## Defining a command

```js
import divhunt from '#framework/load.js';
import users from './addon.js';

divhunt.AddonReady('commands', (commands) => {
    commands.Item({
        id: 'users:create',
        method: 'POST',
        endpoint: '/api/users',
        in: {
            name: ['string', null, true],
            email: ['string', null, true],
            password: ['string', null, true]
        },
        out: {
            user: {
                type: 'object',
                config: 'user',
                required: true
            }
        },
        callback: async function(properties, resolve) {
            const user = users.Item({
                name: properties.name,
                email: properties.email,
                password: properties.password
            });

            await user.Create();

            resolve({
                user: user.Get(['id', 'name', 'email', 'created_at'])
            });
        }
    });
});
```

## Command properties

| Property | Description |
|---|---|
| `id` | Unique command identifier |
| `method` | HTTP method: `GET`, `POST`, `PUT`, `DELETE` |
| `endpoint` | URL pattern, supports `:params` (e.g., `/api/users/:id`) |
| `exposed` | If `true`, accessible without authentication |
| `type` | Response type: `'JSON'` (default) or `'HTML'` |
| `in` | Input schema — validated before callback runs |
| `out` | Output schema — validated before response is sent |
| `callback` | `async function(properties, resolve)` |

## Input schema

```js
in: {
    // Simple: [type, default, required]
    name: ['string', null, true],
    limit: ['number', 20],

    // Complex: object with type + config
    filters: {
        type: 'array',
        each: {
            type: 'object',
            config: 'filter'
        }
    }
}
```

Use `'query'` as shorthand for standard list endpoints:

```js
in: 'query'  // accepts filters, sort_field, sort_direction, page, limit
```

## Output schema

```js
out: {
    // Reference a DataSchema
    user: {
        type: 'object',
        config: 'user',
        required: true
    },

    // Array of schema objects
    users: {
        type: 'array',
        each: {
            type: 'object',
            config: 'user'
        }
    },

    // Simple fields
    total: ['number', null, true],
    page: ['number', null, true]
}
```

## Resolve

```js
// Success
resolve({ user: userData });

// Error with status code
resolve(null, 'Not found', 404);

// Streaming (partial response)
resolve(chunk.data, chunk.message, chunk.code, false);
// false = don't close the response
```

## Route params

```js
commands.Item({
    id: 'users:get:one',
    method: 'GET',
    endpoint: '/api/users/:id',
    in: {
        id: ['number', null, true]
    },
    callback: async function(properties, resolve) {
        const user = await users.Find().filter('id', properties.id).one();

        if (!user) return resolve(null, null, 404);

        resolve({
            user: user.Get(['id', 'name', 'email', 'created_at'])
        });
    }
});
```

## CRUD pattern

A complete CRUD set for an addon:

**Create:**
```js
commands.Item({
    id: 'tools:create',
    method: 'POST',
    endpoint: '/api/tools',
    in: {
        name: ['string', null, true],
        slug: ['string', null, true],
        description: ['string']
    },
    callback: async function(properties, resolve) {
        const tool = tools.Item({
            name: properties.name,
            slug: properties.slug,
            description: properties.description
        });
        await tool.Create();
        resolve({ tool: tool.Get(['id', 'name', 'slug', 'description', 'created_at']) });
    }
});
```

**Read many:**
```js
commands.Item({
    id: 'tools:get:many',
    method: 'GET',
    endpoint: '/api/tools',
    exposed: true,
    callback: async function(properties, resolve) {
        let query = tools.Find().sort('name', 'asc');

        if (properties.filters) {
            properties.filters.forEach(f => {
                query = query.filter(f.field, f.value, f.operator || 'EQUALS');
            });
        }

        const total = await query.count();
        const items = await query
            .page(properties.page || 1)
            .limit(properties.limit || 10)
            .many();

        resolve({
            tools: items.map(item => item.Get(['id', 'name', 'slug', 'description'])),
            total,
            page: properties.page || 1,
            limit: properties.limit || 10
        });
    }
});
```

**Update:**
```js
commands.Item({
    id: 'tools:update',
    method: 'PUT',
    endpoint: '/api/tools/:id',
    in: { id: ['number', null, true], name: ['string'], description: ['string'] },
    callback: async function(properties, resolve) {
        const tool = await tools.Find().filter('id', properties.id).one();
        if (!tool) return resolve(null, null, 404);

        if (properties.name !== undefined) tool.Set('name', properties.name);
        if (properties.description !== undefined) tool.Set('description', properties.description);
        await tool.Update();

        resolve({ tool: tool.Get(['id', 'name', 'description', 'updated_at']) });
    }
});
```

**Delete (soft):**
```js
commands.Item({
    id: 'tools:delete',
    method: 'DELETE',
    endpoint: '/api/tools/:id',
    in: { id: ['number', null, true] },
    callback: async function(properties, resolve) {
        const tool = await tools.Find().filter('id', properties.id).one();
        if (!tool) return resolve(null, null, 404);

        tool.Set('deleted_at', new Date().toISOString());
        await tool.Update();

        resolve({ tool: tool.Get(['id', 'name', 'deleted_at']) });
    }
});
```

## Dynamic API registration

Register endpoints at runtime when items are added:

```js
tools.ItemOn('add', function(item) {
    commands.Item({
        exposed: true,
        id: 'tool:' + item.Get('slug'),
        method: 'POST',
        endpoint: '/api/run/' + item.Get('slug'),
        in: item.Get('config_in'),
        out: item.Get('config_out'),
        callback: async function(properties, resolve) {
            // Route to a worker node via gRPC
            const connections = Object.values(streams.Items()).filter(s =>
                s.StoreGet('node').Get('tools').includes(item.Get('id'))
            );

            const stream = connections[Math.floor(Math.random() * connections.length)]
                .StoreGet('stream');
            const response = await stream.request(item.Get('slug'), properties);
            resolve(response.data, response.message, response.code);
        }
    });
});
```

When a tool is added to the database, an API endpoint appears automatically. Remove the tool, the endpoint disappears.

## HTML commands

Serve HTML responses (for SSR):

```js
commands.Item({
    id: 'html',
    exposed: true,
    method: 'GET',
    endpoint: '*',
    type: 'HTML',
    callback: async function(properties, resolve) {
        resolve(html.Fn('render', {
            head: () => '<title>My App</title>',
            body: () => '<div id="app"></div>'
        }));
    }
});
```

## HTTP context

Inside a command callback, access the HTTP request:

```js
callback: async function(properties, resolve) {
    const pathname = this.http.url.pathname;
    const ip = this.http?.user?.ip;

    // Raw response for custom handling
    this.http.raw.writeHead(301, { 'Location': '/new-url' });
    this.http.raw.end();
    this.http.prevent = true;
    resolve({});
}
```
