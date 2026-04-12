# global-gallery

Image gallery with bento, grid and carousel layouts. Built-in lightbox with keyboard navigation, thumbnail strip and captions.

## Usage

```html
<e-global-gallery :images="photos"></e-global-gallery>
<e-global-gallery :images="photos" layout="grid" :columns="3" ratio="4/3" :gap="8"></e-global-gallery>
<e-global-gallery :images="photos" layout="carousel" ratio="16/9"></e-global-gallery>
<e-global-gallery :images="photos" height="compact" :maxVisible="3"></e-global-gallery>
<e-global-gallery :images="urls" layout="grid" :columns="4" :lightbox="false"></e-global-gallery>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| images | array | `[]` | | URL strings or `{ src, alt, caption, thumb }` objects |
| layout | string | `'bento'` | `bento` `grid` `carousel` | Gallery layout mode |
| columns | number | `4` | | Grid column count |
| ratio | string | `'16/9'` | | Aspect ratio for grid items and carousel |
| gap | number | `4` | | Gap between items in pixels |
| height | string | `'default'` | `compact` `default` `tall` | Bento layout height |
| maxVisible | number | `5` | | Max visible bento images before show-all |
| lightbox | boolean | `true` | | Enable lightbox on click |
| showAll | boolean | `true` | | Show all-photos button in bento |
| rounded | boolean | `true` | | Apply border-radius |
| size | string | `'m'` | `s` `m` `l` | Gallery size scale |

## Layouts

**bento** — Hero 2/3 left, 2x2 thumbs right. Show-all pill when images exceed maxVisible.
**grid** — Uniform columns with configurable ratio and gap. All images visible.
**carousel** — Single stage with prev/next nav, counter badge and scrollable thumb strip.

## Lightbox

Arrow keys navigate. Thumbnails at bottom. Caption below image. Close with X or Escape.
