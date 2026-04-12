# core-builder

Config-driven form builder with wizard steps, sections, grid columns, conditions and save action.
Renders `form-section` and `form-field` elements from section/field definitions.

## Usage

```html
<e-core-builder :values="data" :sections="sections"></e-core-builder>
<e-core-builder :values="data" :steps="steps" save="Save" :_save="onSave"></e-core-builder>
<e-core-builder :values="data" :sections="sections" background="bg-1" :border="true" size="s"></e-core-builder>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| values | object | `{}` | | Form data keyed by field key |
| steps | array | `[]` | | Wizard steps `{ id, label, description, icon, sections }` |
| sections | array | `[]` | | Flat sections when no steps |
| save | string | `''` | | Save button label. Empty hides |
| disabled | boolean | `false` | | Disable save button |
| background | string | `''` | `bg-1` `bg-2` `bg-3` `bg-4` | Container background |
| border | boolean | `false` | | Container border |
| size | string | `'m'` | `s` `m` `l` | Section spacing |
| _input | function | | | Input handler `{ key, value }` |
| _change | function | | | Change handler `{ key, value }` |
| _save | function | | | Save handler `{ value }` |

## Section definition

```js
{
    eyebrow: 'Step 1',
    icon: 'person',
    title: 'Details',
    description: 'Primary contact.',
    background: 'bg-1',
    border: true,
    collapsible: false,
    columns: 2,
    condition: (values) => values.type === 'business',
    fields: [...]
}
```

## Field definition

```js
{
    key: 'email',
    label: 'Email',
    description: 'We send the itinerary here.',
    hint: 'Tooltip text.',
    required: true,
    orientation: 'vertical',
    span: 1,
    element: 'form-input',
    properties: { type: 'email', icon: 'mail', placeholder: 'you@example.com', background: 'bg-2', border: true },
    condition: (values) => !!values.name
}
```

`element` is the element id without `e-` prefix. `_change` is auto-wired. `span` controls grid column span.

## Steps mode

When `steps` is provided, a vertical `navigation-steps` sidebar appears. Each step contains its own `sections` array. Click a step to switch panels.
