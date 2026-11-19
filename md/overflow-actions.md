# Overflow actions

> Barra de ações que mede a própria largura e guarda no menu “mais” o que não cabe, animando a cada ajuste.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/overflow-actions
- Original description: A toolbar that measures its width and moves the actions that do not fit into a "more" menu, with buttons that scale out and a menu button that glides into place.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/overflow-actions.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/overflow-actions.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/overflow-actions.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/overflow-actions.json`. Registry path, relative to the site address: `r/overflow-actions.json`.

- npm packages: `@radix-ui/react-dropdown-menu`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/blocks/overflow-actions/overflow-actions.tsx`
  - `components/ryan-ui/blocks/overflow-actions/overflow-actions.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-dropdown-menu lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/overflow-actions.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Toolbar whose width changes (resizable panels, narrow columns, small screens) and that has more actions than fit.
- When all actions must stay reachable: the ones that do not fit go into the “more” menu, starting with the last ones in the list.

## When not to use

- Use [`button-group`](button-group.md) when there are a few related actions that always fit.
- Use [`dropdown-menu`](dropdown-menu.md) when secondary actions can live in a menu from the start.
- Use [`toggle-group`](toggle-group.md) for formatting toggles that always fit and do not need a menu.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import OverflowActionsPreview from "@/components/ryan-ui/blocks/overflow-actions/overflow-actions";

export default function OverflowActionsDemo() {
  return <OverflowActionsPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `OverflowActions`

A toolbar that always fits. It measures every action once in a hidden row, then shows as many as the current width allows and moves the rest into a "more" menu. Buttons leave and return with a short scale, and the "more" button glides to its new place on a layout spring.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `actions` (required) | `OverflowAction[]` | — | Actions in priority order: the last ones move into the menu first. |
| `label` | `string` | `"Actions"` | Accessible name of the toolbar. |
| `moreLabel` | `string` | `"More actions"` | Accessible name of the "more" button. |
| `onAction` | `(id: string) => void` | — | Called with the action id whenever an action is used. |
| `onOverflowChange` | `(hiddenIds: string[]) => void` | — | Called when the set of actions that moved into the menu changes. |
| `className` | `string` | — | Extra class for the toolbar root. |

### `OverflowActionsPreview`

Ready preview: a small editor whose toolbar you can resize with the handle, the arrow keys or the width presets.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

#### `OverflowAction`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable key; also passed to `onAction`. |
| `label` (required) | `string` | Visible text in the bar and in the menu. |
| `icon` | `ReactNode` | Icon shown before the label. |
| `pressed` | `boolean` | Marks a toggle as on (`aria-pressed` in the bar, a check state in the menu). Leave undefined for plain actions. |
| `disabled` | `boolean` | Disabled actions stay in place but cannot be used. |
| `onSelect` | `() => void` | Runs when the action is used, from the bar or from the menu. |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `←` | Move focus between the visible actions and the “more” button, wrapping around at the ends and skipping disabled ones. |
| `Home` or `End` | Move focus to the first or last stop of the bar. |
| `Tab` | The bar has a single Tab stop; the arrow keys do the rest. |
| `Enter` or `Space` | Activate the focused action or open the “more” menu. |
| `↓` or `↑` | In the “more” menu, move between items; `↓` on the button also opens the menu. |
| `Esc` | Closes the menu and returns focus to the “more” button. |

## Accessibility

- The bar is a `role="toolbar"` with an `aria-label` coming from `label` and roving tabindex; actions with `pressed` expose `aria-pressed`.
- The “more” button receives `moreLabel` with the count in the `aria-label`, and in the menu an active action gets a dot with the text “On” for screen readers.
- The measuring row, with copies of all the actions, is `aria-hidden` and `inert`.

## Motion

- Actions that stop fitting shrink to 80% and fade, and the ones that return do the reverse; the “more” button slides to its new position on a layout spring.
- The number on the “more” button rolls vertically when the count changes, and the menu opens with the items in a 28 ms cascade.
- With “reduce motion” on, entries, exits, and shifts happen instantly and the menu animations are removed.

## Responsive behavior

- The width that counts is the component's own, which takes 100% of its parent: it measures all the actions in a hidden row and shows as many as fit, never wrapping to a new line.
- When no action fits, only the “more” button remains, with all of them inside the menu.

## Performance

- A `ResizeObserver` watches the root and the measuring row and recomputes on every change of width, label, or font; each action is rendered twice because of that copy.

## Notes for AI

- Import the named component `OverflowActions`; the default export is the preview of an editor with a resize handle.
- Order `actions` by priority, because the last ones go to the menu first, and give the container a real width (in flex, `min-width: 0`).
- `pressed` is controlled by you: keep the state and toggle it in `onSelect` or `onAction(id)`; `onOverflowChange(ids)` reports which actions are in the menu.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/overflow-actions · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
