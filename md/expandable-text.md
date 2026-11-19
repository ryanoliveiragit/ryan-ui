# Expandable text

> Texto longo recolhido em poucas linhas, com ler mais e mostrar menos.

- Type: component (category Disclosure)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/expandable-text
- Original description: Long text clamped to a few lines with a soft fade that glides open with Read more and closes with Show less, shown only when the text overflows.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-text.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-text.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-text.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-text.json`. Registry path, relative to the site address: `r/expandable-text.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/expandable-text/expandable-text.tsx`
  - `components/ryan-ui/expandable-text/expandable-text.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/expandable-text.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Long product descriptions, bios, or reviews in a list, clipped to a few lines with `lines`.
- Variable-length texts where the button should only appear when the text actually exceeds the clip.
- Paragraphs with links in the middle: the whole text stays in the DOM, and a link hidden below the clip opens the text when it receives focus.

## When not to use

- Use [`collapsible`](collapsible.md) when the hidden part is a separate block, such as a list or a form, and not the continuation of the text.
- Use [`accordion`](accordion.md) for several sections with their own titles.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import ExpandableText from "@/components/ryan-ui/expandable-text/expandable-text";
import { Stack } from "./_kit";

export default function ExpandableTextDemo() {
  return (
    <Stack width={460}>
      <ExpandableText lines={3}>
        Harbor Coffee Roasters began in a converted boathouse in 2014 with a single two-kilo roaster and a simple idea: buy directly from farms we can visit, pay well above market, and roast in small batches so every bag arrives fresh. Today we work with eleven cooperatives across Colombia, Ethiopia and Guatemala, and we still roast every order by hand within 48 hours of shipping. Our subscriptions let you pick a cadence, pause whenever you like, and swap beans before each shipment.
      </ExpandableText>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ExpandableText`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` | — | The text. Plain strings, paragraphs, and inline links all work; the whole text stays available to screen readers while clamped. |
| `lines` | `number` | `3` | How many lines show while collapsed. |
| `expanded` | `boolean` | — | Controlled open state. |
| `defaultExpanded` | `boolean` | `false` | — |
| `onExpandedChange` | `(expanded: boolean) => void` | — | — |
| `moreLabel` | `string` | `"Read more"` | Toggle label while collapsed. |
| `lessLabel` | `string` | `"Show less"` | Toggle label while open. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | Also accepts the props of this type, except `children`. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the button, opens or closes the text. |
| `Tab` | When focus reaches a link hidden below the clip, the text opens on its own. |

## Accessibility

- The button has `aria-expanded` and `aria-controls`; the two labels share the same space and the inactive one is hidden, so the name read is always the current one.
- The clipped text stays whole in the DOM, available to the screen reader; the clip is only visual.

## Motion

- The height slides with a smooth deceleration, 500 to 600 ms on open and 400 to 450 ms on close, depending on the distance; the fade on the last line goes away along with it and the arrow rotates in step.
- When closing with the start of the text off screen, the page scrolls back to it.
- With “reduce motion” on, the text opens and closes instantly, the labels swap without a transition, and the scroll back is instant.

## Responsive behavior

- At rest, the clip is CSS in `lh`, and an observer remeasures when the width or font changes: the button appears or disappears depending on whether the text exceeds the clip.

## Performance

- Each instance uses a `ResizeObserver` to know whether the text overflows; in a long list, that is one observer per item.

## Notes for AI

- Translate the labels with `moreLabel` and `lessLabel`; the defaults are “Read more” and “Show less”.
- Do not draw your own “read more”: the button already appears only when the text exceeds `lines` lines (default 3).
- To control it, pass `expanded` with `onExpandedChange`. Import from `@/components/ryan-ui/expandable-text/expandable-text`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/expandable-text · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
