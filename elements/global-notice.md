# global-notice

Notice banner with icon, title, supporting text, actions slot and dismiss button.
Auto-resolves icon from color: red=error, orange=warning, green=check_circle, blue=info, brand=bolt.

## Usage

```html
<e-global-notice title="Payment received" text="Card charged successfully." color="green"></e-global-notice>
<e-global-notice title="Booking failed" text="Invalid dates." color="red" tone="filled"></e-global-notice>
<e-global-notice title="Travel advisory" color="blue" tone="accent" :closable="true"></e-global-notice>
<e-global-notice icon="hotel" title="Room upgraded" background="bg-2"></e-global-notice>
<e-global-notice title="Expires soon" color="orange" :closable="true" :_close="onDismiss">
    <div slot="actions">
        <e-form-button text="Renew" color="orange" size="s"></e-form-button>
    </div>
</e-global-notice>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| icon | string | `''` | | Override auto-resolved icon |
| title | string | `''` | | Notice title |
| text | string | `''` | | Supporting text below title |
| closable | boolean | `false` | | Show dismiss button |
| color | string | `'blue'` | `brand` `blue` `red` `orange` `green` | Notice color |
| tone | string | `'soft'` | `soft` `filled` `accent` | Visual tone |
| background | string | `''` | `bg-1` `bg-2` `bg-3` `bg-4` | Neutral background when no color |
| size | string | `'m'` | `s` `m` `l` | Notice size |
| _close | function | | | Close handler `{ event }` |

## Slots

- **actions** — inline buttons beside close button

## Axes

**tone + color** = `soft` (tinted bg + border), `filled` (solid bg, white text), `accent` (left border bar + tinted bg).
**background** = neutral notice when no color: `bg-1` through `bg-4`.
