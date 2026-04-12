# form-date

Date picker with native input, min/max range, presets and clear action.
Icon turns brand color when value equals today.

## Usage

```html
<e-form-date placeholder="Check-in"></e-form-date>
<e-form-date value="2026-04-12" placeholder="Departure"></e-form-date>
<e-form-date min="2026-01-01" max="2026-12-31" placeholder="Trip start"></e-form-date>
<e-form-date :presets="[{ label: 'Today', value: '2026-04-12' }]" placeholder="Quick pick"></e-form-date>
<e-form-date background="bg-3" size="s" :border="false"></e-form-date>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| value | string | `''` | | Selected date (YYYY-MM-DD) |
| name | string | `''` | | Input name attribute |
| placeholder | string | `''` | | Placeholder text |
| min | string | `''` | | Minimum selectable date |
| max | string | `''` | | Maximum selectable date |
| presets | array | `[]` | | Quick-pick buttons `[{ label, value }]` |
| background | string | `'bg-2'` | `bg-1` `bg-2` `bg-3` `bg-4` `transparent` | Background depth |
| size | string | `'m'` | `s` `m` `l` | Field size |
| border | boolean | `true` | | Show border |
| disabled | boolean | `false` | | Disabled state |
| _change | function | | | Change handler `{ event, value }` |

## Features

- Native `<input type="date">` with browser picker.
- Clear button appears when value is set.
- Preset pills below field for quick selection, disabled when out of range.
- Today state highlights icon and border in brand color.
