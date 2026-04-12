# global-heading

Section or page heading with eyebrow, icon, serif title, description and right/bottom slots.
Title supports `<em>` tags for brand-colored italic accent words.

## Usage

```html
<e-global-heading title="Your <em>trips</em>" description="Upcoming journeys."></e-global-heading>
<e-global-heading eyebrow="Featured" icon="explore" title="Discover <em>Montenegro</em>" size="l"></e-global-heading>
<e-global-heading title="Reviews" align="center" :variant="['border']"></e-global-heading>
<e-global-heading icon="luggage" title="Trips" :variant="['border']">
    <div slot="right"><e-form-button text="New" icon="add" color="brand"></e-form-button></div>
</e-global-heading>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| eyebrow | string | `''` | | Uppercase label above title |
| icon | string | `''` | | Leading icon in brand box |
| title | string | `''` | | Heading text, `<em>` for accent |
| description | string | `''` | | Subtext below title |
| element | string | `'h2'` | `h1` `h2` `h3` | HTML heading element |
| align | string | `'left'` | `left` `center` `right` | Content alignment |
| size | string | `'m'` | `s` `m` `l` | Heading scale |
| variant | array | `[]` | `border` | Visual modifiers |

## Slots

- **right** — actions beside the title (buttons, controls)
- **bottom** — content below heading (filters, tabs)

## Axes

**align** = content direction: `left` (default), `center` (stacked), `right` (reversed).
**size** = title scale: `s` (22px), `m` (32px), `l` (48px). Icon and description scale with it.
**variant** = `border` adds bottom separator line.
