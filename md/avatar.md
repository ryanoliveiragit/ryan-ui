# Avatar

> Foto ou iniciais de uma pessoa, em vários tamanhos e com indicador de presença.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/avatar
- Original description: A compact identity marker for people and accounts.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/avatar.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/avatar.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/avatar.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/avatar.json`. Registry path, relative to the site address: `r/avatar.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/avatar/avatar.tsx`
  - `components/ryan-ui/avatar/avatar.module.css`
  - `components/ryan-ui/lib/ryan-provider.tsx`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/avatar.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Identify a person or account next to the name, in a comment, a list row, or the header.
- Show presence with `status` (`online` or `offline`), as a dot at the corner of the avatar.
- Lists where not everyone has a photo: without `src`, or if the image fails, the initials of `name` appear.

## When not to use

- Use [`avatar-group`](avatar-group.md) for several people stacked in a small space.
- Use [`user-menu`](user-menu.md) when the avatar opens the account menu.
- For logos and images that do not represent someone, use a regular image: the crop is always circular and the fallback to the photo is a name's initials.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Avatar } from "@/components/ryan-ui/avatar/avatar";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack } from "./_kit";
import { avatar } from "@/components/ryan-ui/lib/media";

export default function AvatarDemo() {
  const [online, setOnline] = useState(true);
  return (
    <Stack gap={6} align="center">
      <Row gap={5} justify="center">
        <Avatar name="Emma Collins" src={avatar("emma-collins")} size="sm" />
        <Avatar name="Emma Collins" src={avatar("emma-collins")} size="md" />
        <Avatar name="Emma Collins" src={avatar("emma-collins")} size="lg" />
        <Avatar name="Emma Collins" src={avatar("emma-collins")} size="xl" status={online ? "online" : "offline"} />
      </Row>
      <Row gap={4} justify="center">
        <Avatar name="Marcus Johnson" size="lg" />
        <Avatar name="Sofia Ramirez" size="lg" status="online" />
        <Button size="sm" variant="secondary" onClick={() => setOnline(o => !o)}>Go {online ? "offline" : "online"}</Button>
      </Row>
      <Caption>Without a photo, initials take over.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Avatar`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` | — | — |
| `src` | `string` | — | — |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | — |
| `status` | `"online" \| "offline"` | — | — |
| `...props` | `HTMLAttributes<HTMLSpanElement>` | — | Also accepts the props of this type. |

## Accessibility

- The `span` gets `role="img"` and `aria-label` with `name` and, if present, the status; the photo has an empty `alt` and the initials are `aria-hidden`.
- `role` and `aria-label` passed through props are overwritten; when the name already appears as text next to it, pass `aria-hidden` so the screen reader does not repeat it.
- The status goes into the label in English (“online”, “offline”) and, on screen, is just a colored dot.

## Motion

- A photo still loading emerges from a slight blur; one already cached appears immediately, and the fallback initials enter with a fade.
- The status dot appears and swaps with a small spring scale; with “reduce motion”, photo, initials, and dot change without transition.

## Responsive behavior

- Sizes are fixed in pixels (`sm` 28, `md` 36, `lg` 48, `xl` 88) and the avatar does not shrink inside a flex row.

## Performance

- The photo goes through the image component from `RyanProvider`: by default an `<img>` with `loading="lazy"`; with `next/image` it receives `fill` and the `sizes` of the chosen size.

## Notes for AI

- `name` is required even with a photo: the accessible label and the initials (first letter of the first two words) come from it.
- It is not interactive and does not receive focus: for a clickable avatar, wrap it in a `button` or link with its own name, or use `user-menu`.
- The export is named, with no default: `import { Avatar } from "@/components/ryan-ui/avatar/avatar"`; extra props go to the root `span`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/avatar · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
