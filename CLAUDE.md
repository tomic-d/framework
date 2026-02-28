# OneType Framework

Full-stack isomorphic JavaScript framework. One abstraction — the **addon** — powers databases, servers, commands, pages, directives, queues, and more. Published on npm as `@onetype/framework`.

## Stack

- JavaScript (ES Modules, `"type": "module"`)
- Node.js >= 18 (backend), Browser (frontend bundle)
- PostgreSQL via Knex
- HTTP + gRPC transport
- Convention-based bundling (terser for minification)
- linkedom for server-side DOM
- No TypeScript, no test framework, no linter, no build step

## Structure

```
lib/
  load.js                    Node entry — creates instance, registers assets, handles signals
  browser.js                 Browser entry — attaches to window, mounts body
  events.js                  Event definitions
  src/
    onetype.js               Main class (22 mixins composed via Object.assign)
    mixins/                  addons, emitter, middleware, data, dom, route, function,
                             generate, binaries, helper, validate, string, request,
                             logger, dependencies, overrides, error, crypto, form,
                             cookie, state, assets
    classes/
      addon/                 OneTypeAddon (9 mixins: fields, items, functions, find,
                             get, remove, render, store, table)
        classes/
          item/              OneTypeAddonItem (6 mixins: get, set, crud, functions, remove, store)
          render/            OneTypeAddonRender (7 mixins: compile, dom, process, events, get, set, methods)
      error/                 OneTypeError (extends Error — code, message, context)
  items/
    directives/              23 built-in directives (ot-if, ot-for, ot-click, ot-fetch, etc.)
    elements/                28 UI components in 5 groups:
                               form/ (button, checkbox, field, input, radio, rating, section, slider, textarea)
                               global/ (card, code, faq, heading, markdown, notice, parameters, tags)
                               navigation/ (navbar, sidebar, tabs)
                               sections/ (footer, hero, pricing, stats)
                               status/ (code, empty, error, loading)
    transforms/              12 transform types (accordion, chart[8], codeflask, codemirror,
                             comparison, heatmap, interact, particles, sparkline, swiper, tabs, typed)

addons/
  core/
    database/                PostgreSQL ORM (Knex, fluent query builder, 17+ operators)
    servers/                 HTTP + gRPC servers
    clients/                 HTTP + gRPC clients
    commands/                Typed API command system (core/back/front split)
    queue/                   Concurrency task queue
    assets/                  Convention-based asset bundler (terser)
  render/
    directives/              Directive addon (registers directives from lib/items/directives/)
    elements/                Element addon (registers elements from lib/items/elements/)
    pages/                   SPA page router with CSS Grid layouts (core/front split)
    html/                    HTML document builder
    tags/                    HTML tag system
    transforms/              Data transforms addon
  modules/
    variables/               Named variable registry
    actions/                 Action triggers
    events/                  Event bindings
    schedules/               Cron-like scheduling
    shortcuts/               Keyboard shortcut bindings
    sources/                 Data source registry
    bugs/                    Bug tracking
  float/
    modals/                  Modal dialogs
    toasts/                  Toast notifications
    tooltips/                Tooltip system
    popups/                  Popup menus
    overlays/                Overlay backdrops

docs/                        6 docs: addons, architecture, commands, database, frontend, servers
examples/
  basic-api/                 Minimal backend API example
  basic-front/               Frontend + backend example with assets
```

## Key Patterns

**Mixin composition** — `Object.assign(Class.prototype, mixin)`. No class hierarchies. Each mixin is a plain object of methods.

**Addon as universal abstraction** — Every entity (users, pages, commands) is an addon with the same interface: fields, items, functions, events, middleware.

**Self-registering imports** — Importing `load.js` registers the addon. No manual wiring. `AddonReady` resolves async dependencies regardless of import order.

**Middleware chains** — CRUD operations are async middleware chains. Database addon intercepts for SQL. Without database, everything works in-memory.

**Proxy-driven reactivity** — Property assignment triggers Proxy trap, schedules 16ms debounced `Update()`, re-compiles, DOM diffs, patches. No virtual DOM.

**Field transforms** — Every field has `get[]` and `set[]` transform arrays plus a `define` schema. Type coercion, validation, and computed fields at the field level.

**Convention-based bundling** — Scans directories, prioritizes `addon.js`, strips ES module syntax, concatenates by order, minifies via terser.

**Addon folder split (core/back/front)** — Addons with both environments use `core/` (shared), `back/` (server-only), `front/` (browser-only). Import alias points to addon root.

**Binary transport** — Buffer instances extracted to separate `map<string, bytes>` before gRPC send, re-injected on receive.

**Structured errors** — `onetype.Error(code, message, context)` returns `OneTypeError extends Error`. HTTP-compatible codes. Emits `'error'` event.

## Import Aliases

Defined in `package.json` under `imports`:

| Alias | Maps to |
|---|---|
| `#framework/*` | `./lib/*` |
| `#database/*` | `./addons/core/database/back/*` |
| `#servers/*` | `./addons/core/servers/back/*` |
| `#clients/*` | `./addons/core/clients/back/*` |
| `#commands/*` | `./addons/core/commands/*` |
| `#queue/*` | `./addons/core/queue/back/*` |
| `#assets/*` | `./addons/core/assets/back/*` |
| `#html/*` | `./addons/render/html/*` |
| `#directives/*` | `./addons/render/directives/*` |
| `#elements/*` | `./addons/render/elements/*` |
| `#pages/*` | `./addons/render/pages/*` |
| `#tags/*` | `./addons/render/tags/*` |
| `#sources/*` | `./addons/modules/sources/*` |
| `#variables/*` | `./addons/modules/variables/*` |

## Dependencies

| Package | Purpose |
|---|---|
| knex | SQL query builder |
| pg | PostgreSQL driver |
| @grpc/grpc-js | gRPC server/client |
| @grpc/proto-loader | gRPC proto loading |
| bcrypt | Password hashing |
| busboy | Multipart/file upload parsing |
| dotenv | Environment config |
| linkedom | Server-side DOM |
| terser | JS minification |

## Run / Build / Test

```bash
# Install
npm install

# No build step — runs directly as ES modules

# Run example
cd examples/basic-api && npm install && node index.js
cd examples/basic-front && npm install && node index.js

# No test suite
```

## Ecosystem

Part of the OneType platform (onetype.ai). Powers all OneType apps:
- **transforms-app** — Transforms dashboard
- **auth-app** — Authentication UI
- **billing-app** — Billing/subscription UI
- **docs-app** — Document editor
- **onetype-app** — Main application (queued)
- **onetype-web** — Marketing website

GitHub: `onetype-ai/framework` | npm: `@onetype/framework` | License: MIT

## Git

- SSH remote: `git@github-onetype:onetype-ai/framework.git`
- Commit style: short, lowercase, imperative, no period
- No Co-Authored-By lines

## Code Style

- Match existing patterns exactly
- Short, single-word names, no abbreviations
- Clean, focused, single-purpose functions
- Allman brace style (braces on own line)
