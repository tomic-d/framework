# form-tags

Tag input with autocomplete dropdown, multi-select chip mode, duplicate shake, keyboard navigation and color variants.

## Usage

```html
<!-- Free input -->
<e-form-tags placeholder="Add tag…" background="bg-2" :variant="['border']"></e-form-tags>

<!-- With autocomplete -->
<e-form-tags :options="['Beach', 'Mountain', 'City']" color="brand" background="bg-2" :variant="['border']"></e-form-tags>

<!-- Restricted to options only -->
<e-form-tags :options="['Serbia', 'Croatia']" :restrict="true" background="bg-2" :variant="['border']"></e-form-tags>

<!-- Multi-select chips (click to toggle) -->
<e-form-tags :options="['Beach', 'Mountain', 'City']" mode="select" color="blue" background="bg-2" :variant="['border']"></e-form-tags>

<!-- Max 3 tags -->
<e-form-tags :options="['A', 'B', 'C', 'D']" :max="3" background="bg-2" :variant="['border']"></e-form-tags>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| value | array | `[]` | | Selected tags (string[]) |
| name | string | `''` | | Form field name |
| placeholder | string | `'Add tag…'` | | Input placeholder |
| options | array | `[]` | | Suggestion list / selectable chips |
| mode | string | `'input'` | `input` `select` | Type to add vs click chips to toggle |
| max | number | `0` | | Max tags. 0 = unlimited |
| minLength | number | `0` | | Min characters per tag |
| restrict | boolean | `false` | | Only allow values from options |
| color | string | `''` | `brand` `blue` `red` `orange` `green` | Tag chip color |
| background | string | `'bg-2'` | `bg-1` `bg-2` `bg-3` `bg-4` `transparent` | Container background |
| size | string | `'m'` | `s` `m` `l` | Field size |
| variant | array | `[]` | `border` | Visual modifiers |
| disabled | boolean | `false` | | Disabled state |
| _change | function | | | Change handler `{ value }` |

## Axes

**mode** = interaction model: `input` (type + autocomplete), `select` (clickable chip grid).
**color** = tag chip accent: `brand`, `blue`, `red`, `orange`, `green`.
**background** = container fill: `bg-1` through `bg-4`, `transparent`.

## Keyboard

`Enter` — add from dropdown or free text. `Backspace` — remove last tag. `ArrowDown/Up` — navigate dropdown. `Escape` — close dropdown. Duplicate tags trigger shake animation.
