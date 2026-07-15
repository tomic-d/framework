# OneType

**A full-stack JavaScript framework built entirely from scratch — no React, no Vue, no Express.**

Most apps are glued together from a dozen libraries that were never meant to work as one. OneType is the opposite: one idea, the **addon**, runs the whole stack. You describe *what* something is once, and you get the database table, the validated API, the live frontend, and the reactivity — all from that single definition.

Built and maintained by [Dejan Tomic](https://github.com/tomic-d). It powers real production services, including [iamdejan.com](https://iamdejan.com), which runs on it end to end.

---

## The one idea

Define an addon once:

```js
const users = onetype.Addon('users', (addon) => {
    addon.Table('users');
    addon.Field('id',    ['string']);
    addon.Field('name',  ['string', null, true]);
    addon.Field('email', ['string', null, true]);
});
```

From that single definition you automatically get:

- a **PostgreSQL table** with the right columns
- **validation** on every write
- an **event system** and middleware chain around it
- a **typed REST API** you can expose with one flag
- **frontend reactivity** and DOM binding to the same data

No ORM boilerplate, no separate schema files, no wiring the backend to the frontend by hand. The definition *is* the wiring.

## What's inside

Everything a real product needs, written from zero and unified under the addon model:

| Area | What it gives you |
|---|---|
| **Database** | Own ORM over SQLite, MySQL, and PostgreSQL — queries, relations, migrations |
| **Servers** | HTTP and gRPC servers *and* clients, built in |
| **Render** | A reactive rendering engine with directives — components, reactivity, DOM, all from scratch (this is the React/Vue you don't need) |
| **Queue** | Background task queues |
| **Commands** | Typed, exposable API endpoints with input/output validation |
| **Assets** | An asset pipeline |
| **AI** | An agents module for building on top of LLMs |
| **Services** | Cloudflare, Playwright, and other integrations |

The same abstraction spans the database, the server, and the browser — which is what makes it *isomorphic*: one mental model from the SQL row to the rendered pixel.

## Why it exists

I wanted to build entire products alone, at speed, without fighting the seams between someone else's ORM, someone else's router, and someone else's view layer. So I built the layer underneath all of them. It let one person ship and run production software — including a web builder with 30,000+ users — that would normally take a team and a stack of dependencies.

## Quick look — a full API endpoint

```js
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
                .all();

            resolve(items);
        }
    });
});
```

Database access, routing, pagination, and JSON output — no external framework involved.

## Run

```bash
npm install
node demo.js
```

Requires Node.js >= 18. Published on npm as [`@onetype/framework`](https://www.npmjs.com/package/@onetype/framework).

## License

[MIT](LICENSE)
