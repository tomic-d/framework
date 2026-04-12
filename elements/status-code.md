# status-code

Full-page status code with large gradient number, title, description and action button.
Works for HTTP errors, empty states or any numeric status display.

## Usage

```html
<e-status-code code="404" title="Page not found" action="Go Home" href="/"></e-status-code>
<e-status-code code="500" title="Server error" color="red"></e-status-code>
<e-status-code code="200" title="All caught up" action="" color="green" size="s"></e-status-code>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| code | string | `'404'` | | Status code number |
| title | string | `'Page not found'` | | Heading below the code |
| description | string | `'The page you're looking for…'` | | Paragraph text |
| action | string | `'Go Home'` | | Button label. Empty hides button |
| href | string | `'/'` | | Button link target |
| color | string | `''` | `brand` `blue` `red` `orange` `green` | Code number gradient accent |
| size | string | `'m'` | `s` `m` `l` | Overall scale |

## Axes

**color** = gradient accent on the large code number: `brand`, `red`, `blue`, etc.
**size** = controls code font size (96/140/200px), title size and container min-height.
