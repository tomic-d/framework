# status-loading

Full-page loading state with animated spinner circle, pulsing ring and optional message.

## Usage

```html
<e-status-loading color="brand"></e-status-loading>
<e-status-loading text="Loading destinations…" color="brand"></e-status-loading>
<e-status-loading text="Processing…" color="blue" size="l"></e-status-loading>
<e-status-loading text="Inline" color="brand" size="s" :auto="true"></e-status-loading>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| text | string | `''` | | Message below spinner |
| color | string | `'brand'` | `brand` `blue` `red` `orange` `green` | Spinner color |
| size | string | `'m'` | `s` `m` `l` | Spinner and container size |
| auto | boolean | `false` | | Remove min-height constraint |

## Axes

**color** = spinner icon and circle ring tint.
**size** = spinner diameter (56/80/104px), container min-height (200/320/440px).
**auto** = removes min-height for inline usage.
