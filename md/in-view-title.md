# In-view title

> Título que entra com animação ao aparecer na rolagem.

- Type: component (category Text)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/in-view-title
- Original description: Bring a section title in as it scrolls into view.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/in-view-title.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/in-view-title.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/in-view-title.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/in-view-title.json`. Registry path, relative to the site address: `r/in-view-title.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/in-view-title/in-view-title.tsx`
  - `components/ryan-ui/in-view-title/in-view-title.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/in-view-title.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Section titles on long pages, such as landing pages and product pages, that enter when the section reaches the screen.
- Different entrance tones: `blur` suits almost any title, `word` and `line` suit editorial pages, `tracking` suits short highlight titles, and `wipe` reveals from left to right.
- Titles with hand-picked line breaks, by passing `lines` in the `line` variant.

## When not to use

- Use [`text-reveal`](text-reveal.md) for a title that should animate right on mount, such as at the top of the page, without waiting for scroll.
- Use [`scroll-reveal`](scroll-reveal.md) to reveal whole blocks on scroll, such as cards, lists, and paragraphs, not just the title.
- On work screens the user uses every day, such as dashboards and forms, an animated title only delays reading; use a plain title.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import InViewTitle from "@/components/ryan-ui/in-view-title/in-view-title";
import type { InViewTitleVariant } from "@/components/ryan-ui/in-view-title/in-view-title";
import { Button } from "@/components/ryan-ui/button/button";
import { Row, Stack } from "./_kit";

const variants: InViewTitleVariant[] = ["blur", "word", "line", "tracking", "wipe"];

export default function InViewTitleDemo() {
  const [variant, setVariant] = useState<InViewTitleVariant>("blur");
  return (
    <Stack gap={6} align="center" width={560}>
      <div style={{ minHeight: 96, display: "grid", placeItems: "center", textAlign: "center" }}>
        <InViewTitle key={variant} variant={variant} text="Ship interfaces people remember" lines={["Ship interfaces", "people remember"]} />
      </div>
      <Row justify="center" gap={2}>
        {variants.map(v => <Button key={v} size="sm" variant={v === variant ? "primary" : "secondary"} onClick={() => setVariant(v)}>{v}</Button>)}
      </Row>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `InViewTitle`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` (required) | `string` | — | — |
| `variant` | `"word" \| "line" \| "blur" \| "tracking" \| "wipe"` | `"blur"` | — |
| `as` | `"h1" \| "h2" \| "h3"` | `"h2"` | — |
| `lines` | `string[]` | — | — |
| `className` | `string` | — | — |
| `id` | `string` | — | — |
| `once` | `boolean` | `true` | — |

### Exported types

| Type | Definition |
| --- | --- |
| `InViewTitleVariant` | `"word" \| "line" \| "blur" \| "tracking" \| "wipe"` |

## Accessibility

- The title is a real `h2` (or `h1` and `h3` via `as`) with `aria-label` equal to `text`; animated words and letters are `aria-hidden`, so the screen reader reads the whole phrase once.
- Titles that are already above the screen are revealed even without passing through it, and on the server a CSS fallback shows the title after 2.4 s if JavaScript is late, so the text is not left hidden.

## Motion

- `blur` raises each word as it comes out of a blur; `word` and `line` raise words or lines from inside a clip; `tracking` brings the letters closer to normal spacing; `wipe` uncovers the title through a soft edge.
- In the per-word variants, the whole sequence lasts at most about 0.4 s; opacity arrives first, blur next, and displacement last, so it is possible to read before it settles.
- It fires when 45% of the title is visible; with `once={false}`, it hides again quickly on leaving and animates again on return. With “reduce motion”, it appears finished, without animation.

## Performance

- The `tracking` variant creates one element per letter; in long titles, prefer `blur` or `line`.

## Notes for AI

- Import `InViewTitle` from `@/components/ryan-ui/in-view-title/in-view-title`; the text goes in `text` (not in children) and the heading level in `as`.
- In the `line` variant, pass `lines` with the breaks; without it, the whole title becomes a single line. The other variants break between words.
- The animation runs once by default; `once={false}` repeats on every entrance to the screen, and changing the `key` remounts the title and animates again, as in the demo.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/in-view-title · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
