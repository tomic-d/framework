# form-editor

WYSIWYG rich text editor with toolbar, floating selection bar, slash command menu and clean HTML output.
Supports headings, lists, quotes, links, images, code, dividers and keyboard shortcuts.

## Usage

```html
<e-form-editor placeholder="Write something…"></e-form-editor>
<e-form-editor :value="content" background="bg-2" size="l"></e-form-editor>
<e-form-editor :toolbar="false" :_change="onSave"></e-form-editor>
<e-form-editor :compact="true" :slash="false" :floating="false"></e-form-editor>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| value | string | `''` | | HTML content |
| placeholder | string | `'Start writing…'` | | Placeholder text |
| name | string | `''` | | Hidden input name for forms |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| size | string | `'m'` | `s` `m` `l` | Editor size |
| border | boolean | `true` | | Show border |
| toolbar | boolean | `true` | | Show fixed toolbar |
| floating | boolean | `true` | | Floating bar on text selection |
| slash | boolean | `true` | | Slash command menu on `/` |
| compact | boolean | `false` | | Tighter padding, shorter height |
| _change | function | | | Change handler `{ value }` |

## Toolbar commands

bold, italic, underline, strikethrough, heading 1/2/3, quote, bullet list, numbered list, link, image, inline code, divider, clear formatting, undo, redo.

## Keyboard shortcuts

`⌘B` bold, `⌘I` italic, `⌘U` underline, `⌘K` link. `Escape` closes slash menu. Double enter exits blockquote.

## Output

Clean HTML: `p`, `h2-h4`, `strong`, `em`, `u`, `s`, `a`, `ul`, `ol`, `li`, `blockquote`, `pre`, `code`, `br`, `hr`, `img`. All other tags stripped. `h1` normalized to `h2`. Pasted content auto-sanitized.
