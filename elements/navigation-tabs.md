# navigation-tabs

Tabbed navigation with four tones, icons, count badges and optional content panels.
Scrolls horizontally on overflow. Panel content fades in on switch.

## Usage

```html
<e-navigation-tabs :items="tabs" tone="underline"></e-navigation-tabs>
<e-navigation-tabs :items="tabs" tone="pills" size="s" :variant="['border']"></e-navigation-tabs>
<e-navigation-tabs :items="tabs" tone="contained" background="bg-2"></e-navigation-tabs>
<e-navigation-tabs :items="tabs" tone="segmented" :variant="['stretch']"></e-navigation-tabs>
```

## Items format

```js
[
    { id: 'overview', label: 'Overview', icon: 'info', count: 12 },
    { id: 'photos', label: 'Photos', icon: 'photo_library', disabled: true },
    { id: 'booking', label: 'Booking', href: '/book', content: '<p>Panel HTML</p>' }
]
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| items | array | `[]` | | Tab items `{ id, label, icon?, count?, href?, target?, disabled?, content? }` |
| active | string | `''` | | Active tab ID. Defaults to first item |
| tone | string | `'underline'` | `underline` `pills` `contained` `segmented` | Visual tone |
| background | string | `''` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| size | string | `'m'` | `s` `m` `l` | Tab size |
| variant | array | `[]` | `border` `stretch` | Visual modifiers |
| _change | function | | | Tab change handler `{ event, value }` |

## Axes

**tone** = tab style: `underline` (bottom bar), `pills` (rounded), `contained` (framed track), `segmented` (pill track).
**background** = surface depth. On underline/pills applies to box, on contained/segmented applies to track.
**variant** = `border` (bottom border on underline/pills), `stretch` (tabs fill full width).
