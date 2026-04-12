# form-select

Custom dropdown select with search, keyboard navigation, option icons and descriptions.
Dropdown renders via float overlay system for proper z-index stacking.

## Usage

```html
<e-form-select placeholder="Choose…" :options="items"></e-form-select>
<e-form-select icon="place" placeholder="City" :options="cities" :searchable="true"></e-form-select>
<e-form-select value="active" :options="statuses" :clearable="true" :_change="onChange"></e-form-select>
<e-form-select placeholder="Size" :options="sizes" background="bg-3" size="s" :border="false"></e-form-select>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| value | string\|number | | | Selected value |
| name | string | | | Hidden input name for forms |
| placeholder | string | `'Select…'` | | Placeholder text |
| icon | string | | | Left icon on trigger |
| options | array | `[]` | | `[{ label, value, icon, description, disabled }]` |
| searchable | boolean | `false` | | Show search input in dropdown |
| clearable | boolean | `false` | | Show clear button when value set |
| disabled | boolean | `false` | | Disabled state |
| background | string | `'bg-2'` | `bg-1` `bg-2` `bg-3` `bg-4` `transparent` | Background depth |
| border | boolean | `true` | | Show border |
| size | string | `'m'` | `s` `m` `l` | Trigger size |
| _change | function | | | Change handler `{ value }` |

## Options format

```js
[
    { label: 'Economy', value: 'economy', icon: 'flight', description: 'Standard seats' },
    { label: 'Business', value: 'business', icon: 'star', disabled: true }
]
```

## Keyboard

Arrow Up/Down navigate, Enter selects, Escape closes, Home/End jump to first/last.
