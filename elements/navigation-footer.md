# navigation-footer

Site footer with brand column, link groups, social icons, newsletter form, legal bar and slots.
Responsive: stacks to single column on mobile, groups to 2-col then 1-col.

## Usage

```html
<e-navigation-footer
    logo="/logo.svg"
    tagline="Build beautiful experiences."
    :groups="groups"
    :social="social"
    :legal="legal"
    copyright="© 2026 Acme"
    :newsletter="true"
    :_subscribe="onSubscribe"
    background="bg-1"
    :variant="['border']"
></e-navigation-footer>
```

## Config

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| logo | string | `''` | Logo image URL |
| logoAlt | string | `'Logo'` | Logo alt text |
| brandHref | string | `'/'` | Logo link destination |
| tagline | string | `''` | Short brand description |
| groups | array | `[]` | `[{ title, items: [{ icon?, label, href, target?, badge? }] }]` |
| social | array | `[]` | `[{ icon, label, href }]` — tooltip on hover |
| legal | array | `[]` | `[{ label, href }]` — dot-separated in bottom bar |
| copyright | string | `''` | Copyright text |
| newsletter | boolean | `false` | Show newsletter form |
| newsletterTitle | string | `'Stay in the loop'` | Newsletter heading |
| newsletterDescription | string | `'Get product updates…'` | Newsletter subtext |
| newsletterPlaceholder | string | `'you@example.com'` | Email placeholder |
| newsletterButton | string | `'Subscribe'` | Submit button text |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` |
| variant | array | `[]` | `border` `clean` |
| _subscribe | function | | Newsletter submit `{ value }` |

## Slots

- **top** — content above main section (separated by border)
- **bottom** — content below bottom bar (separated by border)

## Axes

**background** = footer surface depth: `bg-1` through `bg-4`.
**variant** = `border` (top border matching bg), `clean` (transparent, no border).
