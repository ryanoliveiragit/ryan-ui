# Reactions

> Reage a uma publicação com um toque, com contadores que rolam.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/reactions
- Original description: Acknowledge a post in one tap, with counts that roll.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/reactions.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/reactions.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/reactions.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/reactions.json`. Registry path, relative to the site address: `r/reactions.json`.

- npm packages: `@radix-ui/react-popover`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/reactions/reactions.tsx`
  - `components/ryan-ui/reactions/reactions.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-popover lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/reactions.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Quick acknowledgment of a post, comment, or release note, with the count of each reaction and your own highlighted.
- When the set of possible reactions is fixed and short (`options`) and only those that already have votes should appear in the bar.

## When not to use

- Use [`comment-thread`](comment-thread.md) when the person needs to reply with text, not just react.
- Use [`icon-morph`](icon-morph.md) with `name="heart"` inside your own button when there is a single like reaction, with no count per type.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { Flame, Heart, PartyPopper, Rocket, ThumbsUp, Laugh } from "lucide-react";
import Reactions from "@/components/ryan-ui/reactions/reactions";
import { Caption, Room, Surface, demoStage, useQuietFirstOpen } from "./_kit";

const options = [
  { id: "like", label: "Like", icon: ThumbsUp },
  { id: "love", label: "Love", icon: Heart },
  { id: "celebrate", label: "Celebrate", icon: PartyPopper },
  { id: "funny", label: "Funny", icon: Laugh },
  { id: "fire", label: "Fire", icon: Flame },
  { id: "launch", label: "Launch", icon: Rocket },
];

export default function ReactionsDemo() {
  // The picker is already open over the bar, inside the stage, so the full set of reactions shows.
  const quiet = useQuietFirstOpen();
  return (
    <Room above={64} width={440}>
      <Surface padding={5} style={{ display: "grid", gap: "var(--space-4)" }}>
        <div>
          <strong style={{ display: "block" }}>v2.0 is live</strong>
          <span style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>Dark mode, faster builds, and 40 new components. Thanks to everyone who tested the beta.</span>
        </div>
        <Reactions
          label="Reactions to the v2.0 announcement"
          defaultOpen
          onOpenAutoFocus={quiet}
          container={demoStage()}
          options={options}
          defaultValue={[
            { id: "celebrate", count: 24, reacted: false },
            { id: "love", count: 11, reacted: true },
            { id: "launch", count: 7, reacted: false },
          ]}
        />
      </Surface>
      <Caption>Tap a pill to add or remove your reaction, or open the picker for more.</Caption>
    </Room>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Reactions`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` (required) | `ReactionOption[]` | — | Every reaction the picker offers, in picker order. |
| `value` | `Reaction[]` | — | Controlled reactions. Pills keep this order, and a reaction whose count reaches zero leaves the bar. |
| `defaultValue` | `Reaction[]` | `[]` | — |
| `onValueChange` | `(next: Reaction[], change: { id: string; reacted: boolean }) => void` | — | Called with the next reactions and the change that produced them. |
| `label` | `string` | `"Reactions"` | Accessible name for the bar. |
| `open` | `boolean` | — | Picker open state; omit it to let the bar manage its own open/closed state. |
| `onOpenChange` | `(open: boolean) => void` | — | — |
| `defaultOpen` | `boolean` | `false` | Starts with the picker open (uncontrolled). |
| `container` | `HTMLElement \| null` | — | Render the picker inside this element and limit collisions to it (used by the demo stages). |
| `onOpenAutoFocus` | `(event: Event) => void` | — | Called before the picker moves focus in on open; call event.preventDefault() to keep focus where it is (for a picker that starts open). |
| `className` | `string` | — | — |

### Exported types

#### `ReactionOption`

A reaction bar for comments, posts, and release notes. Each pill shows one reaction and how many people chose it; the viewer's own reactions carry the accent. Tapping a pill adds or removes the viewer's reaction, and the add button opens a compact picker that grows from it. Use it for quick acknowledgement; when people need to say something specific, give them a reply field instead.

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `icon` (required) | `LucideIcon` | — |

#### `Reaction`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `count` (required) | `number` | — |
| `reacted` (required) | `boolean` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On a pill, add or remove your reaction; on the add button, open the picker with focus on the first option. |
| `→` or `←` | In the picker, move focus between options and wrap around at the ends; `↓` and `↑` do the same. |
| `Home` or `End` | In the picker, go to the first and last option. |
| `Esc` | Closes the picker and returns focus to the add button; choosing an option with `Enter` or `Space` does the same and applies the reaction. |

## Accessibility

- The bar is `role="group"` with `label` as its name; each pill is a button with `aria-pressed` and a name with the reaction and the count, like “Love, 11 reactions, including yours”.
- The add button opens a Radix dialog with a `role="toolbar"` bar of options on a roving tabindex; each change is announced in a `role="status"`, and if the focused pill disappears, focus moves to its neighbor.
- Names and announcements are built in English in the code (“reactions”, “including yours”, “Add reaction”, “Added …”); in a Portuguese interface, translate those strings in the installed file and pass `label`.

## Motion

- The count digits roll in the direction of the change, up when it increases and down when it decreases, and only the ones that change move; on reacting, the icon gets a spring impulse in scale and rotation.
- New pills appear at half scale out of a blur, the others slide to make room, and the bar height follows on a spring when wrapping; the picker grows from the button, with the options in sequence.
- With “reduce motion”, numbers swap without rolling, the icon does not hop, pills only fade, and the picker appears without growing.

## Responsive behavior

- Pills wrap according to the width, and the bar height changes on a spring instead of pushing the content below all at once; the picker opens above the button and stays 12 px from the window edges.

## Notes for AI

- In `options`, `icon` is the Lucide component (`ThumbsUp`), not an element (`<ThumbsUp />`); each reaction in `value` or `defaultValue` is `{ id, count, reacted }`.
- When controlled, keep the list that arrives in `onValueChange(next, change)` and return it in `value`; pills follow the list order, and a reaction with `count` 0 leaves the bar.
- The bar only counts: it does not know who reacted nor talk to the server; send `change` (`id` and `reacted`) to your API.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/reactions · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
