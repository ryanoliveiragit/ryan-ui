# Text shimmer

> Indica trabalho em andamento com uma luz calma passando pelo texto.

- Type: component (category Text)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/text-shimmer
- Original description: Show ongoing work with a calm light across the words.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/text-shimmer.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/text-shimmer.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/text-shimmer.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/text-shimmer.json`. Registry path, relative to the site address: `r/text-shimmer.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/text-shimmer/text-shimmer.tsx`
  - `components/ryan-ui/text-shimmer/text-shimmer.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/text-shimmer.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A short status line while something is working: “Thinking”, “Generating summary”, “Analyzing 1,284 transactions…”.
- A status that ends in the same place: with `active={false}`, the light leaves, the text turns solid, and a new label, such as “Analysis complete”, rises in its place.

## When not to use

- Use [`loading-states`](loading-states.md) for a fuller AI indicator, with dots, rotating phrases, or a step counter.
- Use [`skeleton`](skeleton.md) to reserve the space of content that has not arrived yet.
- Use [`progress`](progress.md) when it is possible to show how much remains.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import TextShimmer from "@/components/ryan-ui/text-shimmer/text-shimmer";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Stack } from "./_kit";

export default function TextShimmerDemo() {
  const [working, setWorking] = useState(true);
  return (
    <Stack align="center" gap={5}>
      <TextShimmer as="p" active={working}>{working ? "Analyzing 1,284 transactions…" : "Analysis complete"}</TextShimmer>
      <Button variant="secondary" onClick={() => setWorking(w => !w)}>{working ? "Finish" : "Start again"}</Button>
      <Caption>The light sweeps only while work is ongoing.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `TextShimmer`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `string` | — | The status text. Keep it to one short line. |
| `active` | `boolean` | `true` | Sweep while work is ongoing. Defaults to true. |
| `duration` | `number` | `1.8` | Seconds for one sweep across the text. Defaults to 1.8. |
| `as` | `"span" \| "p" \| "div" \| "h2" \| "h3" \| "h4"` | `"span"` | — |
| `className` | `string` | — | — |
| `id` | `string` | — | — |

## Accessibility

- With `active`, the element gets `aria-busy`; the end of the work is not announced, so announce it in your own live region.
- In high contrast (`forced-colors`) or without `color-mix` support, the effect disappears and the text appears in its normal color.

## Motion

- A band of light in the text color crosses the words at a linear pace every `duration` (default 1.8 s), with a short pause between passes.
- When `active` is turned off, the band finishes passing and the text settles into the solid color; a new label rises with a slight blur and the width follows with a spring.
- With “reduce motion”, there is no band: the text stays in the dimmer base color while `active`, and solid at the end; the label swap becomes a fade.

## Performance

- The band only moves while the text is on screen (with a 64 px margin) and the tab is visible, and resumes where it left off; off screen, no animation runs.

## Notes for AI

- Import `TextShimmer` from `@/components/ryan-ui/text-shimmer/text-shimmer`; the text goes as the child (a string) and `active` turns the light on and off.
- Keep it to a short line; the band color comes from the text color, and can be adjusted with `--text-shimmer-highlight` and `--text-shimmer-base`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/text-shimmer · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
