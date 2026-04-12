# cards-profile

Profile card with avatar, cover image, name, role, bio, stats, tags, socials and action slots.
Supports vertical and horizontal orientation with optional clickable link overlay.

## Usage

```html
<e-cards-profile
	avatar="https://example.com/photo.jpg"
	name="Alex Marković"
	role="Travel guide · Kotor"
></e-cards-profile>

<e-cards-profile
	cover="https://example.com/cover.jpg"
	avatar="https://example.com/photo.jpg"
	name="Sarah Chen"
	role="Blogger"
	description="Exploring the world one bay at a time."
	:verified="true"
	:stats="[{ num: '42', label: 'Trips' }, { num: '18', label: 'Countries' }]"
	:tags="[{ icon: 'flight', label: 'Wanderer' }]"
	size="l"
>
	<e-form-button slot="actions" text="Message" icon="mail" color="brand" size="s"></e-form-button>
</e-cards-profile>

<e-cards-profile orientation="horizontal" name="Marco Rossi" role="Guide" background="bg-2"></e-cards-profile>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| avatar | string | `''` | | Avatar image URL |
| name | string | `''` | | Display name |
| role | string | `''` | | Role or subtitle |
| verified | boolean | `false` | | Blue verified badge |
| cover | string | `''` | | Cover image URL |
| description | string | `''` | | Bio text |
| meta | string | `''` | | Small meta line |
| href | string | `''` | | Card link URL |
| tags | array | `[]` | | `[{ icon, label }]` pill tags |
| stats | array | `[]` | | `[{ num, label }]` stat pairs |
| socials | array | `[]` | | `[{ icon, label, href, target }]` links |
| following | boolean | `false` | | Follow state |
| orientation | string | `'vertical'` | `vertical` `horizontal` | Layout direction |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| border | boolean | `true` | | Show border |
| size | string | `'m'` | `s` `m` `l` | Card size |
| _follow | function | | | Follow handler `{ event, value }` |
| _click | function | | | Click handler `{ event }` |

## Slots

- **actions** — custom buttons below the body content

## Axes

**orientation** = `vertical` (stacked) or `horizontal` (side by side, no cover).
**background** = surface depth, auto-adapts tag/social/stat borders.
**size** = controls avatar size (44/56/72px), padding, typography and cover height.
