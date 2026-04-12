# charts-line

Line chart with multi-series, smooth/step curves, area fill, dots, grid and legend.
Pure SVG — no dependencies. Gradient area, animated draw-in, hover dots.

## Usage

```html
<e-charts-line
    title="Monthly bookings"
    description="2025 confirmed bookings"
    :series="[{ label: 'Bookings', color: 'brand', values: [420, 480, 560, 610, 720, 890] }]"
    :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']"
></e-charts-line>

<e-charts-line :series="multi" :labels="months" :smooth="false" :fill="false" :height="260"></e-charts-line>
<e-charts-line :series="data" :labels="days" background="bg-2" :border="false" size="s"></e-charts-line>
<e-charts-line :series="data" :labels="days" :variant="['clean']"></e-charts-line>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| series | array | `[]` | | `[{ label, color, values }]` |
| labels | string[] | `[]` | | X-axis labels |
| title | string | `''` | | Chart title |
| description | string | `''` | | Subtitle below title |
| smooth | boolean | `true` | | Bezier curve between points |
| fill | boolean | `true` | | Gradient area below line |
| showDots | boolean | `true` | | Data point circles |
| showGrid | boolean | `true` | | Horizontal grid + y-axis labels |
| showLegend | boolean | `true` | | Series legend below chart |
| showLabels | boolean | `true` | | X-axis text labels |
| height | number | `240` | | SVG viewBox height |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| border | boolean | `true` | | Show border |
| size | string | `'m'` | `s` `m` `l` | Padding size |
| variant | array | `[]` | `clean` `inline` | Visual modifiers |

## Series format

```js
{ label: 'Revenue', color: 'brand', values: [420, 480, 560, 610] }
```

Colors: `brand`, `blue`, `red`, `orange`, `green`.

## Axes

**background** + **border** = container surface. **size** = padding scale.
**variant** = `clean` (no container), `inline` (tight spacing, transparent).
Toggle features independently: `smooth`, `fill`, `showDots`, `showGrid`, `showLegend`, `showLabels`.
