# form-checkbox

Checkbox with label, description, icon, count badge, indeterminate state and color variants.
Hidden native input stays accessible for forms and keyboard navigation.

## Usage

```html
<e-form-checkbox label="Accept terms" background="bg-2" :variant="['border']"></e-form-checkbox>
<e-form-checkbox label="Subscribe" :value="true" color="green" background="bg-2" :variant="['border']"></e-form-checkbox>
<e-form-checkbox label="Select all" :indeterminate="true" color="blue" background="bg-1" :variant="['border']"></e-form-checkbox>
<e-form-checkbox label="Window seat" background="bg-2" :variant="['border', 'reverse']"></e-form-checkbox>
<e-form-checkbox label="Notifications" icon="notifications" count="12" background="bg-2" :variant="['border']"></e-form-checkbox>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| label | string | `''` | | Checkbox label |
| description | string | `''` | | Helper text below label |
| icon | string | `''` | | Icon between mark and label |
| count | string\|number | | | Count badge at the end |
| name | string | `''` | | Input name attribute |
| value | boolean | `false` | | Checked state |
| indeterminate | boolean | `false` | | Partial selection state |
| color | string | `'brand'` | `brand` `blue` `red` `orange` `green` | Checked mark color |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` `transparent` | Mark background depth |
| size | string | `'m'` | `s` `m` `l` | Checkbox size |
| variant | array | `[]` | `border` `reverse` | Visual modifiers |
| disabled | boolean | `false` | | Disabled state |
| _change | function | | | Change handler `{ event, value }` |
| _click | function | | | Click handler `{ event, value }` |

## Axes

**color** = checked/indeterminate mark fill: `brand`, `blue`, `green`, etc.
**background** = unchecked mark surface: `bg-1` through `bg-4`, `transparent`.
**variant** = modifiers: `border` (visible border), `reverse` (label before mark).
