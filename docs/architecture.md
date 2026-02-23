# Architecture

## File structure

```
lib/                     Core OneType class + 17 mixins
  load.js                Entry point — creates OneType instance, handles signals
  src/
    onetype.js           Main class (mixin-composed)
    mixins/              Addons, Emitter, Middleware, Data, DOM, Route,
                         Function, Generate, Binaries, Helper, Cookie, and more
    classes/
      addon/             OneTypeAddon + mixins (fields, items, functions, find, render, store)
        classes/
          item/          OneTypeAddonItem + mixins (get, set, crud, functions, store)
          render/        OneTypeAddonRender + mixins (compile, dom, process, events)

addons/                  Built-in addon library
  core/
    database/            PostgreSQL ORM (Knex, fluent query builder, 17+ operators)
    servers/             HTTP + gRPC servers
    clients/             HTTP + gRPC clients
    commands/            Typed API command system
    queue/               Concurrency task queue
  render/
    directives/          ot-if, ot-for, ot-click, ot-fetch, ot-show, ot-html, ot-text
    pages/               SPA page router with CSS Grid layouts + async data loading
    elements/            40+ pre-built UI components
    assets/              Convention-based asset bundler (terser)
    html/                HTML document builder
    tags/                HTML tag system
    transforms/          Data transforms
  modules/
    variables/           Named variable registry
    actions/             Action triggers
    events/              Event bindings
    schedules/           Cron-like scheduling
    shortcuts/           Keyboard shortcut bindings
    sources/             Data source registry
  float/
    modals/              Modal dialogs
    toasts/              Toast notifications
    tooltips/            Tooltip system
    popups/              Popup menus
    overlays/            Overlay backdrops
```

## Application structure

A typical application built on the framework:

```
my-app/
  package.json           Import aliases (#framework/*, #database/*, etc.)
  index.js               Entry point — imports framework, addons, database, servers
  addons/
    users/               Application addon
      addon.js
      load.js
      functions/
      items/commands/
      item/catch/
      events/
  items/
    database/
      primary.js         Database connection
    servers/
      http.js            HTTP server config
```

Entry point:

```js
import onetype from '#framework/load.js';
import commands from '#commands/load.js';
import database from '#database/load.js';

import './addons/users/load.js';
import './addons/offers/load.js';

import './items/database/primary.js';
import './items/servers/http.js';
```

## Import aliases

The framework uses Node.js package imports (`#` prefix) defined in `package.json`:

```json
{
    "imports": {
        "#framework/*": "./lib/*",
        "#database/*": "./addons/core/database/back/*",
        "#servers/*": "./addons/core/servers/back/*",
        "#clients/*": "./addons/core/clients/back/*",
        "#commands/*": "./addons/core/commands/back/*",
        "#queue/*": "./addons/core/queue/back/*",
        "#assets/*": "./addons/render/assets/back/*",
        "#html/*": "./addons/render/html/*",
        "#directives/*": "./addons/render/directives/*",
        "#elements/*": "./addons/render/elements/*",
        "#tags/*": "./addons/render/tags/*"
    }
}
```

## Design decisions

### Mixin composition over inheritance

Both `OneType` and `OneTypeAddon` use `Object.assign(Class.prototype, mixin)`. No class hierarchies, no diamond problems. Each mixin is a plain object of methods that gets merged onto the prototype:

```js
import AddonItemGet from './mixins/get.js';
import AddonItemSet from './mixins/set.js';
import AddonItemCrud from './mixins/crud.js';

Object.assign(OneTypeAddonItem.prototype, AddonItemGet);
Object.assign(OneTypeAddonItem.prototype, AddonItemSet);
Object.assign(OneTypeAddonItem.prototype, AddonItemCrud);
```

### Middleware as the extension point

CRUD operations and queries are middleware chains:
- `item.crud.create` — intercepted by database addon for INSERT
- `item.crud.update` — intercepted for UPDATE
- `item.crud.delete` — intercepted for DELETE
- `addon.items.find` — intercepted for SELECT

Without the database addon, everything works in-memory. Swap storage without touching business logic.

### Self-registering imports

Importing an addon's `load.js` registers it with the framework. No manual wiring, no dependency injection container, no configuration object. `AddonReady` handles async dependency resolution — import order doesn't matter.

### Field transforms

Every field has `get[]` and `set[]` arrays of transform functions plus a `define` schema:

```
Set('name', value)
  → run set[] transforms
  → validate against define schema
  → fire lifecycle callbacks
  → store in item.data
```

Computed fields, type coercion, and normalization are declared at the field level.

### Proxy-driven reactivity

Render components return a `Proxy`. Setting a property schedules a debounced `Update()`:

```
this.count++
  → Proxy trap
  → schedule Update() (16ms debounce)
  → re-compile template
  → DOM diff
  → patch changes
```

Batched updates, no virtual DOM overhead.

### Binary transport over gRPC

gRPC messages are JSON strings. Buffers can't be embedded directly. The framework extracts all Buffer instances into a separate `map<string, bytes>` field before sending:

```
Send: { data: { file: <Buffer> } }
  → extract: { data: { file: "$$bin_0" }, binaries: { "$$bin_0": <Buffer> } }
  → send JSON + binaries separately

Receive:
  → inject: { data: { file: <Buffer> } }
```

Transparent binary transport over the same stream.

### Convention-based bundling

No webpack, no build configuration. The asset bundler:
1. Scans directories recursively
2. Prioritizes `addon.js` files
3. Strips `import`/`export` statements
4. Concatenates by priority order
5. Minifies via terser

ES module source files become a browser-loadable bundle.
