# status-error

Error state with pulsing icon circle, message and retry action.
Default retry reloads the page. Provide `_click` to override.

## Usage

```html
<e-status-error></e-status-error>
<e-status-error title="Booking failed" description="Please try again." color="red"></e-status-error>
<e-status-error icon="wifi_off" title="Offline" color="orange" size="s"></e-status-error>
<e-status-error title="Not found" action="Go back" color="blue" size="l" :_click="goBack"></e-status-error>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| icon | string | `'error'` | | Center icon name |
| title | string | `'Something went wrong'` | | Error heading |
| description | string | `'An unexpected error occurred…'` | | Detail text |
| action | string | `'Try Again'` | | Retry button label. Empty hides button |
| color | string | `'red'` | `brand` `blue` `red` `orange` `green` | Icon circle accent |
| size | string | `'m'` | `s` `m` `l` | Component size |
| _click | function | | | Retry handler `{ event }`. Reloads page if not set |

## Axes

**color** = icon circle fill and pulse ring: `red`, `orange`, `brand`, etc.
**size** = circle size, title font, min-height: `s` (240px), `m` (320px), `l` (440px).
