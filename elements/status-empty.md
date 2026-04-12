# status-empty

Empty state with icon circle, title, description and optional action button.
Dashed ring around icon for visual emphasis. Fade-up entrance animation.

## Usage

```html
<e-status-empty icon="inbox" title="Nothing here yet"></e-status-empty>
<e-status-empty icon="flight" title="No flights" description="Search for a flight." color="blue"></e-status-empty>
<e-status-empty icon="explore" title="No bookings" action="Browse" color="green" :_click="onClick"></e-status-empty>
<e-status-empty icon="favorite" title="No favorites" color="red" size="l"></e-status-empty>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| icon | string | `'inbox'` | | Center icon |
| title | string | `'Nothing here yet'` | | Heading text |
| description | string | `''` | | Supporting message |
| action | string | `''` | | Action button label |
| color | string | `'brand'` | `brand` `blue` `red` `orange` `green` | Icon circle accent |
| size | string | `'m'` | `s` `m` `l` | Component size |
| _click | function | | | Action button click handler |

## Axes

**color** = icon circle fill and dashed ring accent.
**size** = circle size, title/description font, container max-width.
