# cards-pricing

Pricing plan card with icon, badge, ribbon, feature list and CTA button.
Supports highlighted (brand border + accent bar) and featured (gradient fill) tones.

## Usage

```html
<e-cards-pricing icon="flight" name="Basic" price="9" currency="€" :features="features"></e-cards-pricing>
<e-cards-pricing icon="star" name="Pro" price="29" currency="€" tone="highlighted" badge="Popular" :features="features"></e-cards-pricing>
<e-cards-pricing icon="rocket" name="Pro" price="29" currency="€" tone="featured" ribbon="Best value" :features="features"></e-cards-pricing>
<e-cards-pricing icon="offer" name="Pro" price="19" original="29" currency="€" yearly="Save €84/yr" :features="features"></e-cards-pricing>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| icon | string | `''` | | Plan icon |
| name | string | `''` | | Plan name |
| description | string | `''` | | Short tagline |
| badge | string | `''` | | Pill badge next to icon |
| ribbon | string | `''` | | Corner ribbon label |
| currency | string | `'$'` | | Currency symbol |
| price | string\|number | `''` | | Plan price |
| original | string\|number | `''` | | Strikethrough original price |
| period | string | `'/mo'` | | Billing period |
| yearly | string | `''` | | Yearly savings caption |
| features | array | `[]` | | `[{ text, icon, included, highlight }]` |
| cta | string | `'Get started'` | | CTA button text |
| ctaIcon | string | `'arrow_forward'` | | CTA button icon |
| href | string | `''` | | CTA link URL |
| tone | string | `''` | `highlighted` `featured` | Card emphasis |
| background | string | `'bg-1'` | `bg-1` `bg-2` `bg-3` `bg-4` | Background depth |
| border | boolean | `true` | | Show border |
| size | string | `'m'` | `s` `m` `l` | Card size |
| _click | function | | | CTA click handler `{ event }` |

## Axes

**tone** = card emphasis: `highlighted` (brand border + top bar), `featured` (gradient fill, white text).
**background** = surface depth when no tone: `bg-1` through `bg-4`.
**size** = padding, icon size, price font size: `s`, `m`, `l`.

## Features format

```js
[
    { text: 'Unlimited trips', icon: 'flight', highlight: true },
    { text: 'Email support', icon: 'mail' },
    { text: 'Priority booking', icon: 'bolt', included: false }
]
```

`included: false` shows strikethrough + muted icon. `highlight: true` bolds text + brand icon.
