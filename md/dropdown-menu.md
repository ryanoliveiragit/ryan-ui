# Dropdown menu

> Lista enxuta de ações ancorada a um botão.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/dropdown-menu
- Original description: A focused list of actions anchored to a trigger.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dropdown-menu.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dropdown-menu.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dropdown-menu.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dropdown-menu.json`. Registry path, relative to the site address: `r/dropdown-menu.json`.

- npm packages: `@radix-ui/react-dropdown-menu`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/dropdown-menu/dropdown-menu.tsx`
  - `components/ryan-ui/dropdown-menu/dropdown-menu.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-dropdown-menu lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/dropdown-menu.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A short set of actions on the page or an object, behind a labeled button, like “Project actions”.
- Choices like “Sort by”, where the trigger itself shows the current option: change `label` and the new text enters animated, with the trigger width following on a spring.

## When not to use

- Use [`select`](select.md) when the choice is a form value with the option marked: here the items are actions, with no selected state.
- Use [`split-button`](split-button.md) when a main action should run on a click and the others are alternatives to it.
- Use [`context-menu`](context-menu.md) for actions opened with a right-click on the object itself, with no visible trigger.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Copy, Pencil, Share2, Trash2, Archive } from "lucide-react";
import DropdownMenu from "@/components/ryan-ui/dropdown-menu/dropdown-menu";
import { Caption, Room, Row, Stack, demoStage, useQuietFirstOpen } from "./_kit";

export default function DropdownMenuDemo() {
  const [last, setLast] = useState("Nothing yet");
  const act = (name: string) => () => setLast(name);
  // The first menu is already open, inside the stage. Non-modal, so the docs page keeps scrolling while it shows.
  const stage = demoStage();
  const quiet = useQuietFirstOpen();
  return (
    <Stack gap={4} align="center">
      <Room below={206}>
      <Row justify="center">
        <DropdownMenu
          label="Project actions"
          defaultOpen
          modal={false}
          onOpenAutoFocus={quiet}
          container={stage}
          items={[
            { label: "Rename", icon: <Pencil size={15} aria-hidden="true" />, onSelect: act("Rename") },
            { label: "Duplicate", icon: <Copy size={15} aria-hidden="true" />, onSelect: act("Duplicate") },
            { label: "Share", icon: <Share2 size={15} aria-hidden="true" />, onSelect: act("Share") },
            { label: "Archive", icon: <Archive size={15} aria-hidden="true" />, disabled: true },
            { label: "Delete project", icon: <Trash2 size={15} aria-hidden="true" />, destructive: true, separatorBefore: true, onSelect: act("Delete project") },
          ]}
        />
        <DropdownMenu
          label="Sort by"
          container={stage}
          items={[
            { label: "Most recent", onSelect: act("Most recent") },
            { label: "Name", onSelect: act("Name") },
            { label: "Size", onSelect: act("Size") },
          ]}
        />
      </Row>
      </Room>
      <Caption>Last choice: {last}. Arrow keys move, Escape closes.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `DropdownMenu`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `items` (required) | `DropdownItem[]` | — | — |
| `icon` | `ReactNode` | — | — |
| `defaultOpen` | `boolean` | — | — |
| `container` | `HTMLElement \| null` | — | — |
| `modal` | `boolean` | `true` | — |
| `onOpenAutoFocus` | `(event: Event) => void` | — | — |

### Exported types

#### `DropdownItem`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `onSelect` | `() => void` | — |
| `disabled` | `boolean` | — |
| `icon` | `ReactNode` | — |
| `destructive` | `boolean` | — |
| `separatorBefore` | `boolean` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` or `↓` | On the trigger, open the menu with focus on the first item. |
| `↓` or `↑` | Move through the enabled items and wrap around at the ends. |
| `Home` or `End` | Go to the first and last item; `Page Up` and `Page Down` do the same. |
| `A–Z` | Typing the start of a label moves focus to that item. |
| `Enter` or `Space` | Select the focused item and close the menu. |
| `Esc` | Closes the menu and returns focus to the trigger. |

## Accessibility

- Uses Radix's `DropdownMenu`: the trigger gets `aria-haspopup`, `aria-expanded`, and `aria-controls`, items are `role="menuitem"`, and `disabled` items are dimmed and skipped by the arrows.
- The menu is modal: while open, focus is trapped in it, the page does not scroll, the rest is hidden from screen readers, and a click outside only closes the menu.
- The trigger always shows the `label` text, which also names the menu; the icons on the trigger and items are decorative.

## Motion

- The menu appears offset 5 px toward the trigger and at 0.97 scale, via a CSS transition, and leaves faster than it entered; items enter in sequence, 35 ms apart.
- A single highlight slides between items on a spring under the pointer and jumps straight with the arrows; the trigger arrow rotates 180° with the menu open.
- With “reduce motion”, the menu only fades, items appear together, and the highlight, the arrow, and the trigger label swap with no animation.

## Responsive behavior

- The menu is aligned to the end of the trigger, stays 12 px from the window edges, flips sides if there is not enough room, and never exceeds the available width; the trigger label ends in an ellipsis when space runs out.

## Notes for AI

- Pass `label` and `items` (each with `label`, `onSelect`, and, if you want, `icon`, `disabled`, `destructive`, and `separatorBefore`); the item's `label` is also the React key, so do not repeat labels.
- The trigger is fixed (`label` text, optional `icon`, and an arrow) and the open state is internal: there is no prop for another trigger, for an icon-only button, or to control `open`.
- Items show no selection mark; for a value selector, prefer `select`, or show the current choice in the `label` itself.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/dropdown-menu · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
