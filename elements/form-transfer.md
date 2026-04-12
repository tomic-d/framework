# form-transfer

Two-panel transfer list. Move items between available and selected with single, bulk and clear actions. Supports search, max limit and disabled items.

## Usage

```html
<e-form-transfer
	:items="[
		{ id: 'wifi', label: 'Wi-Fi', icon: 'wifi' },
		{ id: 'pool', label: 'Pool', icon: 'pool', description: 'Outdoor heated' },
		{ id: 'gym', label: 'Gym', icon: 'fitness_center', disabled: true }
	]"
	:value="['wifi']"
	:max="5"
	left-title="Available"
	right-title="Selected"
	:_change="({ value }) => save(value)"
></e-form-transfer>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| value | array | `[]` | | Selected item IDs |
| items | array | `[]` | | Items `{ id, label, description?, icon?, disabled? }` |
| max | number | | | Maximum selectable items |
| searchable | boolean | `true` | | Show search inputs |
| leftTitle | string | `'Available'` | | Left panel heading |
| rightTitle | string | `'Selected'` | | Right panel heading |
| emptyLeft | string | `'No items'` | | Left empty text |
| emptyRight | string | `'None selected'` | | Right empty text |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Panel background |
| border | boolean | `true` | | Show panel border |
| size | string | `'m'` | `s` `m` `l` | Component size |
| disabled | boolean | `false` | | Disable all interaction |
| _change | function | | | Change handler `{ value }` |

## Controls

Four center buttons: move all right, move selected right, move selected left, move all left.
Disabled items stay pinned — bulk actions skip them. Max limit caps right panel count.
Responsive: stacks vertically on mobile with horizontal controls.
