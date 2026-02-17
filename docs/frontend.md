# Frontend

Proxy-based reactivity with DOM diffing, Vue-like directives, SPA page routing, and convention-based asset bundling.

## Pages

Pages define routes with async data loading, CSS Grid layouts, and template areas.

```js
pages.ItemAdd({
    id: 'home',
    route: '/',
    title: 'Home',
    grid: {
        template: '"content"',
        columns: '1fr',
        rows: '1fr'
    },
    areas: {
        content: function() {
            return `
                <div class="page-home">
                    <c-navbar></c-navbar>
                    <c-hero title="Welcome"></c-hero>
                    <c-footer></c-footer>
                </div>
            `;
        }
    }
});
```

### Route params

```js
pages.ItemAdd({
    id: 'offer',
    route: '/ponuda/:id/:type/:location/:name',
    // ...
});
```

Params are available in `this.parameters`:

```js
areas: {
    content: function() {
        const id = this.parameters.id;
        // ...
    }
}
```

### Multiple routes

```js
route: ['/offers', '/offers/:type/:value']
```

### Async data loading

The `data` function runs before render:

```js
pages.ItemAdd({
    id: 'offer',
    route: '/ponuda/:id/:type/:location/:name',

    title: function(parameters, data) {
        return data?.offer?.name || 'Offer';
    },

    data: async function(parameters) {
        const offer = await offers.Find()
            .filter('id', parameters.id)
            .join('files', 'cover_id', 'cover')
            .join('countries', 'countries', 'countries')
            .join('cities', 'cities', 'cities')
            .one();

        return { offer: offer ? offer.data : null };
    },

    areas: {
        content: function() {
            this.offer = this.data.offer || {};

            return `
                <div>
                    <h1>{{ offer.name }}</h1>
                    <span dh-if="offer.stars">{{ offer.stars }} stars</span>
                </div>
            `;
        }
    }
});
```

### Interactive pages

Pages can have local state and methods:

```js
areas: {
    content: function() {
        this.items = [];
        this.page = 1;
        this.total = 0;

        this.fetch = async () => {
            const result = await offers.Find()
                .filter('status', 'Aktivna')
                .sort('score', 'desc')
                .page(this.page)
                .limit(12)
                .plain();

            this.items = result.items;
            this.total = result.total;
        };

        this.handlePageChange = (newPage) => {
            this.page = newPage;
            this.fetch();
        };

        this.fetch();

        return `
            <div>
                <span>{{ total }} results</span>

                <div dh-if="items.length > 0" class="grid">
                    <a dh-for="offer in items" :href="'/offer/' + offer.id">
                        <c-offer-card :offer="offer"></c-offer-card>
                    </a>
                </div>

                <c-pagination
                    :page="page"
                    :pages="Math.ceil(total / 12)"
                    :_change="handlePageChange"
                ></c-pagination>
            </div>
        `;
    }
}
```

Setting `this.items`, `this.page`, or `this.total` triggers a 16ms debounced re-render with DOM diffing.

## Components

Reusable UI elements with typed config and template rendering.

```js
components.ItemAdd({
    id: 'hero',
    config: {
        title: { type: 'string', value: 'Page Title' },
        subtitle: { type: 'string', value: '' },
        image: { type: 'string', value: '' },
        variant: { type: 'array', value: [], options: ['compact', 'tall'] }
    },
    render: function() {
        return `
            <section class="holder" :style="'background-image: url(' + image + ')'">
                <div class="overlay"></div>
                <div class="content">
                    <slot name="top"></slot>
                    <h1>{{ title }}</h1>
                    <p dh-if="subtitle">{{ subtitle }}</p>
                </div>
            </section>
        `;
    }
});
```

### Using components

Components become custom elements prefixed with `c-`:

```html
<c-hero title="Our Offers" subtitle="Find your trip" image="/hero.jpg">
    <div slot="top">
        <c-breadcrumb :items="[{label: 'Home', href: '/'}, {label: 'Offers'}]"></c-breadcrumb>
    </div>
</c-hero>
```

### Config types

```js
config: {
    title: { type: 'string', value: 'Default' },
    count: { type: 'number', value: 0 },
    active: { type: 'boolean', value: true },
    items: { type: 'array', value: [] },
    data: { type: 'object', value: {} },
    variant: { type: 'array', value: [], options: ['size-s', 'size-m', 'size-l'] },
    _click: { type: 'function' },        // callback (prefixed with _)
    _change: { type: 'function' }
}
```

### Component with logic

```js
components.ItemAdd({
    id: 'pagination',
    config: {
        page: { type: 'number', value: 1 },
        pages: { type: 'number', value: 1 },
        _change: { type: 'function' }
    },
    render: function() {
        this.goToPage = (num) => {
            if (num >= 1 && num <= this.pages) {
                this.page = num;
                if (this._change) this._change(num);
            }
        };

        return `
            <div class="pagination">
                <button dh-click="() => goToPage(page - 1)" :disabled="page === 1">Prev</button>
                <span>{{ page }} / {{ pages }}</span>
                <button dh-click="() => goToPage(page + 1)" :disabled="page === pages">Next</button>
            </div>
        `;
    }
});
```

## Directives

Vue-like syntax, processed during compile with priority ordering.

### Conditional rendering

```html
<div dh-if="items.length > 0">Has items</div>
<div dh-if="!loading">Content loaded</div>
```

### List rendering

```html
<a dh-for="offer in items" :href="'/offer/' + offer.id">
    {{ offer.name }}
</a>

<!-- With index -->
<div dh-for="item, index in items">
    {{ index }}: {{ item.name }}
</div>
```

### Event handlers

```html
<button dh-click="submit">Send</button>
<button dh-click="() => goToPage(3)">Page 3</button>
<input :_input="(e) => form.name = e.target.value">
```

### Dynamic attributes

```html
<img :src="getImage()" :alt="name" loading="lazy">
<div :class="'card ' + (active ? 'active' : '')">
<div :style="'background-image: url(' + image + ')'">
<button :disabled="page === 1">
<article :variant="variant.join(' ')">
```

### Text interpolation

```html
<span>{{ total }} results</span>
<h1>{{ offer.name }}</h1>
<span>{{ getStars() }}</span>
```

### All directives

`dh-if`, `dh-show`, `dh-for`, `dh-click`, `dh-text`, `dh-html`, `dh-fetch`, `dh-render`, `dh-form`, and all DOM event handlers.

## Reactivity

Setting any property on a render context triggers a re-render:

```js
this.count = 0;
this.increment = () => this.count++;  // triggers DOM update
```

Updates are batched with a 16ms debounce. The framework diffs the new DOM against the current DOM and patches only what changed. No virtual DOM — direct DOM diffing.

Lifecycle: `init → render → compile → ready → mount → update → unmount → destroy`.

## Slots

Components can define named slots:

```js
render: function() {
    return `
        <div>
            <slot name="top"></slot>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    `;
}
```

Usage:

```html
<c-layout>
    <div slot="top">Header content</div>
    <p>Default slot content</p>
</c-layout>
```

## Asset bundling

Convention-based bundler that scans directories, strips ES module syntax, concatenates, and minifies.

```js
import assets from '#assets/load.js';

// Scan directories in order
assets.Item({ type: 'js', order: 0, path: 'framework' });
assets.Item({ type: 'js', order: 1, path: 'addons/core/commands/front' });
assets.Item({ type: 'js', order: 1, path: 'addons/render/directives/front' });
assets.Item({ type: 'js', order: 1, path: 'addons/render/pages/front' });

// CSS
assets.Item({ type: 'css', order: 0, path: 'styles' });
assets.Item({ type: 'css', order: 1, path: 'addons/render/elements/front' });
assets.Item({ type: 'css', order: 2, path: 'projects/travel/site/front' });

// Ignore specific files
assets.Item({ type: 'js', order: 0, path: 'framework', ignore: ['framework/load.js'] });
```

### Dynamic content injection

Inject server-side data into the frontend bundle:

```js
assets.Item({
    type: 'js',
    order: 4,
    content: function() {
        const items = Object.values(settings.Items())
            .filter(item => item.Get('organization_id') === 9)
            .map(item => item.data);

        return `settings.ItemsAdd(${JSON.stringify(items)}, null, false);`;
    }
});
```

This runs at bundle time — server-side data becomes available client-side without an API call.

### How it works

1. Scans directories recursively for `.js` or `.css` files
2. Prioritizes `addon.js` files (loaded first)
3. Strips `import`/`export` statements
4. Concatenates by `order` value
5. Minifies via terser

No webpack, no build step, no configuration files.
