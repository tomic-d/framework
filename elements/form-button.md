# form-button

Button with icons, loading spinner, color system and visual modifiers.
Renders `<button>` by default, `<a>` when `href` is set.

## Usage

```html
<e-form-button text="Save" color="brand"></e-form-button>
<e-form-button text="Delete" color="red" tone="soft" icon="delete"></e-form-button>
<e-form-button text="Cancel" tone="ghost"></e-form-button>
<e-form-button text="Next" icon-right="arrow_forward" color="brand" tone="outline"></e-form-button>
<e-form-button icon="settings" background="bg-2" :variant="['icon-only']"></e-form-button>
<e-form-button text="Go to docs" color="brand" href="/docs"></e-form-button>
<e-form-button text="Submit" color="brand" :loading="true"></e-form-button>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| text | string | `''` | | Button label |
| icon | string | `''` | | Left icon |
| iconRight | string | `''` | | Right icon |
| href | string | `''` | | Renders as anchor |
| target | string | `''` | `_blank` `_self` `_parent` `_top` | Anchor target |
| type | string | `'button'` | `button` `submit` `reset` | Button type |
| color | string | `''` | `brand` `blue` `red` `orange` `green` `dark` | Accent color |
| tone | string | `'solid'` | `solid` `soft` `outline` `ghost` `link` | Visual tone |
| background | string | `''` | `bg-1` `bg-2` `bg-3` `bg-4` `glass` | Background depth when no color |
| size | string | `'m'` | `s` `m` `l` | Button size |
| variant | array | `[]` | `full` `rounded` `icon-only` | Visual modifiers |
| disabled | boolean | `false` | | Disabled state |
| loading | boolean | `false` | | Spinner replaces content |
| _click | function | | | Click handler `{ event }` |

## Axes

**tone + color** = colored button: `solid.brand`, `soft.red`, `outline.blue`.
**background** = neutral button when no color: `bg-2`, `glass`.
**tone** alone = structural style: `ghost` (hover bg), `link` (inline text).
**variant** = layout modifiers: `full` (100% width), `rounded` (pill), `icon-only` (square).
