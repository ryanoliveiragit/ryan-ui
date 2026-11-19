# Expandable action bar

> Barra de ações flutuante que cresce de uma pílula compacta para uma grade com todas as ações e uma linha secundária.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/expandable-action-bar
- Original description: Floating action bar that grows upward from a compact pill into a labeled grid of every action plus a secondary row, with the icons gliding to their new places.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-action-bar.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-action-bar.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-action-bar.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-action-bar.json`. Registry path, relative to the site address: `r/expandable-action-bar.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/blocks/expandable-action-bar/expandable-action-bar.tsx`
  - `components/ryan-ui/blocks/expandable-action-bar/expandable-action-bar.module.css`
  - `components/ryan-ui/lib/media.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/expandable-action-bar.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A floating bulk-action bar over a selection (files, photos, rows), with the three or four main actions always at hand and the rest a tap away.
- Mobile screens or narrow panels, where the compact pill fits over the content and opens into a labeled grid only when requested.

## When not to use

- Use [`overflow-actions`](overflow-actions.md) for a fixed bar that moves to a “more” menu only the actions that do not fit the width.
- Use [`bloom-menu`](bloom-menu.md) to create new items from a floating button, without a selection.
- Use [`dropdown-menu`](dropdown-menu.md) when the action list is long or has submenus.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import ExpandableActionBarPreview from "@/components/ryan-ui/blocks/expandable-action-bar/expandable-action-bar";
import type { DemoStage } from "./_kit";

// Taller than the default so the expanded bar opens below the board instead of over its second row.
export const stage: DemoStage = { height: 720 };

export default function ExpandableActionBarDemo() {
  return <ExpandableActionBarPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ExpandableActionBar`

Floating action bar: a compact pill of the main actions that grows upward into a labeled grid of every action plus a secondary row, with the icons gliding to their new places.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Short text at the start of the bar, such as "3 selected". It crossfades when it changes. |
| `actions` | `BarAction[]` | `sampleActions` | Every action, in order. Defaults to sample file actions. |
| `shortcuts` | `BarShortcut[]` | `sampleShortcuts` | Chips of the secondary row, shown when the bar is expanded. Leave empty to drop the row. |
| `shortcutsLabel` | `string` | `"Move to"` | Text before the secondary row's chips. |
| `expanded` | `boolean` | — | Whether the bar is expanded. Pass it with `onExpandedChange` to control it. |
| `defaultExpanded` | `boolean` | `false` | Whether the bar starts expanded when uncontrolled. |
| `onExpandedChange` | `(expanded: boolean) => void` | — | Called when the toggle or Escape expands or collapses the bar. |
| `onAction` | `(id: string) => void` | — | Called with the id of the action that was pressed. |
| `onShortcut` | `(id: string) => void` | — | Called with the id of the secondary chip that was pressed. |
| `width` | `number` | `416` | Widest the expanded bar gets, in px. It never grows past the space the component is given. |
| `className` | `string` | — | Extra class for the root box. |

### `ExpandableActionBarPreview`

Ready preview: select files on a board and act on them from the bar that floats over its bottom edge.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

#### `BarAction`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique id, passed to `onAction`. |
| `label` (required) | `string` | Visible name: the tile's text when expanded, the button's accessible name when compact. |
| `icon` (required) | `ReactNode` | Icon, about 18 px. |
| `primary` | `boolean` | Primary actions stay visible in the compact pill. Keep them to three or four. |
| `tone` | `"danger"` | `danger` tints a destructive action. |

#### `BarShortcut`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique id, passed to `onShortcut`. |
| `label` (required) | `string` | Text on the chip. |

### Other exports

- `sampleActions` (value)
- `sampleShortcuts` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | Move focus between all the bar's buttons, including the expand button and those of the secondary row, wrapping around. |
| `Home` or `End` | Focus the first or last button of the bar. |
| `Esc` | With the bar expanded, collapses it and returns focus to the expand button. |
| `Enter` or `Space` | Trigger the focused action, or expand and collapse the bar on the arrow button. |

## Accessibility

- The bar is a horizontal `role="toolbar"` with the fixed name “Actions”, and the expand button has `aria-expanded` and the name “Show all actions” or “Show fewer actions”.
- In the compact form, each button gets `aria-label` and `title` with the action's `label`; when expanded, the visible text becomes the name. The secondary row is a `group` named by `shortcutsLabel`.
- All buttons are in the Tab order (there is no roving focus); the arrow keys are an extra shortcut for moving through them.

## Motion

- The bar is a window that changes width and height on a spring with a slight bounce, growing upward from the pill, while the icons that were already there slide to their new place.
- The extra icons appear in a cascade, the labels rise right after, and the arrow rotates 180°; when `label` changes, the new text enters from below and the old one exits above.
- With “reduce motion” on, the bar takes the new size instantly and icons and labels just appear, with no slide or cascade.

## Responsive behavior

- The expanded width is `width` (416px by default), limited to the container's space; the secondary row scrolls horizontally, with a faded end edge indicating there is more.

## Performance

- A `ResizeObserver` follows the container and the content, and only a new target size triggers the spring, so resizing the window does not restart the animation on every frame.

## Notes for AI

- Import `ExpandableActionBar` by name (the default export is the preview with the file board) and mark the compact pill's three or four actions with `primary: true`.
- The component takes the parent's width and anchors to its bottom edge: position the parent (for example, `position: absolute` at the footer) and show the bar only when there is a selection.
- Handle clicks in `onAction(id)` and `onShortcut(id)`; `label` (such as “3 selected”) is the text that swaps with animation, and `shortcuts={[]}` removes the secondary row.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/expandable-action-bar · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
