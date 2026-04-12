# form-upload

File upload with drag-and-drop, URL-based preview grid and suffix detection.
Two modes: `grid` (square cards with thumbnails) and `input` (single URL field with inline preview).

## Usage

```html
<!-- Grid mode (default) — multiple files as cards -->
<e-form-upload :value="urls" :_change="onChange"></e-form-upload>
<e-form-upload :value="urls" :max="4" accept=".pdf,.docx" hint="PDF and Word only"></e-form-upload>

<!-- Input mode — single URL field with preview -->
<e-form-upload mode="input" :value="urls" placeholder="Paste image URL…"></e-form-upload>
<e-form-upload mode="input" :value="urls" background="bg-3" size="s"></e-form-upload>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| mode | string | `'grid'` | `grid` `input` | Display mode |
| value | string[] | `[]` | | Array of file URLs |
| placeholder | string | `'Paste URL or drop file…'` | | Placeholder for input mode |
| multiple | boolean | `true` | | Allow multiple files (grid mode) |
| max | number | | | Maximum file count |
| accept | string | `''` | | Accepted extensions (.png, .pdf) or MIME |
| label | string | `'Drop files here or click to browse'` | | Dropzone label (grid mode) |
| hint | string | `''` | | Hint below label |
| icon | string | `'cloud_upload'` | | Dropzone icon |
| background | string | `'bg-2'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| size | string | `'m'` | `s` `m` `l` | Size |
| disabled | boolean | `false` | | Disabled state |
| _change | function | | | Change handler `{ value }` |
| _upload | function | | | Upload handler `{ file }`, must return URL or null |
| _error | function | | | Error handler `{ errors }` |

## Modes

**grid** — Dropzone + square card grid. Images render as thumbnails, other files show icon + extension badge. Add button appears when under limit. Clear all footer when multiple files.

**input** — Single URL text field with inline preview thumbnail. Paste URL or click upload icon to pick file. Image URLs show thumbnail preview, other files show file type icon.

## Suffix Detection

Detects type from URL extension: images (png, jpg, gif, webp, svg, avif), video (mp4, webm, mov), audio (mp3, wav), pdf, archives (zip, rar), office (doc, xls, ppt), code files.
