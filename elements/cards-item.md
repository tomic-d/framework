# cards-item

Generic card with cover image, icon wrap, badge, title, description, stats, meta, tags and action button.
Renders as `<a>` when `href` is set. Supports vertical and horizontal orientation.

## Usage

```html
<e-cards-item icon="explore" icon-color="brand" title="Kotor" description="Day tour." background="bg-1" :variant="['border']"></e-cards-item>
<e-cards-item cover="photo.jpg" badge="New" badge-color="brand" title="Hotel" background="bg-1" :variant="['border']"></e-cards-item>
<e-cards-item icon="chart" icon-color="green" eyebrow="Revenue" value="€12k" delta="+8%" delta-direction="up" background="bg-1" :variant="['border']"></e-cards-item>
<e-cards-item icon="hotel" title="Villa" :meta="[{ icon: 'bed', label: '4' }]" :tags="['Beach']" background="bg-1" :variant="['border']"></e-cards-item>
<e-cards-item icon="book" title="Book" action="Reserve" action-color="brand" action-tone="solid" background="bg-1" :variant="['border']"></e-cards-item>
<e-cards-item title="Horizontal" orientation="horizontal" cover="photo.jpg" href="/tour" background="bg-1" :variant="['border', 'hover']"></e-cards-item>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| cover | string | `''` | | Cover image URL |
| coverIcon | string | `''` | | Placeholder icon when no cover |
| icon | string | `''` | | Icon in colored wrap |
| iconColor | string | `''` | `brand` `blue` `red` `orange` `green` | Icon wrap accent |
| iconBackground | string | `'bg-2'` | `bg-1` `bg-2` `bg-3` `bg-4` | Icon wrap background when no color |
| badge | string | `''` | | Badge label |
| badgeColor | string | `'brand'` | `brand` `blue` `red` `orange` `green` `neutral` | Badge accent |
| eyebrow | string | `''` | | Uppercase label above title |
| title | string | `''` | | Card title |
| description | string | `''` | | Card description |
| value | string\|number | | | Stat value |
| delta | string | `''` | | Change indicator |
| deltaDirection | string | `'neutral'` | `up` `down` `neutral` | Delta trend |
| meta | array | `[]` | | `[{ icon, label }]` pairs |
| tags | array | `[]` | | Tag chip strings |
| action | string | `''` | | Footer button text |
| actionIcon | string | `''` | | Footer button icon |
| actionColor | string | `''` | `brand` `blue` `red` `orange` `green` | Footer button color |
| actionTone | string | `'ghost'` | `solid` `soft` `outline` `ghost` | Footer button tone |
| href | string | `''` | | Renders as anchor |
| target | string | `''` | | Anchor target |
| orientation | string | `'vertical'` | `vertical` `horizontal` | Card direction |
| align | string | `'left'` | `left` `center` | Content alignment |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Card background |
| size | string | `'m'` | `s` `m` `l` | Card size |
| variant | array | `[]` | `border` `glass` `gradient` `hover` | Visual modifiers |
| loading | boolean | `false` | | Skeleton shimmer |
| disabled | boolean | `false` | | Disabled state |
| active | boolean | `false` | | Selected ring |
| _click | function | | | Click handler `{ event }` |

## Axes

**background** = card surface depth: `bg-1` through `bg-4`.
**iconColor** + **iconBackground** = icon wrap: color accent or neutral background.
**badgeColor** = badge pill accent: covers or header inline.
**actionColor** + **actionTone** = footer button style, uses `e-form-button` internally.
**variant** = modifiers: `border`, `glass` (blur), `gradient` (brand→blue border), `hover` (lift + shadow).
