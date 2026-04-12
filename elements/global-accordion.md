# global-accordion

Expandable panel list with icons, descriptions, single or multiple open mode.
Three visual tones: rows (divided list), cards (separated cards), minimal (borderless).

## Usage

```html
<e-global-accordion :items="faq" active="first" background="bg-2" :variant="['border']"></e-global-accordion>
<e-global-accordion :items="faq" tone="cards" :_change="onToggle"></e-global-accordion>
<e-global-accordion :items="faq" tone="minimal" size="s"></e-global-accordion>
<e-global-accordion :items="faq" :active="['a', 'b']" :multiple="true"></e-global-accordion>
```

## Items format

```js
[
    { id: 'cancel', title: 'Can I cancel?', icon: 'help', description: 'Refund policy', content: '<p>Yes, up to 48h before.</p>' },
    { id: 'locked', title: 'Group bookings', icon: 'lock', disabled: true, content: '<p>Phone only.</p>' }
]
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| items | array | `[]` | | Panel items `{ id, title, description?, icon?, content, disabled? }` |
| active | string\|array | | | Open panel id(s) |
| multiple | boolean | `false` | | Allow multiple panels open |
| tone | string | `'rows'` | `rows` `cards` `minimal` | Visual tone |
| background | string | `''` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| size | string | `'m'` | `s` `m` `l` | Accordion size |
| variant | array | `[]` | `border` `border-top` `border-right` `border-bottom` `border-left` | Border modifiers |
| _change | function | | | Toggle handler `{ event, value }` |

## Axes

**tone** = layout style: `rows` (divided list), `cards` (separate bordered cards), `minimal` (flush, no padding).
**background** = surface depth. Cards tone auto-inverts item bg (bg-2 container → bg-1 cards).
**variant** = border modifiers, auto-match background border color.
