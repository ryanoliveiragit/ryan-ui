# Text morph

> Transforma um rótulo no próximo estado, letra por letra.

- Type: component (category Text)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/text-morph
- Original description: Morph a label into its next state, letter by letter.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/text-morph.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/text-morph.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/text-morph.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/text-morph.json`. Registry path, relative to the site address: `r/text-morph.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/text-morph/text-morph.tsx`
  - `components/ryan-ui/text-morph/text-morph.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/text-morph.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- State labels that change a few letters, such as “Publish”, “Publishing”, and “Published”, or “Follow” and “Following”.
- Short statuses in buttons, badges, or titles, where the new width should slide instead of jumping and pushing what is beside it.

## When not to use

- Use [`slot-text`](slot-text.md) for numbers and values that should spin like reels, such as prices and counters.
- Use [`action-swap`](action-swap.md) for a compact button that goes through states such as idle, working, and done, with icon and width changing together.
- It does not suit long sentences or multi-line text: it stays on a single line and animates letter by letter.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import TextMorph from "@/components/ryan-ui/text-morph/text-morph";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Stack } from "./_kit";

const states = ["Draft", "In review", "Approved", "Published"];

export default function TextMorphDemo() {
  const [i, setI] = useState(0);
  return (
    <Stack align="center" gap={5}>
      <TextMorph as="h2">{states[i]!}</TextMorph>
      <Button variant="secondary" onClick={() => setI((i + 1) % states.length)}>Advance status</Button>
      <Caption>Shared letters stay put while the rest morph.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `TextMorph`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `string` | — | — |
| `as` | `"span" \| "div" \| "p" \| "strong" \| "h1" \| "h2" \| "h3"` | `"span"` | — |
| `className` | `string` | — | — |
| `id` | `string` | — | — |

## Accessibility

- The current text sits in a visually hidden `span` and the animated letters are `aria-hidden`, so the screen reader reads the whole word, never loose letters.
- The swap is not announced; if the change needs to be heard, put the component inside your own `aria-live` region.

## Motion

- Shared letters slide to the new position with a no-overshoot spring; new ones emerge from a slight blur, in reading order, and removed ones dissolve.
- The width follows the new text with the same spring and a soft edge reveals the incoming letters, so the surrounding layout slides instead of jumping.
- With “reduce motion”, the text swaps immediately.

## Notes for AI

- Import `TextMorph` from `@/components/ryan-ui/text-morph/text-morph` and pass a string as the child: `<TextMorph>{status}</TextMorph>`; elements as children do not work.
- It works best when labels share letters, which stay in place; with words that have nothing in common, all letters leave and enter again. Use `as` for the right element (`h2`, `strong`).
- It stays on a single line (`nowrap`): reserve space for the longest label or let the width vary with the text.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/text-morph · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
