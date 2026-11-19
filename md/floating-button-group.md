# Floating button group

> Botões soltos numa bandeja discreta, com um realce único que passa de um para o outro.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/floating-button-group
- Original description: Separate soft buttons in a quiet tray, with one shared highlight that morphs from button to button as you move, and a pressed state that settles in place.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/floating-button-group.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/floating-button-group.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/floating-button-group.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/floating-button-group.json`. Registry path, relative to the site address: `r/floating-button-group.json`.

- npm packages: `@radix-ui/react-tooltip`, `motion`
- Uses other ryan-ui items (installed along with it): [Tooltip](tooltip.md)
- Files, once installed:
  - `components/ryan-ui/floating-button-group/floating-button-group.tsx`
  - `components/ryan-ui/floating-button-group/floating-button-group.module.css`
  - `components/ryan-ui/tooltip/tooltip.tsx`
  - `components/ryan-ui/tooltip/tooltip.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-tooltip motion`.
2. Copy the files listed above. The content of each one is in `r/floating-button-group.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Action bars over a board or document, like Undo, Redo, Present, and Share, with shortcut hints in the tooltip.
- Floating bars over a selection or over the content (`variant="floating"`), with icons only and the name in a tooltip.

## When not to use

- Use [`button-group`](button-group.md) when the actions should form a single surface with dividers or need an attached menu.
- Use [`toggle-group`](toggle-group.md) when the buttons are options that turn on and off together, like bold and italic.
- Use [`overflow-actions`](overflow-actions.md) when the bar needs to fit varying widths: this tray does not collapse or wrap.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Copy, Presentation, Redo2, Share2, Trash2, Undo2 } from "lucide-react";
import FloatingButtonGroup from "@/components/ryan-ui/floating-button-group/floating-button-group";
import { Caption, Stack } from "./_kit";

export default function FloatingButtonGroupDemo() {
  const [present, setPresent] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");
  const [last, setLast] = useState("None yet");
  return (
    <Stack gap={6} align="center">
      <FloatingButtonGroup
        label="Board actions"
        onAction={id => setLast(id)}
        items={[
          { id: "undo", label: "Undo", icon: <Undo2 size={15} aria-hidden="true" />, shortcut: "⌘Z" },
          { id: "redo", label: "Redo", icon: <Redo2 size={15} aria-hidden="true" />, shortcut: "⇧⌘Z" },
          { type: "separator" },
          { id: "present", label: "Present", icon: <Presentation size={15} aria-hidden="true" />, pressed: present, onSelect: () => setPresent(value => !value) },
          { id: "share", label: shareLabel, reserveLabels: ["Share", "Copied"], icon: <Share2 size={15} aria-hidden="true" />, onSelect: () => { setShareLabel("Copied"); window.setTimeout(() => setShareLabel("Share"), 1500); } },
        ]}
      />
      <FloatingButtonGroup
        label="Selection actions"
        variant="floating"
        iconOnly
        onAction={id => setLast(id)}
        items={[
          { id: "duplicate", label: "Duplicate", icon: <Copy size={15} aria-hidden="true" /> },
          { id: "share-selection", label: "Share", icon: <Share2 size={15} aria-hidden="true" /> },
          { id: "delete", label: "Delete", icon: <Trash2 size={15} aria-hidden="true" /> },
        ]}
      />
      <Caption>Present mode: {present ? "on" : "off"} · last action: {last}. Move across the tray to follow the highlight.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `FloatingButtonGroup`

Separate soft buttons in a quiet tray. One shared highlight morphs, in position and size, to whichever button the pointer or keyboard focus is on, fades when the pointer leaves the tray, and settles darker in place while a button is pressed. It is the toolbar's only hover and focus indicator. Arrow keys move focus, Home and End jump to the ends, Enter and Space act.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `readonly FloatingButtonGroupItem[]` | — | — |
| `label` (required) | `string` | — | Accessible name of the toolbar, such as "Board actions". |
| `variant` | `"muted" \| "floating"` | `"muted"` | muted sits quietly on a page; floating raises the tray with the floating shadow for overlays such as a selection toolbar. |
| `size` | `"sm" \| "md"` | `"md"` | — |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | — |
| `iconOnly` | `boolean` | `false` | Shows every item as an icon only, with its label in a tooltip. Items with their own iconOnly win. |
| `tooltipSide` | `"top" \| "bottom" \| "left" \| "right"` | — | Side of the item tooltips. Defaults to top for a row and right for a column. |
| `onAction` | `(id: string) => void` | — | Called with the item id after the item's own onSelect. |
| `className` | `string` | — | — |
| `style` | `CSSProperties` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `FloatingButtonGroupVariant` | `"muted" \| "floating"` |
| `FloatingButtonGroupSize` | `"sm" \| "md"` |
| `FloatingButtonGroupOrientation` | `"horizontal" \| "vertical"` |
| `FloatingButtonGroupItem` | `FloatingButtonGroupAction \| FloatingButtonGroupSeparator` |

#### `FloatingButtonGroupAction`

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"action"` | — |
| `id` (required) | `string` | Stable key, also passed to onAction. |
| `label` (required) | `string` | Visible label, and the accessible name when the item shows only its icon. |
| `icon` | `ReactNode` | — |
| `iconOnly` | `boolean` | Shows only the icon. The label moves into a tooltip and the accessible name. Overrides the group's iconOnly. |
| `onSelect` | `() => void` | — |
| `disabled` | `boolean` | — |
| `pressed` | `boolean` | Marks an action that switches a mode on, such as Present. Sets aria-pressed and keeps a quiet tint while on. |
| `shortcut` | `string` | A shortcut hint shown in the tooltip, such as "⌘Z". The component does not bind the key. |
| `reserveLabels` | `readonly string[]` | Other labels this item can switch to, such as ["Copied"] for Share. The button keeps the width of the widest, so a label change never moves anything. |

#### `FloatingButtonGroupSeparator`

| Field | Type | Description |
| --- | --- | --- |
| `type` (required) | `"separator"` | — |
| `id` | `string` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Enters and leaves the bar in a single stop; focus returns to the last focused action. |
| `→` or `←` | Move focus between enabled actions and wrap around at the ends; in the `vertical` orientation, use `↓` and `↑`. |
| `Home` or `End` | Go to the first and last enabled action. |
| `Enter` or `Space` | Run the focused action; the highlight darkens while the key is held down. |
| `Esc` | Closes the open tooltip (Radix behavior). |

## Accessibility

- The tray is `role="toolbar"` with `aria-orientation` and a roving tabindex; each button has an `aria-label` equal to `label`, and `pressed` becomes `aria-pressed` for mode actions, like Present.
- Icon-only items or items with `shortcut` get a tooltip with the name and shortcut, on mouse hover or keyboard focus; `shortcut` is only a hint, the component does not register the key.
- `disabled` items get `aria-disabled` and are skipped by the arrows, by `Home`, and by `End`.

## Motion

- A single highlight moves and resizes to the button under the pointer or in focus, on a spring with no overshoot; coming from nothing, it appears in place growing from 0.94, and fades when the pointer leaves.
- On press, the highlight darkens and shrinks to 0.965 in place; a new label, like Share → Copied, rises from a slight blur without changing the width if it is in `reserveLabels`.
- With “reduce motion”, the highlight jumps to the button with no scale and colors change almost instantly.

## Responsive behavior

- The tray always keeps its natural size: it does not wrap or clip buttons, so on a narrow screen it overflows; use `iconOnly` or fewer items.
- In the `vertical` orientation, tooltips open to the right by default (`tooltipSide`), so they do not cover the neighboring button.

## Notes for AI

- Depends on `tooltip`, installed alongside; each action needs `id` and `label`, and an item `{ type: "separator" }` draws a divider.
- For mode actions, pass `pressed` controlled by the parent and toggle it in `onSelect`; `onAction(id)` runs after the item's `onSelect`, good for logging usage.
- If a label changes after the click, list all the texts in `reserveLabels`; `iconOnly` on the group applies to all items, and each item's `iconOnly` takes priority.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/floating-button-group · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
