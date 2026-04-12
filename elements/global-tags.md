# global-tags

Filter tag group with single or multi selection, icons, count badges and color dots.
Click to toggle selection. Single select deselects on re-click.

## Usage

```html
<e-global-tags :items="['Beach', 'Mountain', 'City']" active="Beach"></e-global-tags>
<e-global-tags :items="tags" active="all" tone="outline"></e-global-tags>
<e-global-tags :items="tags" :active="['a', 'b']" :multiple="true"></e-global-tags>
<e-global-tags :items="tags" active="new" background="bg-3" :variant="['border']"></e-global-tags>
<e-global-tags :items="tags" active="live" tone="minimal" size="s"></e-global-tags>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| items | array | `[]` | | Strings or `{ id, label, icon, count, color, disabled }` |
| active | string\|array | | | Active tag id or array of ids |
| multiple | boolean | `false` | | Allow multi selection |
| tone | string | `'pills'` | `pills` `outline` `minimal` | Visual tone |
| background | string | `''` | `bg-1` `bg-2` `bg-3` `bg-4` | Tag surface depth |
| size | string | `'m'` | `s` `m` `l` | Tag size |
| variant | array | `[]` | `border` | Visual modifiers |
| _change | function | | | Selection handler `{ event, value }` |

## Item format

```js
{ id: 'beach', label: 'Beach', icon: 'beach_access', count: 156, color: 'green', disabled: false }
```

String items auto-normalize: `'Beach'` becomes `{ id: 'Beach', label: 'Beach' }`.

## Axes

**tone** = tag style: `pills` (filled), `outline` (border only), `minimal` (text only).
**background** = surface depth for pills tone: `bg-1` through `bg-4`.
**variant** = `border` adds border to pills/minimal tones.
**color** = per-item dot accent: `brand`, `blue`, `red`, `orange`, `green`.
