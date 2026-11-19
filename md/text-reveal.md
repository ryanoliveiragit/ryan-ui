# Text reveal

> Revela um trecho curto de conteúdo com movimento discreto.

- Type: component (category Text)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/text-reveal
- Original description: Reveal a short piece of content with restrained motion.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/text-reveal.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/text-reveal.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/text-reveal.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/text-reveal.json`. Registry path, relative to the site address: `r/text-reveal.json`.

- npm packages: none besides React
- Files, once installed:
  - `components/ryan-ui/text-reveal/text-reveal.tsx`
  - `components/ryan-ui/text-reveal/text-reveal.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: there are no packages to install.
2. Copy the files listed above. The content of each one is in `r/text-reveal.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A title or short phrase at the top of a page or section, which should animate right as it appears, without waiting for scroll.
- Server-rendered pages: the entrance is CSS only, starts on the first paint, and never leaves the text hidden if JavaScript is late.
- Repeat the entrance after an action, by changing the component's `key`.

## When not to use

- Use [`in-view-title`](in-view-title.md) when the title is further down the page and should animate on entering the screen.
- Use [`streaming-response`](streaming-response.md) for text that arrives gradually, word by word, such as an assistant's reply.
- It does not suit long paragraphs: each word becomes an element and the maximum width is 24 characters.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import TextReveal from "@/components/ryan-ui/text-reveal/text-reveal";
import { Button } from "@/components/ryan-ui/button/button";
import { Stack } from "./_kit";

export default function TextRevealDemo() {
  const [run, setRun] = useState(0);
  return (
    <Stack align="center" gap={5} width={520}>
      <div key={run} style={{ textAlign: "center" }}>
        <TextReveal text="Everything your team needs, in one calm place." />
      </div>
      <Button variant="secondary" size="sm" onClick={() => setRun(r => r + 1)}>Replay</Button>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `TextReveal`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` (required) | `string` | — | — |
| `as` | `"h1" \| "h2" \| "h3" \| "p"` | `"h2"` | — |
| `className` | `string` | — | — |
| `id` | `string` | — | — |
| `delay` | `number` | `0` | — |

## Accessibility

- In headings (`h1` to `h3`), the accessible name comes from `aria-label` with the whole phrase; in a `p`, which does not accept a name, there is a hidden copy. The animated words are `aria-hidden`.

## Motion

- Each word rises from inside a soft-edged clip while coming out of a blur (8 px on headings, 4 px on paragraphs); the fade finishes first and the rise last.
- Words enter in sequence, taking about 0.5 s in total however long the text is, and `delay` postpones the start; at the end, no word is left with a transform or filter.
- With “reduce motion”, only a short fade remains, with no rise or blur.

## Responsive behavior

- The maximum width is `24ch` and lines are balanced (`text-wrap: balance`); for wider text, change the width with `className`.

## Notes for AI

- Import `TextReveal` from `@/components/ryan-ui/text-reveal/text-reveal`; the text goes in `text`, with `\n` for a chosen line break. There is no visibility prop: it animates on mount.
- To repeat, change the `key` of the component or of a parent; to animate only when the user scrolls to it, use `in-view-title`.
- It does not center itself (`margin: 0` and a maximum width of `24ch`): to center it, use `margin-inline: auto` via `className` or a centered flex parent, as in the demo.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/text-reveal · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
