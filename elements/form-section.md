# form-section

Form section with eyebrow, icon, title, description, collapsible toggle and actions slot.
Content can hold form-field rows (no padding) or custom content with `padded` variant.

## Usage

```html
<!-- With fields (no padding needed) -->
<e-form-section icon="badge" title="Passport" description="International bookings." background="bg-2" :variant="['border']">
	<div slot="content">
		<e-form-field label="Full name" :required="true" :variant="['border']">
			<div slot="input"><e-form-input icon="person" placeholder="Name" background="bg-1"></e-form-input></div>
		</e-form-field>
	</div>
</e-form-section>

<!-- With custom content (padded) -->
<e-form-section icon="credit_card" title="Payment" background="bg-2" :variant="['border', 'padded']">
	<div slot="content">
		<e-form-input icon="credit_card" placeholder="Card number" background="bg-1"></e-form-input>
	</div>
</e-form-section>

<!-- Collapsible -->
<e-form-section title="Extras" :collapsible="true" :collapsed="true" background="bg-2" :variant="['border']">
	<div slot="content">...</div>
</e-form-section>

<!-- With actions -->
<e-form-section title="Preferences" background="bg-2" :variant="['border']">
	<div slot="actions">
		<e-form-button text="Save" color="brand" size="s"></e-form-button>
	</div>
	<div slot="content">...</div>
</e-form-section>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| eyebrow | string | `''` | | Uppercase label above title |
| icon | string | `''` | | Leading icon in brand box |
| title | string | `''` | | Section title |
| description | string | `''` | | Helper text below title |
| collapsible | boolean | `false` | | Enable expand/collapse |
| collapsed | boolean | `false` | | Start collapsed |
| background | string | `''` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| size | string | `'m'` | `s` `m` `l` | Section size |
| variant | array | `[]` | `border` `clean` `padded` | Visual modifiers |

## Slots

- **content** — form-field rows or custom content
- **actions** — buttons in header right side

## Axes

**background** = surface depth, auto-matches header border color.
**size** = controls header padding, icon size, title size and padded content spacing.
**variant** = `border` (outer border), `clean` (no container), `padded` (content padding + gap).
