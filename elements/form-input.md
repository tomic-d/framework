# form-input

Text input with icons, prefix/suffix, password toggle, clearable and autocomplete dropdown.

## Usage

```html
<e-form-input placeholder="Search…" icon="search"></e-form-input>
<e-form-input type="password" icon="lock" placeholder="Password"></e-form-input>
<e-form-input prefix="EUR" suffix="/night" placeholder="0.00"></e-form-input>
<e-form-input icon="place" :options="['Belgrade', 'Paris', 'Tokyo']" :clearable="true"></e-form-input>
<e-form-input type="number" :min="1" :max="10" :step="1" value="2"></e-form-input>
<e-form-input background="bg-3" :border="false" size="s"></e-form-input>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| value | string\|number | | | Input value |
| name | string | | | Name attribute |
| type | string | `'text'` | `text` `email` `password` `number` `tel` `url` `search` | Input type |
| placeholder | string | | | Placeholder text |
| icon | string | | | Left icon |
| iconRight | string | | | Right icon |
| prefix | string | | | Static text before value |
| suffix | string | | | Static text after value |
| options | string[] | `[]` | | Autocomplete suggestions |
| restrict | boolean | `false` | | Only allow values from options |
| clearable | boolean | `false` | | Show clear button |
| maxlength | number | | | Max character count |
| min | number | | | Min value (number type) |
| max | number | | | Max value (number type) |
| step | number | | | Step increment (number type) |
| disabled | boolean | `false` | | Disabled state |
| readonly | boolean | `false` | | Readonly state |
| background | string | `'bg-2'` | `bg-1` `bg-2` `bg-3` `bg-4` `transparent` | Background depth |
| border | boolean | `true` | | Show border |
| size | string | `'m'` | `s` `m` `l` | Input size |
| _input | function | | | Input handler `{ event, value }` |
| _change | function | | | Change handler `{ event, value }` |
| _focus | function | | | Focus handler `{ event, value }` |
| _blur | function | | | Blur handler `{ event, value }` |

## Features

- `type: 'password'` adds reveal/hide toggle button.
- `options` array shows autocomplete dropdown with arrow/Enter/Escape keyboard navigation.
- `restrict: true` clears value on change if not in options list.
- `clearable: true` shows clear button when value is present.
