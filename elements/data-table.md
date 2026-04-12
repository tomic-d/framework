# data-table

Data table with column types, sort, search, pagination, row actions, loading skeleton and empty state.
Cells render via the shared type system — text, number, currency, date, status, badge, media, progress, etc.

## Usage

```html
<e-data-table :columns="columns" :items="rows"></e-data-table>
<e-data-table icon="event" title="Bookings" :columns="columns" :items="rows" :actions="actions"></e-data-table>
<e-data-table :columns="columns" :items="rows" :search="{ enabled: true }" :sort="{ field: 'total', direction: 'desc' }"></e-data-table>
<e-data-table :columns="columns" :items="rows" :pagination="{ page: 1, size: 20, total: 100 }"></e-data-table>
<e-data-table :columns="columns" :items="rows" background="bg-2" :variant="['striped']"></e-data-table>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| items | array | `[]` | | Row data. Each item should have `id` |
| columns | array | `[]` | | Column defs `{ id, label, type, width, align, sortable, hidden, config, render }` |
| title | string | `''` | | Header title |
| description | string | `''` | | Header description |
| icon | string | `''` | | Header icon |
| search | object | `{ enabled: true, value: '' }` | | Search toolbar config |
| sort | object | `{ field: '', direction: 'asc' }` | | Sort state |
| pagination | object | `null` | | `{ page, size, total, sizes }`. Null disables |
| loading | object | `{ enabled: false, rows: 6 }` | | Skeleton loading state |
| actions | array | | | Row action menu items (global-menu format) |
| empty | object | `{ icon, title, description }` | | Empty state config |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| border | boolean | `true` | | Outer border |
| variant | array | `[]` | `clean` `striped` `sticky` `border-bottom` | Visual modifiers |
| _click | function | | | Row click `{ value, index, event }` |
| _sort | function | | | Sort `{ field, direction }` |
| _page | function | | | Page `{ page, size }` |
| _search | function | | | Search `{ value }` |
| _action | function | | | Action `{ action, value, index }` |

## Column types

`text` `description` `number` `currency` `boolean` `date` `timeago` `icon` `image` `avatar` `media` `badge` `chip` `tag` `tags` `status` `metric` `progress` `link` `group`

Custom render: `{ id: 'name', render: (item, column) => '<b>' + item.name + '</b>' }`

## Column config examples

```js
{ id: 'name', label: 'Name', type: 'media', config: { image: 'image', title: 'name', subtitle: 'country' } }
{ id: 'level', label: 'Level', type: 'badge', config: { colors: { easy: 'green', hard: 'red' } } }
{ id: 'status', label: 'Status', type: 'status', config: { colors: { confirmed: 'brand' } } }
{ id: 'progress', label: 'Booked', type: 'progress', config: { color: 'brand' } }
```

## Slots

- **actions** — header right side (buttons, filters)
