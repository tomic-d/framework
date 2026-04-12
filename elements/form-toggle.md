# form-toggle

On/off switch with label, description and color variants.
Hidden checkbox for form compatibility. Active track changes to color.

## Usage

```html
<e-form-toggle label="Dark mode" :value="true"></e-form-toggle>
<e-form-toggle label="Notifications" description="Receive email alerts." color="blue"></e-form-toggle>
<e-form-toggle label="Delete on exit" color="red" :variant="['reverse']"></e-form-toggle>
<e-form-toggle label="Disabled" :disabled="true"></e-form-toggle>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| label | string | `''` | | Toggle label |
| description | string | `''` | | Helper text below label |
| name | string | `''` | | Form field name |
| value | boolean | `false` | | Checked state |
| color | string | `'brand'` | `brand` `blue` `red` `orange` `green` | Active track color |
| background | string | `'bg-3'` | `bg-1` `bg-2` `bg-3` `bg-4` | Inactive track background |
| size | string | `'m'` | `s` `m` `l` | Toggle size |
| variant | array | `[]` | `reverse` `border` | Visual modifiers |
| disabled | boolean | `false` | | Disabled state |
| _change | function | | | Change handler `{ event, value }` |

## Axes

**color** = active track color: `brand`, `blue`, `red`.
**background** = inactive track fill: `bg-1` through `bg-4`.
**variant** = layout: `reverse` (label left, switch right), `border` (track border).
