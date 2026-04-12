# cards-info

Information card with header, status pill, label-value rows, stat grid, tags, notice and action slots.
Composable sections — use any combination, all are optional.

## Usage

```html
<e-cards-info icon="flight" title="Summer Trip" description="Adriatic coast."></e-cards-info>
<e-cards-info icon="receipt" title="Invoice" :rows="rows" :status="{ label: 'Paid', color: 'green' }"></e-cards-info>
<e-cards-info icon="insights" title="Summary" :stats="stats" :tags="tags" size="l"></e-cards-info>
<e-cards-info icon="info" title="Notice" :notice="{ icon: 'info', text: 'Check-in after 14:00.', color: 'blue' }"></e-cards-info>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| icon | string | `''` | | Header icon |
| title | string | `''` | | Card title |
| description | string | `''` | | Description below title |
| badge | string | `''` | | Header badge label |
| status | object | | | `{ label, color }` — animated status pill |
| rows | array | `[]` | | `[{ label, value, icon, color }]` — key-value rows |
| stats | array | `[]` | | `[{ value, label, icon, color }]` — auto-fit stat grid |
| tags | array | `[]` | | `[{ label, icon, color }]` — colored pill tags |
| notice | object | | | `{ icon, text, color }` — inline notice |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| border | boolean | `true` | | Show border |
| size | string | `'m'` | `s` `m` `l` | Card size |

## Slots

- **default** — custom body content
- **actions** — footer buttons

## Colors

Status, rows, stats, tags and notice all support `color`: `brand`, `blue`, `red`, `orange`, `green`.
Tags auto-adapt background to card background depth. Stats border matches card background.
