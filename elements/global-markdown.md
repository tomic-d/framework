# global-markdown

Markdown renderer with premium typography, collapsible read more and background variants.
Parses markdown string via `onetype.Markdown()` into styled prose HTML.

## Usage

```html
<e-global-markdown :content="text"></e-global-markdown>
<e-global-markdown :content="text" background="bg-2" :variant="['border']"></e-global-markdown>
<e-global-markdown :content="text" :collapsible="true" :maxHeight="300" background="bg-2"></e-global-markdown>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| content | string | `''` | | Markdown string to render |
| collapsible | boolean | `false` | | Enable read more toggle |
| maxHeight | number | `200` | | Collapsed max height in px |
| expanded | boolean | `false` | | Start expanded when collapsible |
| background | string | `''` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth with padding |
| variant | array | `[]` | `border` | Visual modifiers |

## Typography

Prose container with styled headings (h1-h4), paragraphs (text-2, first paragraph text-1),
bold, italic, strikethrough, links (brand underline), lists (brand markers), blockquotes
(brand left border, secondary font), inline code (brand, bg-2 pill), code blocks (bg-2,
monospace), images (rounded), tables (striped borders), and horizontal rules.

## Axes

**background** = adds padding + surface color. Fade gradient and toggle border auto-match.
**collapsible** = clips content at `maxHeight` with gradient fade and toggle button.
