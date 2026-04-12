# data-filters

Filter panel with collapsible groups supporting checkbox, radio, tags, select, search, range, slider, date and toggle.
Active counts, per-group clear, global clear and optional apply button.

## Usage

```html
<e-data-filters :groups="groups" :value="filters" :_change="onFilter"></e-data-filters>
<e-data-filters icon="tune" title="Filters" :groups="groups" background="bg-2" :sticky="true"></e-data-filters>
<e-data-filters :groups="groups" orientation="horizontal" apply-label="Apply"></e-data-filters>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| title | string | `'Filters'` | | Header title |
| icon | string | `'filter_alt'` | | Header icon |
| groups | array | `[]` | | Filter group definitions |
| value | object | `null` | | Filter state keyed by group id |
| collapsible | boolean | `true` | | Allow collapsing groups |
| showClear | boolean | `true` | | Show clear all button |
| showCount | boolean | `true` | | Show active count badges |
| sticky | boolean | `false` | | Sticky positioning |
| orientation | string | `'vertical'` | `vertical` `horizontal` | Layout direction |
| clearLabel | string | `'Clear all'` | | Clear button text |
| applyLabel | string | `''` | | Apply button text. Empty hides footer |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| border | boolean | `true` | | Outer border |
| variant | array | `[]` | `clean` | Visual modifiers |
| _change | function | | | Change handler `{ value }` |
| _clear | function | | | Clear all handler |
| _apply | function | | | Apply handler `{ value }` |

## Group types

| Type | Value shape | Description |
|------|-------------|-------------|
| checkbox | `string[]` | Multi-select with options `{ id, label, icon, count }` |
| radio | `string` | Single-select, click again to deselect |
| tags | `string[]` | Pill toggle buttons, same options as checkbox |
| select | `string` | Dropdown, supports `searchable` flag |
| search | `string` | Text input with search icon |
| range | `{ min, max }` | Two number inputs side by side |
| slider | `number` | Range slider with value display |
| date | `{ from, to }` | Two date pickers |
| toggle | `boolean` | On/off switch |

## Group definition

```js
{ id: 'country', label: 'Country', type: 'checkbox', max: 4, options: [
    { id: 'me', label: 'Montenegro', icon: 'flag', count: 42 }
]}
{ id: 'price', label: 'Price', type: 'range', config: { minPlaceholder: 'Min €', maxPlaceholder: 'Max €' } }
{ id: 'rating', label: 'Rating', type: 'slider', config: { min: 0, max: 5, step: 0.1 } }
```
