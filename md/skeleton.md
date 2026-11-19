# Skeleton

> Reserva o espaço enquanto o conteúdo carrega e some em transição suave quando ele chega.

- Type: component (category Feedback)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/skeleton
- Original description: Reserve space while content is still loading.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/skeleton.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/skeleton.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/skeleton.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/skeleton.json`. Registry path, relative to the site address: `r/skeleton.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/skeleton/skeleton.tsx`
  - `components/ryan-ui/skeleton/skeleton.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/skeleton.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Reserve the space of a comment, card, or block of text while the data arrives, so the page does not jump when it appears.
- Swap the placeholder for the real content in the same place: with children and `loading`, the skeleton fades into the content and the height follows with a spring.
- List items with a photo and text, such as comments or contacts (`avatar` and `lines`).

## When not to use

- Use [`loader`](loader.md) for a short action, such as saving, where there is no block of content to reserve.
- Use [`progress`](progress.md) when the wait has a known end and it is worth showing how much remains.
- For tables, charts, or layouts that do not look like lines of text, draw a custom skeleton: this one only makes an avatar and up to six lines.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Skeleton } from "@/components/ryan-ui/skeleton/skeleton";
import { Avatar } from "@/components/ryan-ui/avatar/avatar";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Stack, Surface } from "./_kit";
import { avatar } from "@/components/ryan-ui/lib/media";

export default function SkeletonDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <Stack gap={5} width={420}>
      <Surface>
        <Skeleton avatar lines={3} loading={loading} label="Loading comment">
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <Avatar name="Emma Collins" src={avatar("emma-collins")} />
            <div style={{ display: "grid", gap: "var(--space-1)" }}>
              <strong>Emma Collins</strong>
              <span style={{ color: "var(--text-secondary)" }}>The new onboarding flow cut our setup time in half. Support was quick, and the migration took one afternoon.</span>
            </div>
          </div>
        </Skeleton>
      </Surface>
      <Button variant="secondary" onClick={() => setLoading(l => !l)}>{loading ? "Finish loading" : "Load again"}</Button>
      <Caption>The placeholder crossfades into the real content.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Skeleton`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `"Loading content"` | — |
| `lines` | `number` | `3` | — |
| `avatar` | `boolean` | `false` | — |
| `className` | `string` | — | — |
| `children` | `ReactNode` | — | Content to reveal once loading finishes. With children, the placeholder crossfades into them. |
| `loading` | `boolean` | `true` | Keeps the placeholder visible while true. Only used together with children. |

## Accessibility

- The placeholder is `role="status"` with `aria-busy` and the name from `label` (default “Loading content”, in English); the blocks are `aria-hidden`. Say in `label` what is loading.
- With children, the container has `aria-busy` while `loading` is `true`, and the content only enters the DOM when the wait ends.

## Motion

- The blocks pulse their opacity in a wave, each one a little after the one above, and stop after about 20 s so they do not pulse forever.
- When `loading` becomes `false`, the skeleton fades, the content enters rising 4 px, and the height goes from the skeleton's size to the content's with a no-overshoot spring.
- With “reduce motion”, the pulse is turned off and the swap becomes a short fade, without animating the height.

## Notes for AI

- Import from `@/components/ryan-ui/skeleton/skeleton`. Two uses: standalone, as a placeholder, or wrapping the real content with `loading={isLoading}`, which handles the swap and the height.
- `lines` goes from 1 to 6 and `avatar` adds a circle on the left; choose a number of lines similar to the final content so the height changes little.
- `loading` only has an effect with children; without children, the component always shows the skeleton, so render it only during the wait.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/skeleton · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
