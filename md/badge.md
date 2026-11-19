# Badge

> Etiqueta compacta para status, categorias e destaques, em tons e cores variados.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/badge
- Original description: A small label for status, category, or metadata.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/badge.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/badge.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/badge.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/badge.json`. Registry path, relative to the site address: `r/badge.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/badge/badge.tsx`
  - `components/ryan-ui/badge/badge.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/badge.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- The state of a record in a table, list, or card (Active, Overdue, Failed), with `tone` and, if you like, the `dot` indicator.
- Categories with no state meaning, such as HTTP methods or labels, with the six `color` options.
- A label that changes in place (Draft → Published): the text swaps and the width follows with a spring.

## When not to use

- Use [`tag-input`](tag-input.md) for values the user types and removes.
- Use [`chip-group`](chip-group.md) for filters that toggle on and off: the badge is not clickable and does not receive focus.
- Use [`alert`](alert.md) when the message needs an explanation or an action.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ryan-ui/badge/badge";
import { Caption, Row, Stack } from "./_kit";

export default function BadgeDemo() {
  return (
    <Stack gap={6} align="center">
      <Row justify="center">
        <Badge dot>Draft</Badge>
        <Badge tone="success" dot>Active</Badge>
        <Badge tone="info" dot>In review</Badge>
        <Badge tone="warning" dot>Past due</Badge>
        <Badge tone="danger" dot>Failed</Badge>
      </Row>
      <Row justify="center">
        <Badge color="teal" size="sm">GET</Badge>
        <Badge color="sky" size="sm">POST</Badge>
        <Badge color="violet" size="sm">PUT</Badge>
        <Badge color="amber" size="sm">PATCH</Badge>
        <Badge color="rose" size="sm">DELETE</Badge>
        <Badge color="orchid" size="sm">HEAD</Badge>
      </Row>
      <Row justify="center">
        <Badge tone="success" icon={<CheckCircle2 size={14} aria-hidden="true" />} pill>Verified</Badge>
        <Badge tone="info" outline pill size="lg" icon={<Sparkles size={14} aria-hidden="true" />}>New</Badge>
        <Badge tone="warning" outline>Beta</Badge>
      </Row>
      <Caption>Tones for status, colors for categories.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Badge`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `"neutral" \| "success" \| "info" \| "warning" \| "danger"` | `"neutral"` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | — |
| `icon` | `ReactNode` | — | — |
| `dot` | `boolean` | `false` | A small status dot in the tone colour. Ignored when an icon is set. |
| `color` | `"teal" \| "sky" \| "orchid" \| "violet" \| "rose" \| "amber"` | — | Categorical colour from the shared tone family, for labels such as method tags. Overrides tone. |
| `outline` | `boolean` | `false` | Draws a hairline border in the tone colour. |
| `pill` | `boolean` | `false` | Fully rounded ends instead of the default soft corners. |
| `...props` | `HTMLAttributes<HTMLSpanElement>` | — | Also accepts the props of this type. |

### Exported types

| Type | Definition |
| --- | --- |
| `BadgeTone` | `"neutral" \| "success" \| "info" \| "warning" \| "danger"` |
| `BadgeSize` | `"sm" \| "md" \| "lg"` |
| `BadgeColor` | `"teal" \| "sky" \| "orchid" \| "violet" \| "rose" \| "amber"` |

## Accessibility

- It is a `span` with no role: the screen reader reads only the text, so the word itself must state the status; the `tone` color and the dot are not announced.
- Icon and dot are `aria-hidden`, and during the swap so is the outgoing copy, so the text is not read twice.
- A text change is not announced on its own; if needed, pass `role="status"` (extra props go to the `span`).

## Motion

- When the text changes, the old one rises and disappears, the new one enters from below with a slight blur, and the width goes from the old size to the new with a no-overshoot spring.
- An icon from another component swaps with scale and fade; changing `tone` or `color` makes background, border, and text change color in a short transition.
- With “reduce motion”, text and icon only fade quickly and the width follows immediately.

## Responsive behavior

- The badge does not wrap or shrink (`white-space: nowrap`, `flex: none`): in narrow columns use short labels or `size="sm"`.

## Performance

- Each badge keeps a size observer for the width animation; in a table with hundreds of rows this adds up, so paginate or virtualize.

## Notes for AI

- Use `tone` for status (`neutral`, `success`, `info`, `warning`, `danger`) and `color` for category; `color` wins over `tone`, and `dot` is ignored when there is an `icon`.
- Pass the label as plain text (`<Badge>{status}</Badge>`): the animated swap only happens when the child is a string or number, not JSX.
- The `icon` SVG is resized by CSS to 12, 14, or 16 px depending on `size`; `outline` and `pill` only change the border and corners.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/badge · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
