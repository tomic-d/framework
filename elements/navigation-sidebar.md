# navigation-sidebar

Secondary navigation sidebar with grouped items, header, badges, bottom placement and slots.
Fixed 260px width, fills parent height, scrolls on overflow.

## Usage

```html
<e-navigation-sidebar
    title="Travel"
    subtitle="Plan trips with agents"
    version="v2.0.53"
    :groups="[
        {
            title: 'Main',
            items: [
                { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
                { icon: 'flight', label: 'Trips', href: '/trips', badge: 3 },
                { icon: 'star', label: 'Premium', href: '/premium', soon: true }
            ]
        },
        {
            title: 'Account',
            placement: 'bottom',
            items: [
                { icon: 'settings', label: 'Settings', href: '/settings' },
                { icon: 'logout', label: 'Sign out', href: '/signout' }
            ]
        }
    ]"
    background="bg-2"
    :variant="['border-right']"
    :_click="({ value }) => navigate(value)"
></e-navigation-sidebar>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| title | string | `''` | | Header title |
| subtitle | string | `''` | | Header subtitle |
| version | string | `''` | | Version pill badge |
| groups | array | `[]` | | Nav groups `{ title, placement, items }` |
| active | string | `''` | | Active item value for manual control |
| background | string | `'bg-2'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| variant | array | `['border-right']` | `border` `border-top` `border-right` `border-bottom` `border-left` | Border modifiers |
| _click | function | | | Item click `{ event, value }` |

## Item format

```js
{ icon, label, href, target, match, value, badge, count, soon, disabled }
```

- **badge** — brand pill (number or text)
- **count** — subtle neutral pill
- **soon** — greyed out with "Soon" tag
- **match** — exact path match for active state
- **value** — manual active match against `active` prop

## Slots

- **top** — custom content in header
- **bottom** — custom content in footer

## Active detection

Priority: `value` match → `match` exact → `href` startsWith. Active items get brand highlight + left bar indicator.
