# global-code

Code block with syntax highlighting, copy button, line numbers and line highlight.
Dark terminal-style background with macOS window dots. Supports JS, CSS, HTML, JSON, Python and Bash.

## Usage

```html
<e-global-code :source="code" language="js" background="bg-2"></e-global-code>
<e-global-code :source="code" language="css" filename="styles.css" :lines="true"></e-global-code>
<e-global-code :source="code" language="js" :lines="true" highlight="2,4-6"></e-global-code>
<e-global-code :source="code" language="json" :copy="false" size="s"></e-global-code>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| source | string | `''` | | Raw code string |
| language | string | `'js'` | `js` `css` `html` `json` `python` `bash` | Syntax language |
| filename | string | `''` | | Filename in header, replaces language label |
| lines | boolean | `false` | | Show line numbers |
| highlight | string | `''` | | Lines to highlight: `2,4-6` |
| copy | boolean | `true` | | Show copy button |
| color | string | `''` | | Custom background color override |
| background | string | `''` | `bg-1` `bg-2` `bg-3` `bg-4` | Frame outline depth |
| border | boolean | `true` | | Show border |
| size | string | `'m'` | `s` `m` `l` | Padding and font size |

## Syntax tokens

keyword (red), string (blue), number (orange), comment (gray italic), function (purple), tag (green), attribute (cyan), selector (green), property (cyan).
