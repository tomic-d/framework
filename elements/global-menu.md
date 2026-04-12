# global-menu

Context menu with icons, descriptions, shortcuts, badges, nested submenus and color accents.
Supports action, link, separator and header entry types.

## Usage

```html
<e-global-menu :items="items" :_select="onSelect"></e-global-menu>
<e-global-menu :items="items" tone="contextual" size="s"></e-global-menu>
<e-global-menu :items="items" tone="flush" background="bg-3"></e-global-menu>
<e-global-menu :items="items" :variant="['border-bottom']"></e-global-menu>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| items | array | `[]` | | Menu entries (see below) |
| tone | string | `'default'` | `default` `contextual` `flush` `bordered` | Container style |
| background | string | `''` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| size | string | `'m'` | `s` `m` `l` | Row height |
| variant | array | `[]` | `border` `border-top` `border-right` `border-bottom` `border-left` | Border modifiers |
| depth | number | `0` | | Nesting depth (auto-incremented) |
| _select | function | | | Select handler `{ event, value }` |

## Item format

```js
{
    type: 'action',         // action, link, separator, header
    id: 'edit',             // unique id
    label: 'Edit',          // display label
    description: 'Edit…',  // secondary line
    icon: 'edit',           // leading icon
    iconRight: 'open',      // trailing icon
    shortcut: '⌘E',        // keyboard hint
    badge: 3,               // count or text badge
    value: 'edit',          // value sent to _select
    href: '/edit',          // link URL (type: link)
    target: '_blank',       // link target
    active: false,          // active highlight
    disabled: false,        // disabled state
    danger: false,          // red accent
    color: 'brand',         // icon color: brand, blue, red, orange, green
    items: []               // nested submenu entries
}
```

## Axes

**tone** = container style: `default` (bg-2 card), `contextual` (floating shadow), `flush` (transparent), `bordered` (outline only).
**background** = overrides surface: `bg-1` through `bg-4`. Auto-adapts hover, shortcut and separator colors.
**size** = row height and text scale: `s`, `m`, `l`.
