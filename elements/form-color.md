# form-color

Color picker with native browser input, hex text field, preset swatches and copy action.
Checkerboard pattern shows when no color is set.

## Usage

```html
<e-form-color value="#e27055"></e-form-color>
<e-form-color placeholder="Brand color" :presets="['#e27055', '#38bdf8', '#34d399']"></e-form-color>
<e-form-color background="bg-3" :border="false" size="s"></e-form-color>
<e-form-color value="#f43f5e" :disabled="true"></e-form-color>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| value | string | `''` | | Hex color value |
| name | string | `''` | | Input name attribute |
| placeholder | string | `'#000000'` | | Placeholder text |
| presets | array | `[]` | | Preset color hex swatches |
| background | string | `'bg-2'` | `bg-1` `bg-2` `bg-3` `bg-4` `transparent` | Background depth |
| border | boolean | `true` | | Show border |
| size | string | `'m'` | `s` `m` `l` | Picker size |
| disabled | boolean | `false` | | Disabled state |
| _input | function | | | Live pick handler `{ event, value }` |
| _change | function | | | Commit handler `{ event, value }` |

## Notes

- Click swatch to open native color picker. Type hex directly in text field.
- Copy button appears when value is set. Shows green check for 1.5s after copy.
- Preset swatches show active ring on current value. Click to select.
- Hex is auto-normalized: stripped of invalid chars, prefixed with `#`, capped at 7 chars.
