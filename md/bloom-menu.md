# Bloom menu

> Botão flutuante cujas ações se abrem em arco, uma após a outra; Esc ou um clique fora fecha o menu.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/bloom-menu
- Original description: A floating button whose actions bloom outward along an arc with a staggered, slightly bouncy spring; Escape or a click outside folds them back.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bloom-menu.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bloom-menu.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bloom-menu.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bloom-menu.json`. Registry path, relative to the site address: `r/bloom-menu.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/blocks/bloom-menu/bloom-menu.tsx`
  - `components/ryan-ui/blocks/bloom-menu/bloom-menu.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/bloom-menu.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A floating create button with three to six quick actions, such as new note, task, photo, or audio, in a corner of the screen.
- Screens where a fixed toolbar would take space from the content, such as boards, maps, and capture lists on mobile.

## When not to use

- Use [`dropdown-menu`](dropdown-menu.md) when there are more than six actions or when each one needs always-visible text: here the names appear only on mouse hover or keyboard focus.
- Use [`expandable-action-bar`](expandable-action-bar.md) for actions on a selection, with labels and a secondary row.
- Use [`button`](button.md) when there is only one main action.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import BloomMenuPreview from "@/components/ryan-ui/blocks/bloom-menu/bloom-menu";

export default function BloomMenuDemo() {
  return <BloomMenuPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `BloomMenu`

A floating button whose actions bloom outward along an arc, one after another, and fold back in reverse. It is a real menu: arrow keys move between actions, Escape or a click outside closes it and focus returns to the button.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `actions` (required) | `BloomAction[]` | — | The actions, placed along the arc in order. Three to six read best. |
| `direction` | `"up" \| "up-left" \| "up-right" \| "left" \| "right" \| "down" \| "down-left" \| "down-right"` | `"up-left"` | Where the arc opens, seen from the button. Use a diagonal for a button in a corner. |
| `sweep` | `number` | — | Angle the actions spread over, in degrees. Defaults to 90 for diagonals and 150 for the four sides. |
| `radius` | `number` | `96` | Distance from the button to the actions, in px. It grows by itself when the actions would overlap. |
| `open` | `boolean` | — | Whether the menu is open (controlled). |
| `defaultOpen` | `boolean` | `false` | Whether the menu starts open (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the menu opens or closes. |
| `onAction` | `(id: string) => void` | — | Called with the action id when an action is chosen. The menu closes afterwards. |
| `label` | `string` | `"Quick actions"` | Accessible name of the floating button and of the menu. |
| `icon` | `ReactNode` | — | Icon of the floating button. It turns 135 degrees while the menu is open, so a plus becomes a close mark. |
| `className` | `string` | — | Extra class for the root. |

### `BloomMenuPreview`

Ready preview: a capture board. Each action adds a card.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `BloomDirection` | `"up" \| "up-left" \| "up-right" \| "left" \| "right" \| "down" \| "down-left" \| "down-right"` |

#### `BloomAction`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable key; also passed to `onAction`. |
| `label` (required) | `string` | Name of the action: the button's accessible name and the label shown on hover and focus. |
| `icon` (required) | `ReactNode` | Icon inside the round button. |
| `disabled` | `boolean` | A disabled action stays in the arc but cannot be used. |
| `onSelect` | `() => void` | Runs when the action is chosen. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the floating button, open or close the menu (when opened by keyboard, focus goes to the first action); on an action, run it, close the menu, and return focus to the button. |
| `↓` or `→` | With the menu open, focus the next action and wrap around at the end; with it closed, `↓` or `↑` on the button opens the menu and focuses the first action. |
| `↑` or `←` | With the menu open, focus the previous action; disabled actions are skipped. |
| `Home` or `End` | Focus the first or last action. |
| `Esc` | Closes the menu and returns focus to the button. |
| `Tab` | Closes the menu and lets focus follow the normal tab order. |

## Accessibility

- The button exposes `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`; the actions sit in a `role="menu"` as `menuitem`, outside the Tab order, with focus moved by the arrow keys.
- `label` names the button and the menu for the screen reader, and each action's `label` is its accessible name: write both so they say what the action does.
- Esc and choosing an action return focus to the button; clicking outside closes the menu without touching focus.

## Motion

- The actions leave the center of the button for their places on the arc, one after another, with a slightly elastic spring that overshoots the point a little; on close, they return to the center in reverse order.
- The button icon rotates 135° (the plus becomes an x) and a ring expands from it when the menu opens.
- With “reduce motion” on, the actions still leave the center, but with a short shift (0.16 s) with no spring or scale; on close they only fade in place, the icon rotates instantly, and the ring does not appear.

## Responsive behavior

- There is no collision detection: the arc always opens in `direction` and is positioned by transform, so it can go off screen or be clipped by a parent with `overflow: hidden`.
- The radius grows on its own to keep 58px between neighboring actions: with many actions on a 90° arc, the menu takes up well over the 96px of `radius`.

## Notes for AI

- Import `BloomMenu` by name: the file's default export is the preview (a capture board), not the component.
- The component does not pin itself to the screen: position it with a container (for example, `position: fixed` in the corner) and point `direction` toward the inside of the screen, using the diagonals in the corners.
- Each action has `id`, `label`, and `icon`; handle the choice in `onAction(id)` or in the action's `onSelect`, and use `open` with `onOpenChange` only if you need to control opening.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/bloom-menu · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
