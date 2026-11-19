# Card

> Cartão com imagem, autor e ação que cresce em uma visão rápida ao ser aberto.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/card
- Original description: A contained group of related content and actions.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card.json`. Registry path, relative to the site address: `r/card.json`.

- npm packages: `@radix-ui/react-dialog`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/card/card.tsx`
  - `components/ryan-ui/card/card.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-dialog lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/card.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Group a title, short description, media, and one or two actions about the same object (a project, an itinerary, an article) in a grid or list.
- A summary that opens a larger quick look without leaving the page: with `details`, the whole card becomes the trigger and grows into a central panel.
- A footer with the owner and a state that changes in place, such as “Updated just now”, announced to the screen reader.

## When not to use

- Use [`expandable-card`](expandable-card.md) when the extra content should open in place, within the page flow, and not in a dialog.
- Use [`metric-card`](metric-card.md) for a number with context and change.
- Use [`dialog`](dialog.md) for decisions and forms that do not start from a card: the quick look here is for reading more about the same item.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Card } from "@/components/ryan-ui/card/card";
import { Avatar } from "@/components/ryan-ui/avatar/avatar";
import { Button } from "@/components/ryan-ui/button/button";
import { avatar, photo } from "@/components/ryan-ui/lib/media";
import { Caption, Stack, demoStage } from "./_kit";
import type { DemoStage } from "./_kit";

const cover = photo("lisbon-bridge");

export const stage: DemoStage = { height: 680 };

export default function CardDemo() {
  // On the docs page the quick look grows inside the preview, so it opens whole and the page around it keeps scrolling.
  const [container] = useState(demoStage);
  const [status, setStatus] = useState("Updated 2 hours ago");
  return (
    <Stack gap={4} width={360}>
      <Card
        title="Lisbon in three days"
        description="Trams, tiled facades and the best pastries in town. A relaxed itinerary for first-time visitors."
        media={<img src={cover.src} alt={cover.alt} style={{ display: "block", width: "100%", aspectRatio: "16 / 10", objectFit: "cover" }} />}
        avatar={<Avatar name="Emma Collins" src={avatar("emma-collins")} size="sm" />}
        meta="Emma Collins"
        status={status}
        container={container}
        action={<Button size="sm" variant="secondary" onClick={e => { e.stopPropagation(); setStatus("Updated just now"); }}>Refresh</Button>}
        details={
          <div style={{ display: "grid", gap: "var(--space-3)", color: "var(--text-secondary)" }}>
            <p style={{ margin: 0 }}>Day one: Alfama and the old tram 28 route. Day two: Belém, then sunset at the Miradouro da Senhora do Monte. Day three: day trip to Sintra.</p>
            <p style={{ margin: 0 }}>Best time to go is April to June, when the city is warm but not crowded.</p>
          </div>
        }
      />
      <Caption>Click the card to open its quick look.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Card`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` | — | — |
| `description` | `string` | — | — |
| `media` | `ReactNode` | — | — |
| `action` | `ReactNode` | — | — |
| `avatar` | `ReactNode` | — | A small leading visual for the footer, such as the owner's avatar. |
| `meta` | `ReactNode` | — | Who the card belongs to, such as the owner's name. |
| `status` | `string` | — | A short status under the meta, such as "Updated 2 hours ago". Changed words rise in and are announced politely. |
| `details` | `ReactNode` | — | Content for a quick look. When set, the whole card opens and grows into a larger view; Escape or the close control morphs it back. |
| `open` | `boolean` | — | — |
| `defaultOpen` | `boolean` | `false` | — |
| `onOpenChange` | `(open: boolean) => void` | — | — |
| `container` | `HTMLElement \| null` | — | Opens the quick look inside this element instead of over the whole page: the dim covers only the element and the quick look centers in it. The element needs position: relative and overflow: hidden. The page around it stays usable while the quick look is open: nothing is scroll-locked or hidden from assistive technology, and Escape, the dim and the close control still close it. |
| `...props` | `HTMLAttributes<HTMLElement>` | — | Also accepts the props of this type. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | With `details`, stops on the title, which becomes a button; focus appears as a stronger card border. |
| `Enter` or `Space` | Open the quick look from the title. |
| `Esc` | Closes the quick look: the panel returns to the card's place and focus returns to the title. |
| `Tab` or `Shift + Tab` | With the quick look open, cycle only among the panel's controls. |

## Accessibility

- The card is an `article` with an `h3` title; the quick look is a Radix modal dialog (traps focus, closes with `Esc` or outside click, and returns focus) with the title as `h2` and the description linked by `aria-describedby`.
- With `details`, the title's click area covers the whole card and `action` sits on top; the title button has no outline of its own, only the card border changes on focus.
- `status` is a `role="status"` region, so each new text is announced; the close button has an English label (“Close quick look”), and the media `alt` is up to you.

## Motion

- Under the mouse pointer the card rises 2 px with a shadow and the media slowly zooms in to 4%.
- In the quick look, the surface, photo, title, description, and footer travel on a no-overshoot spring from the card to the central panel and return along the same path on closing; `details` enters after the panel has grown.
- With “reduce motion”, the card neither rises nor zooms the photo, the quick look only fades, and `status` swaps without animation.

## Responsive behavior

- The quick look panel is `min(100vw - var(--space-8), 30rem)` wide and at most the screen height minus the same margin, with internal scrolling.
- The card takes the parent's width; in a narrow footer, `meta` and `status` truncate with an ellipsis instead of going under `action`.

## Performance

- Each card with `details` mounts its own dialog and a size observer, and the quick look backdrop uses `backdrop-filter`; in long grids, pass `details` only where it is needed.

## Notes for AI

- `title` is required and is text; `media`, `avatar`, `meta`, `action`, `children`, and `details` are free slots, and `status` must be a string because it animates word by word.
- `open`, `defaultOpen`, and `onOpenChange` only apply with `details`; without it the card is static and the title does not become a button.
- With the quick look open, `media`, `children`, `avatar`, and `action` exist twice (in the card and in the panel): do not put a fixed `id` or local state inside them.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/card · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
