# ARCHITECTURE — Divhunt Framework

*Living technical overview. Updated alongside the code.*

---

## Status: Stable — V2 complete, in maintenance

## Stack

- **Language:** JavaScript (ES Modules, `"type": "module"`)
- **Runtime:** Node.js >= 18 (backend), Browser (frontend bundle)
- **Database:** PostgreSQL via Knex
- **Transport:** HTTP + gRPC
- **Bundling:** Convention-based (terser for minification)
- **SSR:** linkedom for server-side DOM
- **No TypeScript, no test framework, no linter, no build step**

## Project Structure

```
lib/                         Core Divhunt class + 16 mixins
  load.js                    Node.js entry point (creates instance, handles signals)
  browser.js                 Browser entry point (attaches to window, mounts body)
  src/
    divhunt.js               Main class (mixin-composed)
    mixins/                  addons, emitter, middleware, data, dom, route,
                             function, generate, binaries, helper, validate,
                             string, request, logger, dependencies, overrides
    classes/
      addon/                 DivhuntAddon + mixins (fields, items, functions, find, render, store)
        classes/
          item/              DivhuntAddonItem + mixins (get, set, crud, functions, store)
          render/            DivhuntAddonRender + mixins (compile, dom, process, events)

addons/                      Built-in addon library
  core/
    database/                PostgreSQL ORM (Knex, fluent query builder, 17+ operators)
    servers/                 HTTP + gRPC servers
    clients/                 HTTP + gRPC clients
    commands/                Typed API command system
    queue/                   Concurrency task queue
  render/
    directives/              dh-if, dh-for, dh-click, dh-fetch, dh-show, dh-html, dh-text
    pages/                   SPA page router with CSS Grid layouts + async data loading
    elements/                40+ pre-built UI components
    assets/                  Convention-based asset bundler (terser)
    html/                    HTML document builder
    tags/                    HTML tag system
    transforms/              Data transforms
  modules/
    variables/               Named variable registry
    actions/                 Action triggers
    events/                  Event bindings
    schedules/               Cron-like scheduling
    shortcuts/               Keyboard shortcut bindings
    sources/                 Data source registry
  float/
    modals/                  Modal dialogs
    toasts/                  Toast notifications
    tooltips/                Tooltip system
    popups/                  Popup menus
    overlays/                Overlay backdrops

docs/                        Full documentation (6 files)
examples/basic-api/          Minimal working example
```

## Key Classes

| Class | Mixins | Purpose |
|---|---|---|
| Divhunt | 16 | Core engine — addon registry, emitter, middleware, routing, DOM |
| DivhuntAddon | 9 | Addon abstraction — fields, items, functions, find, render, store |
| DivhuntAddonItem | 6 | Single record — get, set, CRUD, functions, store |
| DivhuntAddonRender | 7 | Frontend component — compile, DOM diffing, events, lifecycle |

## Import Aliases

Defined in `package.json` under `imports`:

| Alias | Maps to |
|---|---|
| `#framework/*` | `./lib/*` |
| `#database/*` | `./addons/core/database/back/*` |
| `#servers/*` | `./addons/core/servers/back/*` |
| `#clients/*` | `./addons/core/clients/back/*` |
| `#commands/*` | `./addons/core/commands/back/*` |
| `#queue/*` | `./addons/core/queue/back/*` |
| `#assets/*` | `./addons/render/assets/back/*` |
| `#html/*` | `./addons/render/html/*` |
| `#directives/*` | `./addons/render/directives/*` |
| `#elements/*` | `./addons/render/elements/*` |
| `#tags/*` | `./addons/render/tags/*` |
| `#sources/*` | `./addons/modules/sources/*` |
| `#variables/*` | `./addons/modules/variables/*` |

## Design Decisions

### Mixin composition over inheritance
`Object.assign(Class.prototype, mixin)`. No class hierarchies. Each mixin is a plain object of methods merged onto the prototype.

### Middleware as the extension point
CRUD operations are async middleware chains. Database addon intercepts for SQL. Without database — everything works in-memory. Storage is swappable.

### Self-registering imports
Importing `load.js` registers the addon. No manual wiring, no DI container. `AddonReady` handles async dependency resolution regardless of import order.

### Field transforms
Every field has `get[]` and `set[]` transform arrays plus a `define` schema. Type coercion, validation, and computed fields are declared at the field level.

### Proxy-driven reactivity (frontend)
Property assignment triggers Proxy trap → schedules 16ms debounced `Update()` → re-compile → DOM diff → patch. No virtual DOM.

### Binary transport over gRPC
Buffer instances extracted to separate `map<string, bytes>` before sending. Re-injected on receive. Transparent binary transport over JSON-based gRPC.

### Convention-based bundling
No webpack. Scans directories, prioritizes `addon.js`, strips ES module syntax, concatenates by order, minifies via terser.

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
