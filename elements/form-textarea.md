# form-textarea

Multi-line text input with auto-resize, character counter and focus ring.

## Usage

```html
<e-form-textarea placeholder="Write something…"></e-form-textarea>
<e-form-textarea placeholder="Bio…" :counter="true" :maxlength="160" :rows="4"></e-form-textarea>
<e-form-textarea placeholder="Grows…" :autoResize="true" :minRows="2" :maxRows="8"></e-form-textarea>
<e-form-textarea placeholder="No border" background="bg-3" :border="false"></e-form-textarea>
```

## Config

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| value | string | `''` | | Current value |
| name | string | `''` | | Form field name |
| placeholder | string | `''` | | Placeholder text |
| rows | number | `4` | | Initial visible rows |
| minRows | number | | | Min rows for auto-resize |
| maxRows | number | | | Max rows for auto-resize |
| maxlength | number | | | Max character count |
| autoResize | boolean | `false` | | Grow height with content |
| counter | boolean | `false` | | Show character counter |
| resize | string | `'vertical'` | `none` `vertical` `horizontal` `both` | CSS resize handle |
| background | string | `'bg-2'` | `bg-1` `bg-2` `bg-3` `bg-4` `transparent` | Background depth |
| border | boolean | `true` | | Show border |
| size | string | `'m'` | `s` `m` `l` | Textarea size |
| disabled | boolean | `false` | | Disabled state |
| readonly | boolean | `false` | | Readonly state |
| _input | function | | | Input handler `{ event, value }` |
| _change | function | | | Change handler `{ event, value }` |
| _focus | function | | | Focus handler `{ event, value }` |
| _blur | function | | | Blur handler `{ event, value }` |

## Notes

- `autoResize` disables manual resize handle and grows between `minRows`/`maxRows`.
- `counter` requires `maxlength` — shows `current / max` with red highlight at limit.
- `background` + `border` are independent axes — combine freely.
