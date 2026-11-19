# Expanding button group

> Grupo de botões de ícone em que o apontado cresce para mostrar o rótulo e os vizinhos abrem espaço.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/expanding-button-group
- Original description: Icon buttons in a compact group: the one you point at or focus grows to reveal its label while its neighbours slide aside, and an action confirms in place.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expanding-button-group.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expanding-button-group.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expanding-button-group.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expanding-button-group.json`. Registry path, relative to the site address: `r/expanding-button-group.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/expanding-button-group/expanding-button-group.tsx`
  - `components/ryan-ui/expanding-button-group/expanding-button-group.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/expanding-button-group.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Actions on a message or a list item where only one needs a visible name at a time: Reply, Archive, Flag, Delete.
- Quick actions that confirm on the button itself with a past-tense word, like Archive becoming Archived, with no toast.

## When not to use

- Use [`floating-button-group`](floating-button-group.md) or [`button-group`](button-group.md) when all labels should be visible at the same time.
- Use [`confirm-morph`](confirm-morph.md) or [`hold-to-confirm`](hold-to-confirm.md) for deletions that need confirmation: here `tone="danger"` only changes the color, and the action runs on click.
- Avoid on touch-only screens for urgent actions: with no hover, the first tap only reveals the label and a second one is needed to run it.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Archive, Flag, Reply, Trash2 } from "lucide-react";
import ExpandingButtonGroup from "@/components/ryan-ui/expanding-button-group/expanding-button-group";
import { Caption, Stack } from "./_kit";

export default function ExpandingButtonGroupDemo() {
  const [last, setLast] = useState("None yet");
  return (
    <Stack gap={6} align="center">
      <ExpandingButtonGroup
        label="Message actions"
        onAction={id => setLast(id)}
        items={[
          { id: "reply", label: "Reply", icon: <Reply size={16} aria-hidden="true" /> },
          { id: "archive", label: "Archive", doneLabel: "Archived", icon: <Archive size={16} aria-hidden="true" /> },
          { id: "flag", label: "Flag", doneLabel: "Flagged", icon: <Flag size={16} aria-hidden="true" /> },
          { id: "delete", label: "Delete", doneLabel: "Deleted", tone: "danger", icon: <Trash2 size={16} aria-hidden="true" /> },
        ]}
      />
      <ExpandingButtonGroup
        size="sm"
        label="Compact message actions"
        defaultExpanded="archive"
        items={[
          { id: "reply", label: "Reply", icon: <Reply size={14} aria-hidden="true" /> },
          { id: "archive", label: "Archive", doneLabel: "Archived", icon: <Archive size={14} aria-hidden="true" /> },
          { id: "flag", label: "Flag", doneLabel: "Flagged", icon: <Flag size={14} aria-hidden="true" /> },
        ]}
      />
      <Caption>Last action: {last}. Hover a button to expand it; press to confirm in place.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ExpandingButtonGroup`

A compact pill of icon buttons for actions. One action always shows its label; the one you point at or focus takes over the label while its neighbours slide aside, and an action can confirm in place: the icon draws a check and the label becomes a past tense word. On touch, the first tap reveals the label and a second tap runs the action.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `readonly ExpandingButtonGroupItem[]` | — | — |
| `label` (required) | `string` | — | Accessible name of the toolbar, such as "Message actions". |
| `size` | `"sm" \| "md"` | `"md"` | — |
| `defaultExpanded` | `string \| null` | `null` | Id of the action whose label shows at rest, usually the primary one. Defaults to the first enabled action: one action is always expanded. Pointing at or focusing another moves the expansion there, and it returns here when the pointer and focus leave. |
| `onAction` | `(id: string) => void` | — | Called with the item id whenever an action runs, before its own onSelect. |
| `confirmDuration` | `number` | `1400` | How long the confirmation stays, in milliseconds. |
| `className` | `string` | — | — |
| `style` | `CSSProperties` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `ExpandingButtonGroupSize` | `"sm" \| "md"` |
| `ExpandingButtonGroupTone` | `"neutral" \| "danger"` |

#### `ExpandingButtonGroupItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable key for the action. Also the value passed to onAction. |
| `label` (required) | `string` | Visible label once the button expands, and its accessible name at all times. Use a short verb, such as "Archive". |
| `icon` (required) | `ReactNode` | Icon shown while collapsed. A 16px lucide icon fits; it is sized by the group. |
| `onSelect` | `() => void \| boolean \| Promise<void \| boolean>` | Runs the action. Return false, or reject, to skip the confirmation. A promise keeps the button busy until it settles. |
| `doneLabel` | `string` | Past tense word shown in place after the action, such as "Archived". The icon becomes a check for confirmDuration. Omit for actions that open something. |
| `tone` | `"neutral" \| "danger"` | "danger" colors the expanded state with the danger token, for destructive actions such as Delete. |
| `disabled` | `boolean` | Dimmed and inert. Stays focusable and still reveals its label, so people can learn what it would do. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Enters and leaves the group in a single stop; focus returns to the last focused action. |
| `→` or `←` | Move focus between actions and wrap around at the ends; the focused action expands and shows the label. |
| `Home` or `End` | Go to the first and last action. |
| `Enter` or `Space` | Run the focused action; with `doneLabel`, it confirms in place. |

## Accessibility

- The group is `role="toolbar"` with the required `label` and a roving tabindex; each button has an `aria-label` equal to the item's `label`, even when collapsed.
- `disabled` items use `aria-disabled`, stay focusable, and show the label, so the person can discover what they would do; while the `onSelect` Promise runs, the button gets `aria-busy`.
- The confirmation (`doneLabel`) is announced by a `role="status"`, including when the same action repeats.

## Motion

- The action under the mouse or in focus opens its width on a spring with no overshoot and the label slides out from behind the icon; the neighbors collapse, and the whole group follows the width.
- On confirm, the icon becomes a checkmark that draws itself and the word swaps to `doneLabel` without changing the width, which already reserves the larger of the two; with a pending Promise, the icon pulses.
- With “reduce motion”, the width changes at once, the label only fades, the icon does not shrink on press, and the wait pulse becomes a fixed opacity.

## Notes for AI

- Each item needs `id`, a short `label` (a verb), and `icon`; `onSelect` can return a Promise, and returning `false` or rejecting skips the confirmation.
- `doneLabel` (“Archived”) turns on the in-place confirmation for `confirmDuration` ms (1400); omit it on actions that open something, like Reply.
- One action is always expanded: `defaultExpanded` chooses which (by default, the first enabled one), and `onAction(id)` runs before the item's `onSelect`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/expanding-button-group · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
