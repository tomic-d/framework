# core-repeater

Repeatable rows with reorder arrows, duplicate, numbered rows, min/max limits and empty state.
Each row renders form elements from field definitions with two-way binding.

## Usage

```html
<e-core-repeater :value="rows" :fields="fields" add="Add row" background="bg-2" :border="true"></e-core-repeater>
<e-core-repeater :value="rows" :fields="fields" :numbered="true" :duplicable="true" :max="5"></e-core-repeater>
<e-core-repeater :value="rows" :fields="fields" orientation="vertical" save="Save" :_save="onSave"></e-core-repeater>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| value | array | `[]` | | Row data objects |
| fields | array | `[]` | | Field defs `{ key, label, description, element, properties, default }` |
| orientation | string | `'horizontal'` | `horizontal` `vertical` | Field layout per row |
| add | string | `'Add'` | | Add button label |
| addPosition | string | `'bottom'` | `top` `bottom` `both` | Add button placement |
| save | string | `''` | | Save button label. Empty hides |
| empty | string | `'No items yet'` | | Empty state text |
| emptyIcon | string | `'inbox'` | | Empty state icon |
| min | number | | | Minimum row count |
| max | number | | | Maximum row count |
| draggable | boolean | `true` | | Show reorder arrows |
| numbered | boolean | `false` | | Show row numbers |
| duplicable | boolean | `false` | | Show duplicate button |
| disabled | boolean | `false` | | Disable all interaction |
| background | string | `'bg-2'` | `bg-1` `bg-2` `bg-3` `bg-4` | Row background depth |
| border | boolean | `false` | | Outer container border |
| size | string | `'m'` | `s` `m` `l` | Row padding |
| _change | function | | | Change handler `{ value }` |
| _save | function | | | Save handler `{ value }` |

## Field definition

```js
{ key: 'name', label: 'Name', element: 'form-input', properties: { placeholder: 'Full name', background: 'bg-1', border: true } }
{ key: 'date', label: 'Date', element: 'form-date', properties: { background: 'bg-1', border: true } }
{ key: 'type', label: 'Type', element: 'form-select', properties: { options: [...], background: 'bg-1', border: true } }
```

`element` is the element id without `e-` prefix. `properties` are passed as props. `_change` is auto-wired.
