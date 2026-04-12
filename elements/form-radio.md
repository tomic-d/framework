# form-radio

Radio button with label, description, icon, count badge and color variants.
Uses native `<input type="radio">` for accessibility. Group radios with shared `name`.

## Usage

```html
<e-form-radio label="Option A" :value="true" background="bg-2" :variant="['border']"></e-form-radio>
<e-form-radio label="Blue accent" color="blue" background="bg-2" :variant="['border']"></e-form-radio>
<e-form-radio label="Reversed" :variant="['border', 'reverse']"></e-form-radio>

<!-- Group -->
<e-form-radio name="plan" option="free" label="Free"></e-form-radio>
<e-form-radio name="plan" option="pro" label="Pro" :value="true"></e-form-radio>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| label | string | `''` | | Primary label |
| description | string | `''` | | Secondary line below label |
| icon | string | `''` | | Icon between mark and label |
| count | string\|number | | | Count badge at end |
| name | string | `''` | | Group name for mutual exclusion |
| option | string | `''` | | Value sent to group |
| value | boolean | `false` | | Checked state |
| color | string | `''` | `brand` `blue` `red` `orange` `green` | Checked accent color |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` `transparent` | Mark background |
| size | string | `'m'` | `s` `m` `l` | Mark size |
| variant | array | `[]` | `border` `reverse` | Visual modifiers |
| disabled | boolean | `false` | | Disabled state |
| _change | function | | | Change handler `{ event, value }` |
| _click | function | | | Click handler `{ event, value }` |

## Axes

**color** = checked accent: `brand`, `blue`, `red`, `orange`, `green`. Default is brand.
**background** = unchecked mark fill: `bg-1` through `bg-4`, `transparent`.
**variant** = modifiers: `border` (visible border), `reverse` (label left, mark right).
