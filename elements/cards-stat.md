# cards-stat

KPI stat card with label, big value, icon, delta trend badge and optional inline sparkline.
Renders as `<a>` when `href` is set, otherwise `<div>`.

## Usage

```html
<e-cards-stat label="Bookings" value="1,240" icon="flight_takeoff"></e-cards-stat>
<e-cards-stat label="Revenue" value="€78,400" icon="payments" icon-color="green" :delta="{ value: '+8.2%', direction: 'up' }"></e-cards-stat>
<e-cards-stat label="Rating" value="4.9" :sparkline="[4.2, 4.4, 4.6, 4.8, 4.9]" sparkline-color="orange"></e-cards-stat>
<e-cards-stat label="Users" value="3,812" href="/users" :variant="['hover-lift']"></e-cards-stat>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| label | string | `''` | | Uppercase label |
| value | string\|number | `''` | | Main display value |
| description | string | `''` | | Helper text below value |
| icon | string | `''` | | Icon in colored wrap |
| iconColor | string | `'brand'` | `brand` `blue` `red` `orange` `green` `bg-1` `bg-2` `bg-3` `bg-4` | Icon wrap color |
| delta | object | `null` | | `{ value, label, direction }` trend badge |
| sparkline | number[] | `[]` | | Sparkline data points |
| sparklineType | string | `'area'` | `line` `area` `bar` | Sparkline chart type |
| sparklineColor | string | `'brand'` | `brand` `blue` `red` `orange` `green` | Sparkline color |
| href | string | `''` | | Renders as anchor |
| target | string | `''` | | Anchor target |
| orientation | string | `'vertical'` | `vertical` `horizontal` | Card layout |
| loading | boolean | `false` | | Skeleton loading |
| disabled | boolean | `false` | | Disabled state |
| active | boolean | `false` | | Brand highlight ring |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| border | boolean | `true` | | Show border |
| size | string | `'m'` | `s` `m` `l` | Card size |
| variant | array | `[]` | `hover-lift` `gradient` | Visual modifiers |
| _click | function | | | Click handler `{ event }` |

## Delta

`{ value: '+12.5%', label: 'vs last month', direction: 'up' }` — direction: `up` (green), `down` (red), `neutral` (grey).
