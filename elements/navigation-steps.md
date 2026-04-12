# navigation-steps

Stepper navigation with done, active and upcoming states.
Vertical or horizontal layout with connected progress lines.

## Usage

```html
<e-navigation-steps
	:items="[
		{ id: 'info', label: 'Details', description: 'Basic info', icon: 'person' },
		{ id: 'payment', label: 'Payment', icon: 'payments' },
		{ id: 'confirm', label: 'Confirm', icon: 'check_circle' }
	]"
	active="payment"
	background="bg-1"
	:variant="['border', 'connected']"
></e-navigation-steps>

<e-navigation-steps :items="steps" active="step-2" orientation="horizontal"></e-navigation-steps>
<e-navigation-steps :items="steps" active="step-1" size="s" :variant="['clean', 'connected']"></e-navigation-steps>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| items | array | `[]` | | Step items |
| active | string | `''` | | Active step id |
| orientation | string | `'vertical'` | `vertical` `horizontal` | Layout direction |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| size | string | `'m'` | `s` `m` `l` | Step size |
| variant | array | `['border', 'connected']` | `border` `border-top` `border-right` `border-bottom` `border-left` `clean` `connected` | Visual modifiers |
| _change | function | | | Change handler `{ event, value }` |

## Item fields

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique step identifier |
| label | string | Step label |
| description | string | Secondary text |
| icon | string | Icon for upcoming state |
| disabled | boolean | Prevent selection |

## States

Steps before active are **done** (brand marker + check icon). Active step has **brand marker with glow ring**. Steps after active are **upcoming** (neutral marker with number or icon). Done connector lines turn brand.
