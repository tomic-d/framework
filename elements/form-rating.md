# form-rating

Star rating with half-star precision, custom icon, label and review count.
Click to toggle rating, click same value to reset to 0.

## Usage

```html
<e-form-rating :value="4" color="brand"></e-form-rating>
<e-form-rating :value="3.5" :precision="0.5" color="orange" :show-value="true" :count="142"></e-form-rating>
<e-form-rating label="Rate your stay" icon="favorite" :value="0" color="red" size="l" :_change="onRate"></e-form-rating>
<e-form-rating :value="4" :readonly="true" :count="512" color="brand"></e-form-rating>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| label | string | `''` | | Label above stars |
| description | string | `''` | | Description below label |
| value | number | `0` | | Current rating |
| max | number | `5` | | Number of stars |
| precision | number | `1` | `1` `0.5` | Full or half-star step |
| icon | string | `'star'` | | Material icon name |
| count | number | | | Review count after stars |
| showValue | boolean | `false` | | Show numeric value after stars |
| color | string | `'brand'` | `brand` `blue` `red` `orange` `green` | Fill color |
| size | string | `'m'` | `s` `m` `l` | Star size |
| readonly | boolean | `false` | | Display only |
| disabled | boolean | `false` | | Disabled state |
| _change | function | | | Change handler `{ event, value }` |

## Axes

**color** = fill color for active stars: `brand`, `red`, `blue`.
**size** = star icon size: `s` (16px), `m` (22px), `l` (30px).
