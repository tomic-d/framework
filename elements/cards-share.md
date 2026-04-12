# cards-share

Share toolbar with copy, native share, bookmark, like and social platform links.
Pill-shaped action buttons with animated state transitions.

## Usage

```html
<e-cards-share url="https://example.com" background="bg-1" :variant="['border']"></e-cards-share>
<e-cards-share title="Share" url="https://example.com" :platforms="['twitter', 'facebook', 'email']"></e-cards-share>
<e-cards-share url="https://example.com" :liked="true" :likes="1247" :shares="342"></e-cards-share>
<e-cards-share url="https://example.com" :actions="['copy', 'like']" :variant="['compact']"></e-cards-share>
<e-cards-share title="Share:" url="https://example.com" :platforms="['twitter', 'facebook']" :variant="['inline']"></e-cards-share>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| title | string | `''` | | Label above actions |
| url | string | `''` | | URL to share and copy |
| text | string | `''` | | Share text for platforms |
| actions | array | `['copy','share','bookmark','like']` | `copy` `share` `bookmark` `like` | Visible action buttons |
| platforms | array | `[]` | `twitter` `facebook` `linkedin` `whatsapp` `telegram` `email` | Social links |
| liked | boolean | `false` | | Pre-filled liked state |
| saved | boolean | `false` | | Pre-filled saved state |
| likes | number | | | Like count |
| comments | number | | | Comment count |
| shares | number | | | Share count |
| orientation | string | `'horizontal'` | `horizontal` `vertical` | Layout direction |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| size | string | `'m'` | `s` `m` `l` | Action button size |
| variant | array | `[]` | `border` `compact` `inline` | Visual modifiers |
| _copy | function | | | Copy handler `{ value }` |
| _share | function | | | Share handler `{ value }` |
| _save | function | | | Save handler `{ value }` |
| _like | function | | | Like handler `{ value }` |

## Axes

**background** = container surface: `bg-1` through `bg-4`. Actions auto-contrast.
**orientation** = `horizontal` (row) or `vertical` (stacked column).
**variant** = `border` (container border), `compact` (tight padding), `inline` (no container, row with divider).
**size** = action and platform button height: `s` (32px), `m` (38px), `l` (44px).
