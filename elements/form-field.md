# form-field

Form field wrapper with label, description, hint tooltip, required mark and error state.
Slots an input control and adds consistent layout, validation feedback and accessibility.

## Usage

```html
<e-form-field label="Email" description="We will send your itinerary here." :required="true" :variant="['border']">
	<div slot="input">
		<e-form-input type="email" icon="mail" placeholder="you@onetype.travel" background="bg-2"></e-form-input>
	</div>
</e-form-field>

<e-form-field label="Name" orientation="vertical" :variant="['clean']">
	<div slot="input">
		<e-form-input icon="person" placeholder="Ada Lovelace" background="bg-2"></e-form-input>
	</div>
</e-form-field>

<e-form-field label="Passport" error="Must be 9 characters." :required="true" :variant="['border']">
	<div slot="input">
		<e-form-input icon="badge" value="P123" background="bg-2"></e-form-input>
	</div>
</e-form-field>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| label | string | `''` | | Field label |
| description | string | `''` | | Helper text below label |
| hint | string | `''` | | Tooltip on info icon |
| error | string | `''` | | Error message, tints input red |
| required | boolean | `false` | | Red asterisk on label |
| orientation | string | `'horizontal'` | `horizontal` `vertical` | Layout direction |
| size | string | `'m'` | `s` `m` `l` | Field size |
| variant | array | `[]` | `border` `clean` | Visual modifiers |

## Axes

**orientation** = `horizontal` (label beside input) or `vertical` (label above input).
**size** = controls padding and label font size.
**variant** = `border` adds bottom separator, `clean` removes all padding.
**error** = shows shake animation message, overrides `--ot-brand` to red on slotted input.
