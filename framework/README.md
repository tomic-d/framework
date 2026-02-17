## Built with the Divhunt Framework – non-commercial use only. For commercial use, contact dejan@divhunt.com.

# Divhunt Framework

A lightweight, extensible JavaScript framework built around an addon system with powerful data validation, event handling, and DOM manipulation capabilities.

## Core Architecture

The framework consists of a main `Divhunt` class with modular mixins and an extensible addon system:

```
Framework Core
├── Divhunt Class (main)
├── Mixins (functionality)
│   ├── Addons
│   ├── Data Validation
│   ├── Event System
│   ├── Middleware
│   ├── DOM Manipulation
│   └── Utilities
└── Addon System
    ├── DivhuntAddon
    ├── DivhuntAddonItem
    └── DivhuntAddonRender
```

## Quick Start

### Server-side
```javascript
import Divhunt from './framework/load.js';

const divhunt = new Divhunt();

// Create an addon
const users = divhunt.Addon('users', (addon) => {
    addon.Field('name', ['string']);
    addon.Field('email', ['string']);
});

// Add items
users.Item({
    name: 'John Doe',
    email: 'john@example.com'
});
```

### Browser
```html
<script src="framework/browser.js"></script>
<script>
    // window.divhunt is automatically available
    const myAddon = window.divhunt.Addon('myAddon');
</script>
```

## Core Features

### 🔧 Addon System
Create modular, reusable components with built-in validation

### 📊 Data Validation
Powerful schema-based validation with nested objects and arrays

### 🎯 Event System
Publisher-subscriber pattern for decoupled communication

### ⚡ Middleware
Intercept and modify operations with middleware chains

### 🌐 DOM Manipulation
Efficient DOM operations with state preservation

### 🛠️ Utilities
Helper functions for common operations and data manipulation

## Documentation

- [Installation](./docs/installation.md)
- [Addons](./docs/addons.md)
- [Data Validation](./docs/data-validation.md)
- [Events & Middleware](./docs/events-middleware.md)
- [DOM Manipulation](./docs/dom.md)
- [Utilities](./docs/utilities.md)
- [API Reference](./docs/api-reference.md)

## Example Usage

```javascript
// Create a blog addon
const blog = divhunt.Addon('blog', (addon) => {
    addon.Field('title', ['string', '', true]);
    addon.Field('content', ['string', '', true]);
    addon.Field('author', ['object', {}, true], null, null, false, {
        name: ['string'],
        email: ['string']
    });
    addon.Field('tags', ['array'], null, null, false, {
        each: ['string']
    });
});

// Add a post
const post = blog.Item({
    title: 'Getting Started',
    content: 'Welcome to our blog...',
    author: {
        name: 'Jane Smith',
        email: 'jane@example.com'
    },
    tags: ['tutorial', 'getting-started']
});

// Listen for events
divhunt.EmitOn('addon.item.add', (addon, item) => {
    console.log(`New item added to ${addon.GetName()}`);
});

// Custom function
blog.Fn('getByTag', function(tag) {
    return Object.values(this.Items()).filter(item => 
        item.Get('tags').includes(tag)
    );
});

// Use the function
const tutorials = blog.Fn('getByTag', 'tutorial');
```

## License

Licensed under the Divhunt Framework License. See LICENSE.txt for terms.