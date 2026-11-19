# Context menu

> Ações secundárias ao alcance do clique direito, junto do objeto selecionado.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/context-menu
- Original description: Secondary actions kept close to the selected object.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/context-menu.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/context-menu.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/context-menu.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/context-menu.json`. Registry path, relative to the site address: `r/context-menu.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/context-menu/context-menu.tsx`
  - `components/ryan-ui/context-menu/context-menu.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/context-menu.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Secondary actions on an object the person is already looking at, like a file, a card, or a project, opened with a right-click on the object itself.
- Surfaces that should not show a menu button, but whose actions must remain reachable by keyboard (`Shift + F10` or the menu key).

## When not to use

- Use [`dropdown-menu`](dropdown-menu.md) when the actions need a visible trigger or separators between groups; this menu is a flat list opened over the object.
- Avoid on objects that already respond to clicks, like links, cards that open, or selectable rows: a simple click or tap anywhere on the target also opens the menu.
- Use [`swipe-actions`](swipe-actions.md) when each list row's actions should appear with a swipe gesture on touch.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Copy, Download, FolderInput, Pencil, Pin, Trash2 } from "lucide-react";
import ContextMenu from "@/components/ryan-ui/context-menu/context-menu";
import { Caption, Room, Stack, Surface, demoStage } from "./_kit";

export default function ContextMenuDemo() {
  const [last, setLast] = useState("Nothing yet");
  const [pinned, setPinned] = useState(false);
  const act = (name: string) => () => setLast(name);
  return (
    <Stack gap={4} align="center" width={420}>
      <Room below={184} width={420}>
      <ContextMenu
        label="Q3 roadmap actions"
        defaultOpen
        container={demoStage()}
        items={[
          { id: "rename", label: "Rename", icon: <Pencil size={15} aria-hidden="true" />, onSelect: act("Rename") },
          { id: "copy", label: "Copy link", icon: <Copy size={15} aria-hidden="true" />, onSelect: act("Copy link") },
          { id: "pin", label: "Pin to top", icon: <Pin size={15} aria-hidden="true" />, checked: pinned, onSelect: () => { setPinned(value => !value); setLast(pinned ? "Unpinned" : "Pinned"); } },
          { id: "move", label: "Move to folder", icon: <FolderInput size={15} aria-hidden="true" />, onSelect: act("Move to folder") },
          { id: "download", label: "Download", icon: <Download size={15} aria-hidden="true" />, disabled: true },
          { id: "delete", label: "Delete", icon: <Trash2 size={15} aria-hidden="true" />, destructive: true, onSelect: act("Delete") },
        ]}
      >
        <Surface padding={8} style={{ textAlign: "center" }}>
          <strong style={{ display: "block", fontSize: "var(--text-xl)" }}>Q3 roadmap.pdf</strong>
          <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>Right-click, or long-press on touch</span>
        </Surface>
      </ContextMenu>
      </Room>
      <Caption>Last choice: {last}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ContextMenu`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` | — | — |
| `items` (required) | `ContextMenuItem[]` | — | — |
| `label` | `string` | `"Context menu"` | — |
| `container` | `HTMLElement \| null` | — | Render the menu inside this element: it is placed and kept within that element instead of the viewport (used by the demo stages). |
| `defaultOpen` | `boolean \| { x: number; y: number }` | `false` | Starts with the menu open at a point inside the target, as if it had just been right-clicked. `x` and `y` are fractions of the target's size (default 0.62 and 0.58). Focus stays where it is until a person uses the menu. |

### Exported types

#### `ContextMenuItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `icon` | `ReactNode` | — |
| `onSelect` | `() => void` | — |
| `disabled` | `boolean` | — |
| `destructive` | `boolean` | — |
| `checked` | `boolean` | — |

### Other exports

- `contextMenuExampleItems` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Shift + F10` or `Menu` | With focus on the target, open the menu just below it, with focus on the first enabled item. |
| `↓` or `↑` | Move through the enabled items and wrap around at the ends. |
| `Home` or `End` | Go to the first and last enabled item. |
| `Enter` or `Space` | Select the focused item, close the menu, and return focus to the target. |
| `Esc` | With focus in the menu, closes it and returns focus to the target. |

## Accessibility

- The target is a `<div>` with `tabIndex=0`, `aria-haspopup="menu"`, `aria-expanded`, and `aria-label`; the menu is `role="menu"`, with `role="menuitem"` items, and gets the same `label` (default in English, “Context menu”).
- On open, focus goes to the first enabled item, but the menu does not trap focus: `Tab` leaves it without closing it and, with focus outside, `Esc` no longer closes it (only a tap outside or scrolling).
- `checked` does not become `aria-checked` and only draws a checkmark when the item has no `icon`; the state does not reach the screen reader.

## Motion

- The menu grows from the click point (the origin stays at the pointer even when the menu is pushed into the screen) on a short spring, and leaves fading faster than it entered.
- Items enter in sequence, 35 ms apart, and a single highlight slides between rows under the pointer; with the keyboard, it jumps straight to the focused item.
- With “reduce motion”, the menu only fades, items appear with no sequence, and the highlight does not slide.

## Responsive behavior

- The menu uses `position: fixed` and is pushed to stay 8 px from the window edges; above 300 px in height (or the screen height) it scrolls inside, and long labels end in an ellipsis.
- It closes when the page scrolls or the window is resized, instead of following the target.

## Notes for AI

- Wrap the object: `<ContextMenu label="Ações do arquivo" items={itens}>…</ContextMenu>`; the target becomes a block `<div>`, and each item needs `id` and `label`, with the action in `onSelect`.
- Give every item an `icon`: without one an ellipsis icon appears, and `checked` only swaps that icon for a checkmark; `destructive` paints the item with the danger color.
- Do not put links or buttons inside the target expecting them to work on their own: the click on them bubbles up to the target and also opens the menu.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/context-menu · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
