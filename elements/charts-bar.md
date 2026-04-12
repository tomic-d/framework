# charts-bar

Bar chart with labels, values, grid lines, tooltip on hover, active highlight and inline mode.
Supports vertical and horizontal orientation with per-bar color overrides.

## Usage

```html
<e-charts-bar title="Revenue" :items="data" background="bg-1"></e-charts-bar>
<e-charts-bar :items="data" color="blue" orientation="horizontal" :height="200"></e-charts-bar>
<e-charts-bar :items="data" :showValues="true" :format="(v) => '€' + v" background="bg-2"></e-charts-bar>
<e-charts-bar :items="data" :showGrid="false" size="s" :variant="['inline']"></e-charts-bar>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| items | array | `[]` | | `[{ value, label, color?, active? }]` |
| title | string | `''` | | Chart title |
| description | string | `''` | | Chart description |
| orientation | string | `'vertical'` | `vertical` `horizontal` | Bar direction |
| color | string | `'brand'` | `brand` `blue` `red` `orange` `green` | Default bar color |
| height | number | `220` | | Canvas height in px |
| showLabels | boolean | `true` | | Show bar labels |
| showValues | boolean | `false` | | Show value above each bar |
| showGrid | boolean | `true` | | Show grid lines |
| format | function | | | Custom formatter `(value) => string` |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| border | boolean | `true` | | Show border |
| size | string | `'m'` | `s` `m` `l` | Padding size |
| variant | array | `[]` | `clean` `inline` | Visual modifiers |

## Items

```js
[
    { label: 'Jan', value: 1240 },
    { label: 'Jul', value: 6210, active: true },
    { label: 'Beach', value: 4820, color: 'blue' }
]
```

Per-item `color` overrides chart `color`. `active: true` highlights the bar at full opacity.

## Axes

**color** = default bar fill. Each item can override with its own `color`.
**orientation** = `vertical` (bars grow up) or `horizontal` (bars grow right).
**variant** = `clean` (no container), `inline` (compact, no padding/border).
