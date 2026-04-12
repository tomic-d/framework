# navigation-dock

Slim 68px icon rail with grouped navigation, logo, badges and tooltips.
Top/bottom placement splits items into two stacks with auto margin.

## Usage

```html
<e-navigation-dock
	:groups="[
		{
			placement: 'top',
			items: [
				{ icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
				{ icon: 'flight', label: 'Trips', href: '/trips' },
				{ icon: 'explore', label: 'Discover', href: '/discover' }
			]
		},
		{
			placement: 'bottom',
			items: [
				{ icon: 'settings', label: 'Settings', href: '/settings' }
			]
		}
	]"
></e-navigation-dock>

<e-navigation-dock logo="/logo.svg" :groups="groups" background="bg-3" :variant="['border-right']"></e-navigation-dock>
<e-navigation-dock :groups="groups" :_click="({ value }) => navigate(value)"></e-navigation-dock>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| logo | string | `''` | | Logo image URL, links to / |
| groups | array | `[]` | | Navigation groups |
| background | string | `'bg-2'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| variant | array | `['border-right']` | `border` `border-top` `border-right` `border-bottom` `border-left` | Border modifiers |
| _click | function | | | Click handler `{ event, value }` |

## Group format

```js
{
	placement: 'top',       // 'top' or 'bottom'
	items: [
		{ icon: 'flight', label: 'Trips', href: '/trips', match: '/trip', badge: 3 }
	]
}
```

## Item fields

| Field | Type | Description |
|-------|------|-------------|
| icon | string | Material icon name |
| label | string | Tooltip text on hover |
| href | string | Navigation URL |
| match | string | Active path prefix. Falls back to href |
| badge | string\|number | Notification badge value |

## Features

- Active item detected from current route via `match` or `href` prefix.
- Active state shows brand accent bar, brand background and heavier icon weight.
- Badges render as brand pills with parent-bg border for cutout effect.
- Groups separated by thin line. Logo adds separator below itself.
