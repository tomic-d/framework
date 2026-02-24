# Architecture

## File structure

```
lib/                     Core OneType class + mixins
  load.js                Entry point — creates OneType instance, registers all assets, handles signals
  src/
    onetype.js           Main class (mixin-composed)
    mixins/              Addons, Emitter, Middleware, Data, DOM, Route,
                         Function, Generate, Binaries, Helper, Cookie, Assets, and more
    classes/
      addon/             OneTypeAddon + mixins (fields, items, functions, find, render, store)
        classes/
          item/          OneTypeAddonItem + mixins (get, set, crud, functions, store)
          render/        OneTypeAddonRender + mixins (compile, dom, process, events)
  styles/                Shared CSS (variables, reset, queries, utility classes)
  items/
    elements/            Shared UI elements (grouped, IDs are group-prefixed)
      form/              button, checkbox, field, input, radio, rating, section, slider, textarea
      global/            card, code, faq, heading, markdown, notice, parameters, tabs, tags
      sections/          footer, hero, navbar, stats
      status/            code, empty, error, loading
    transforms/          Shared transforms
                         accordion, chart, codeflask, codemirror, comparison,
                         heatmap, interact, particles, sparkline, swiper, tabs, typed

addons/                  Built-in addon library
  core/
    database/            PostgreSQL ORM (Knex, fluent query builder, 17+ operators)
    servers/             HTTP + gRPC servers
    clients/             HTTP + gRPC clients
    commands/            Typed API command system
    queue/               Concurrency task queue
    assets/              Convention-based asset bundler (terser)
  render/
    directives/          ot-if, ot-for, ot-click, ot-fetch, ot-show, ot-html, ot-text
    pages/               SPA page router with CSS Grid layouts + async data loading
    elements/            UI component addon (registration, directives)
    html/                HTML document builder
    tags/                HTML tag system
    transforms/          Transform addon (registration, loading, directives)
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
        "#commands/*": "./addons/core/commands/*",
        "#queue/*": "./addons/core/queue/back/*",
        "#assets/*": "./addons/core/assets/back/*",
        "#html/*": "./addons/render/html/*",
        "#directives/*": "./addons/render/directives/*",
        "#pages/*": "./addons/render/pages/*",
        "#elements/*": "./addons/render/elements/*",
        "#tags/*": "./addons/render/tags/*",
        "#sources/*": "./addons/modules/sources/*",
        "#variables/*": "./addons/modules/variables/*"
    }
}
```

## Design decisions

### Mixin composition over inheritance

Both `OneType` and `OneTypeAddon` use `Object.assign(Class.prototype, mixin)`. No class hierarchies, no diamond problems. Each mixin is a plain object of methods merged onto the prototype:

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

### Centralized asset registry

All asset paths are registered centrally in `lib/load.js` via `onetype.Assets(id, url, config)`. This decouples asset path knowledge from individual addons — the framework controls what gets bundled, regardless of whether a backend addon is loaded.

```js
// lib/load.js — top-level registrations
onetype.Assets('framework', import.meta.url, { js: { path: '.', exclude: ['load.js', 'items', 'styles'] } });
onetype.Assets('styles', import.meta.url, { css: 'styles' });
onetype.Assets('commands', import.meta.url, { js: { path: '../addons/core/commands', exclude: ['../addons/core/commands/back'] } });
```

Shared elements and transforms use `onetype.AddonReady` to register only after their parent addon is loaded. The JS files themselves contain the wrapper:

```js
// lib/items/elements/form/button/button.js
onetype.AddonReady('elements', (elements) =>
{
    elements.ItemAdd({ id: 'form-button', ... });
});

// lib/items/transforms/swiper/swiper.js
onetype.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({ id: 'swiper', ... });
});
```

Element IDs are group-prefixed: `form-button`, `global-card`, `sections-navbar`, `status-loading`. HTML tags follow the same pattern: `<e-form-button>`, `<e-global-card>`, `<e-status-loading>`.

The import function reads from the registry to resolve paths:

```js
assets.Fn('import', ['framework', 'styles', 'commands', 'elements/form/input', 'transforms/swiper']);
```

### Convention-based bundling

No webpack, no build configuration. The asset bundler:
1. Scans directories recursively
2. Prioritizes `addon.js` files
3. Strips `import`/`export` statements
4. Concatenates by priority order
5. Minifies via terser

ES module source files become a browser-loadable bundle.
