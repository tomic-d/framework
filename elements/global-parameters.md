# global-parameters

Parameter list with type badges, required/deprecated/since flags, default values, enum options and nested children. Three layout tones: rows, compact and cards.

## Usage

```html
<e-global-parameters :items="params" tone="rows"></e-global-parameters>
<e-global-parameters :items="params" tone="compact" background="bg-2"></e-global-parameters>
<e-global-parameters :items="params" tone="cards" background="bg-2"></e-global-parameters>
<e-global-parameters :items="params" tone="rows" :variant="['border']"></e-global-parameters>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| items | array | `[]` | | Parameter items (see format below) |
| tone | string | `'rows'` | `rows` `compact` `cards` | Layout style |
| background | string | `''` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| size | string | `'m'` | `s` `m` `l` | Padding and typography scale |
| variant | array | `[]` | `border` `border-top` `border-right` `border-bottom` `border-left` | Border modifiers |

## Item format

```js
{
    name: 'roomType',
    type: 'string',
    required: true,
    deprecated: false,
    since: '2.0',
    default: 'double',
    description: 'Room category.',
    options: ['single', 'double', 'suite', 'villa'],
    children: [{ name, type, ... }]
}
```

## Axes

**tone** = layout: `rows` (stacked dividers), `compact` (inline single-line), `cards` (individual cards with hover).
**background** = surface depth, auto-adjusts borders, code blocks and card fills.
**size** = scales padding, font sizes, badge sizes across all elements.
