# Swipe actions

> Revela as ações de uma linha ao deslizar, com as mesmas ações também num menu.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/swipe-actions
- Original description: Reveal row actions with a swipe, or from the same actions in a menu.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/swipe-actions.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/swipe-actions.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/swipe-actions.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/swipe-actions.json`. Registry path, relative to the site address: `r/swipe-actions.json`.

- npm packages: `@radix-ui/react-dropdown-menu`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/swipe-actions/swipe-actions.tsx`
  - `components/ryan-ui/swipe-actions/swipe-actions.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-dropdown-menu lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/swipe-actions.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Short lists for quick triage, especially on touch, like an inbox: archive, delete, mark as unread.
- When each row needs two or three frequent actions without taking fixed space, with the more-actions menu as the path for keyboard and screen reader.

## When not to use

- Use [`context-menu`](context-menu.md) or [`dropdown-menu`](dropdown-menu.md) when the list is used mostly with mouse and keyboard: here the gesture is the main shortcut.
- Use [`reorderable-list`](reorderable-list.md) when dragging should change the order of items.
- Avoid in long or virtualized lists: each row measures its own width, stacks one animated layer per action, and animates the height on enter and exit.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Archive, MailOpen, Pin, Trash2 } from "lucide-react";
import SwipeActions, { SwipeActionsRow } from "@/components/ryan-ui/swipe-actions/swipe-actions";
import { avatar } from "@/components/ryan-ui/lib/media";
import { Caption, Stack, demoStage } from "./_kit";

const initial = [
  { id: 1, from: "Emma Collins", subject: "Updated mockups for the onboarding flow", time: "9:41", face: "emma-collins" as const },
  { id: 2, from: "Marcus Johnson", subject: "Re: API rate limits for the new plan", time: "9:12", face: "marcus-johnson" as const },
  { id: 3, from: "Olivia Bennett", subject: "Deploy window moved to Thursday", time: "Yesterday", face: "olivia-bennett" as const },
  { id: 4, from: "Hannah Walsh", subject: "Customer feedback roundup, week 45", time: "Yesterday", face: "hannah-walsh" as const },
];

export default function SwipeActionsDemo() {
  const [messages, setMessages] = useState(initial);
  const [last, setLast] = useState("None yet");
  const stage = demoStage();
  const remove = (id: number, what: string) => { setMessages(list => list.filter(message => message.id !== id)); setLast(what); };
  return (
    <Stack gap={4} width={440}>
      <SwipeActions label="Inbox">
        {messages.map(message => (
          <SwipeActionsRow
            key={message.id}
            label={message.subject}
            container={stage}
            leading={[{ label: "Unread", icon: <MailOpen size={18} aria-hidden="true" />, tone: "accent", keepRow: true, onSelect: () => setLast(`Marked "${message.subject}" unread`) }]}
            trailing={[
              { label: "Delete", icon: <Trash2 size={18} aria-hidden="true" />, tone: "danger", onSelect: () => remove(message.id, "Deleted") },
              { label: "Archive", icon: <Archive size={18} aria-hidden="true" />, tone: "neutral", onSelect: () => remove(message.id, "Archived") },
              { label: "Pin", icon: <Pin size={18} aria-hidden="true" />, tone: "accent", keepRow: true, onSelect: () => setLast("Pinned") },
            ]}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)" }}>
              <img src={avatar(message.face)} alt="" width={36} height={36} style={{ borderRadius: "50%", flex: "none" }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-2)" }}>
                  <strong style={{ fontSize: "var(--text-sm)" }}>{message.from}</strong>
                  <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>{message.time}</span>
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{message.subject}</div>
              </div>
            </div>
          </SwipeActionsRow>
        ))}
      </SwipeActions>
      <Caption>{messages.length === 0 ? "Inbox zero." : `Last action: ${last}. Drag a row sideways, or use its menu.`}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SwipeActions`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `children` (required) | `ReactNode` | — | — |
| `className` | `string` | — | — |

### `SwipeActionsRow`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | Names the row in its menu button, for example the message subject. |
| `leading` | `SwipeAction[]` | `[]` | — |
| `trailing` | `SwipeAction[]` | `[]` | — |
| `fullSwipe` | `boolean` | `true` | Lets a long swipe commit the outermost action without a tap. On by default. |
| `container` | `HTMLElement \| null` | — | Render the menu inside this element and limit collisions to it (used by the demo stages). |
| `children` (required) | `ReactNode` | — | — |
| `className` | `string` | — | — |

### Exported types

#### `SwipeAction`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `icon` (required) | `ReactNode` | — |
| `tone` | `"neutral" \| "accent" \| "danger"` | Fill of the revealed action. Pair `danger` with a label that names the destructive result. |
| `onSelect` (required) | `() => void` | Runs for a full swipe, a tap on the revealed action, or the More actions menu. Remove the item here unless `keepRow` is set. |
| `keepRow` | `boolean` | The row springs home after the action instead of sliding away and collapsing, for actions such as Mark as unread. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Moves through each row's more-actions button; the actions revealed by the gesture are outside the tab order. |
| `Enter` or `Space` or `↓` | On the more-actions button, open the row menu, with the same actions as the gesture. |
| `↓` or `↑` | In the menu, move through the actions and wrap around at the ends; `Enter` or `Space` run the focused action. |
| `Esc` | Collapses the row that is open from the gesture; with the row menu open, closes the menu and returns focus to the button. |

## Accessibility

- The list is a `<ul role="list">` with `label` as its name; each row has a button with a name built in English (“More actions for …”, from the row's `label`) that opens a Radix menu with the same actions.
- The actions revealed by the gesture are `aria-hidden` and outside `Tab`: the menu is the path for keyboard and screen reader, and when the row leaves through it, focus goes to the neighboring row's button.
- Give the row a `label` that identifies the item, like the message subject, and give actions with `tone="danger"` a label that says the outcome, like “Delete”.

## Motion

- The row follows the finger or mouse after 8 px horizontally (vertical movement stays with scrolling) and resists like a rubber band past the last stop; on release, the velocity decides whether it opens, closes, or runs.
- A long swipe, past about 56% of the width, arms the outermost action, which stretches over the whole row; the row exits in the direction of the gesture and the list closes the gap on a spring.
- With “reduce motion”, the row jumps to each stop, removal is only a fade, and the menu appears without growing.

## Responsive behavior

- Each action takes 76 px when the row rests open; on narrow screens, prefer one or two per side.
- On touch, `touch-action: pan-y` leaves vertical scrolling to the page; with a mouse, the row shows the drag cursor.

## Performance

- Each row keeps a `ResizeObserver` and one animated layer per action; the component was made for short triage lists, not for thousands of rows.

## Notes for AI

- Build `<SwipeActions label="Caixa de entrada">` with one `<SwipeActionsRow key={id} label={assunto} leading={…} trailing={…}>` per item; the stable `key` allows the animated exit and the return on an Undo.
- In `onSelect`, remove the item from the state (the row leaves and the list closes the gap); for actions that keep the item, like mark as unread, use `keepRow`.
- The outermost action on each side (`leading[0]` and the last of `trailing`) is the one that runs on the long swipe; `fullSwipe={false}` turns off that shortcut.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/swipe-actions · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
