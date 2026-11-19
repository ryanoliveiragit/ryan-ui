# Empty state

> Estado vazio com título, explicação e uma ação para ajudar a pessoa a começar.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/empty-state
- Original description: A useful next step when there is nothing to show yet.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/empty-state.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/empty-state.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/empty-state.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/empty-state.json`. Registry path, relative to the site address: `r/empty-state.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/empty-state/empty-state.tsx`
  - `components/ryan-ui/empty-state/empty-state.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/empty-state.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A list, table, or search with nothing to show, with a short explanation and the next step (create, import, clear filters).
- First use of an area of the product, when no item exists yet.
- When the result of an action swaps the message in place: changing `title`, `description`, or `icon` transforms the content without remounting the block.

## When not to use

- Use [`empty-states`](empty-states.md) when you want the illustrated version, where shapes transform from one scene to another.
- Use [`skeleton`](skeleton.md) while content is still loading; an empty state is for when the response arrived and there are no items.
- Use [`alert`](alert.md) for errors and warnings the user needs to recover from.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { FolderOpen, Plus } from "lucide-react";
import { EmptyState } from "@/components/ryan-ui/empty-state/empty-state";
import { Button } from "@/components/ryan-ui/button/button";
import { Stack } from "./_kit";

export default function EmptyStateDemo() {
  const [count, setCount] = useState(0);
  return (
    <Stack width={460}>
      {count === 0 ? (
        <EmptyState
          icon={<FolderOpen size={24} aria-hidden="true" />}
          title="No projects yet"
          description="Projects keep your files, tasks and teammates in one place. Create your first to get started."
          action={<Button onClick={() => setCount(1)}><Plus size={16} aria-hidden="true" />New project</Button>}
        />
      ) : (
        <EmptyState
          title={`${count} project created`}
          description="Nice start. Invite a teammate or add your first task."
          action={<Button variant="secondary" onClick={() => setCount(0)}>Clear projects</Button>}
        />
      )}
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `EmptyState`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` | — | — |
| `description` (required) | `string` | — | — |
| `action` | `ReactNode` | — | — |
| `icon` | `ReactNode` | — | — |
| `className` | `string` | — | — |
| `label` | `string` | — | Optional accessible label for the state region. |

## Accessibility

- The root is a `<section>`; pass `label` to make it a named region, useful when the page has more than one empty state.
- The title is always an `<h3>`: check that this level fits the page's heading hierarchy.
- The icon is `aria-hidden` and, during a swap, so is the outgoing copy, so the screen reader doesn't read the old text along with the new.

## Motion

- On first appearance only the icon box enters, with a fade and a slight scale-up.
- When `title`, `description`, or the icon change, the new text rises out of a slight blur while the old one leaves, the icon cross-fades, and the block height follows a spring.
- With “reduced motion”, swaps become a quick fade and the height changes instantly.

## Responsive behavior

- It takes 100% of the parent's width, with vertical padding between `--space-8` and `--space-12` depending on screen width; the description is capped at 18rem and wraps in balanced lines.
- Actions wrap and stay centered when they don't fit side by side.

## Notes for AI

- `title` and `description` are required strings (they serve as the animation key); `action` accepts any node, usually a `button`, and `icon` replaces the default folder.
- To get the transition between states, keep the same `<EmptyState>` mounted and change the props; changing the `key` remounts the component and loses the effect.
- The icon only cross-fades when the icon component changes (from `Folder` to `Check`, for example); use 24 px icons, like the default.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/empty-state · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
