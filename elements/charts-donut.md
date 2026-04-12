# charts-donut

Donut chart with SVG ring segments, center label, legend, hover tooltip and draw animation.
Auto-cycles through brand/blue/green/orange/red palette when no color specified.

## Usage

```html
<e-charts-donut
    title="Revenue"
    description="By category."
    :items="[
        { label: 'Flights', value: 48200, color: 'brand' },
        { label: 'Hotels', value: 36400, color: 'blue' },
        { label: 'Tours', value: 18900, color: 'green' }
    ]"
    :center="{ label: 'Total', value: '103.5k' }"
    :chartSize="200"
    background="bg-1"
></e-charts-donut>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| items | array | `[]` | | Segments `{ value, label, color? }` |
| title | string | `''` | | Card title |
| description | string | `''` | | Card description |
| center | object | `null` | | Center label `{ label, value }` |
| thickness | number | `18` | | Ring stroke width |
| chartSize | number | `180` | | Donut diameter in px |
| legend | boolean | `true` | | Show legend |
| percents | boolean | `true` | | Show percent in legend |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Card background |
| border | boolean | `true` | | Show card border |
| size | string | `'m'` | `s` `m` `l` | Card padding |
| variant | array | `[]` | `clean` `inline` | Visual modifiers |

## Axes

**background + border** = card chrome: `bg-1` through `bg-4`, border per-bg auto-match.
**size** = card padding: `s` (compact), `m` (default), `l` (spacious).
**variant** = `clean` (no chrome), `inline` (no chrome, tight gap).
**thickness** = ring weight: `10` (thin), `18` (default), `28` (bold).
Hover any segment for tooltip with label, value and percent.
