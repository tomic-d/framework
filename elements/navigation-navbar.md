# navigation-navbar

Top navigation bar with logo, links, dropdowns, breadcrumbs, user menu, notifications bell, scroll behaviors and mobile drawer.

## Usage

```html
<e-navigation-navbar
    :logo="logoUrl"
    :items="[
        { id: 'discover', icon: 'explore', label: 'Discover', href: '/discover' },
        { id: 'trips', icon: 'luggage', label: 'Trips', href: '/trips', badge: 3 },
        { id: 'settings', label: 'Settings', href: '/settings', position: 'right' }
    ]"
    :user="{ name: 'Ana', email: 'ana@travel.com', avatar: '/avatar.jpg' }"
    :userMenu="[
        { icon: 'person', label: 'Profile', href: '/profile' },
        { separator: true },
        { icon: 'logout', label: 'Sign out', href: '/signout' }
    ]"
    :notifications="5"
    notificationsHref="/notifications"
    :variant="['border']"
></e-navigation-navbar>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| logo | string | `''` | | Logo image URL |
| logoAlt | string | `'Logo'` | | Logo alt text |
| brandHref | string | `'/'` | | Logo link destination |
| items | array | `[]` | | Nav links `{ id, icon, label, href, target, position, match, badge, disabled, children }` |
| crumbs | array | `[]` | | Breadcrumb trail `{ icon, label, href }`. Replaces logo |
| user | object | `null` | | User `{ name, email, avatar, role }` |
| userMenu | array | `[]` | | User dropdown `{ icon, label, href, separator }` |
| notifications | number | `0` | | Unread count on bell |
| notificationsHref | string | `''` | | Bell link |
| sticky | boolean | `true` | | Stick to top |
| scrollHide | boolean | `false` | | Hide on scroll down |
| shrinkOnScroll | boolean | `true` | | Reduce height after scroll |
| blur | boolean | `false` | | Glassmorphism backdrop |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| variant | array | `['border']` | `border` `clean` | Visual modifiers |
| _search | function | | | Search callback |

## Slots

- **banner** — top announcement bar
- **actions** — buttons in right section

## Features

- Items with `children` array open dropdown popup on click.
- `position: 'right'` moves item to right nav section.
- `match` string or array for custom active route matching.
- User trigger opens popup menu with avatar, name, email and links.
- Mobile: burger toggles drawer with all items, user info and menu.
