# Notification stack

> Pilha de notificações que se abre em leque ao passar o mouse; dispense arrastando ou pelo botão e as demais se reorganizam com mola.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/notification-stack
- Original description: A pile of notification cards that fans out into a list on hover or focus; cards leave by swipe, close button or Delete, and the rest restack on a spring.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/notification-stack.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/notification-stack.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/notification-stack.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/notification-stack.json`. Registry path, relative to the site address: `r/notification-stack.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/blocks/notification-stack/notification-stack.tsx`
  - `components/ryan-ui/blocks/notification-stack/notification-stack.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/notification-stack.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A handful of pending notifications on a panel or dashboard, stacked to take little space and opened into a list when the person gets close.
- Notifications that resolve by dismissing: drag the card sideways, a close button, or the `Delete` key.

## When not to use

- Use [`toast-stack`](toast-stack.md) for transient results that appear at the screen edge and disappear on their own.
- Use [`notification-center`](notification-center.md) when you need read and unread state, a filter, and bulk actions behind a bell.
- Use [`swipe-actions`](swipe-actions.md) when the sideways gesture should reveal actions on a list row, and not remove the item.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import NotificationStackPreview from "@/components/ryan-ui/blocks/notification-stack/notification-stack";

export default function NotificationStackDemo() {
  return <NotificationStackPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `NotificationStack`

A pile of notifications that fans out into a list on hover or focus; cards leave by swipe, button, or Delete, and the rest close ranks on a spring.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `notifications` | `StackNotification[]` | — | Notifications, newest first. Pass it with `onNotificationsChange` to control the list. |
| `defaultNotifications` | `StackNotification[]` | `sampleNotifications` | Starting list when uncontrolled. Defaults to sample notifications. |
| `onNotificationsChange` | `(next: StackNotification[]) => void` | — | Called with the remaining list after a dismissal, a clear, or a restore. |
| `onDismiss` | `(id: string) => void` | — | Called with the id of each dismissed notification. |
| `expanded` | `boolean` | — | Keeps the stack fanned out. Hover and keyboard focus fan it out on their own. |
| `defaultExpanded` | `boolean` | `false` | Whether the stack starts fanned out when uncontrolled. |
| `onExpandedChange` | `(expanded: boolean) => void` | — | Called when the person pins or unpins the fanned out state. |
| `visible` | `number` | `3` | How many cards show in the collapsed pile. |
| `title` | `string` | `"Notifications"` | Heading above the stack. |
| `className` | `string` | — | Extra class for the stack. |

### `NotificationStackPreview`

Ready preview: the stack on a quiet stage, with room underneath to fan out.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `StackNotificationKind` | `"message" \| "billing" \| "review" \| "security" \| "team"` |

#### `StackNotification`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique id, used for dismissal. |
| `title` (required) | `string` | First line: who or what the notification is about. |
| `body` (required) | `string` | Message, clamped to two lines. |
| `time` (required) | `string` | Short relative time, such as "2m". |
| `kind` | `"message" \| "billing" \| "review" \| "security" \| "team"` | Picks the icon and its tone. Defaults to `message`. |
| `unread` | `boolean` | Shows the unread dot next to the title. |

### Other exports

- `sampleNotifications` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | When entering the stack by keyboard it opens into a list; each card has one stop, on the dismiss button. |
| `Delete` or `Backspace` | Dismiss the focused card and move focus to the next card, or to the “Bring them back” button when the stack empties. |
| `Enter` or `Space` | Activate the focused button: dismiss a card, pin the list open (“Show all”), or clear everything (“Clear all”). |

## Accessibility

- With the stack closed, the cards behind are `aria-hidden` and out of the Tab order; the “Show all” button pins the list open and exposes `aria-expanded`.
- A hidden `role="status"` announces how many notifications remain, each close button has an `aria-label` with the card's title, and the unread dot carries the text “Unread” for screen readers.
- Dragging is not the only path: the close button and `Delete` do the same, and on touch screens a tap on the stack opens it.

## Motion

- Closed, each card behind shows 10 px and shrinks 5%; with the mouse over it, keyboard focus, or a pinned list, the cards drop into a list on a spring and the container height follows.
- A dismissed card slides toward the drag side and disappears, and the others move up to close the line on a spring; dragging past 110 px or releasing above 650 px/s confirms the exit.
- With “reduce motion” on, dragging is turned off, cards only fade out when leaving, and positions change instantly.

## Responsive behavior

- The width is `min(25rem, 100%)` and each card's text is clipped to two lines, which keeps all of them the same height.
- The open list grows downward in the page flow and pushes what comes after; `touch-action: pan-y` lets vertical scrolling through while the sideways drag dismisses.

## Performance

- All notifications stay mounted, even those that do not show in the stack, each with its own `ResizeObserver` and drag; the block was designed for few items, not hundreds.

## Notes for AI

- Import the named component `NotificationStack`; the default export is the preview with example notifications.
- Control it with `notifications` and `onNotificationsChange` (list from newest to oldest) or use `defaultNotifications`; `onDismiss(id)` fires per card, including for each one in “Clear all”.
- In controlled mode also pass `defaultNotifications`: the empty state's “Bring them back” button returns that list and, without it, hands the example notifications to your `onNotificationsChange`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/notification-stack · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
