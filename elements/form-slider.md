# form-slider

Range slider with label, value display, tick marks and color variants.
Native `<input type="range">` under the hood with custom track and thumb styling.

## Usage

```html
<e-form-slider label="Budget" :value="1200" :min="0" :max="5000" prefix="€" :showValue="true" color="brand"></e-form-slider>
<e-form-slider label="Distance" :value="120" :min="0" :max="500" suffix=" km" :showRange="true" color="blue"></e-form-slider>
<e-form-slider :value="4" :min="1" :max="10" :step="1" :marks="true" :showValue="true" color="green"></e-form-slider>
<e-form-slider label="Volume" :value="50" :disabled="true" color="brand" size="s"></e-form-slider>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| label | string | `''` | | Label above the track |
| description | string | `''` | | Description below the label |
| name | string | `''` | | Form field name |
| value | number | `0` | | Current value |
| min | number | `0` | | Minimum value |
| max | number | `100` | | Maximum value |
| step | number | `1` | | Step increment |
| showValue | boolean | `false` | | Show value badge in header |
| showRange | boolean | `false` | | Show min/max labels below track |
| marks | boolean | `false` | | Tick marks at each step (max 20) |
| prefix | string | `''` | | Text before value display |
| suffix | string | `''` | | Text after value display |
| color | string | `'brand'` | `brand` `blue` `red` `orange` `green` | Fill color |
| size | string | `'m'` | `s` `m` `l` | Track and thumb size |
| disabled | boolean | `false` | | Disabled state |
| _input | function | | | Fires on drag `{ event, value }` |
| _change | function | | | Fires on release `{ event, value }` |
