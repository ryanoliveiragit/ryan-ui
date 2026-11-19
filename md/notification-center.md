# Notification center

> Central de notificações com estado de lido, avisos agrupados e abertura animada.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/notification-center
- Original description: A home for updates with read state, grouped information, and animated disclosure.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/notification-center.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/notification-center.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/notification-center.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/notification-center.json`. Registry path, relative to the site address: `r/notification-center.json`.

- npm packages: `@radix-ui/react-popover`, `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Avatar](avatar.md)
- Files, once installed:
  - `components/ryan-ui/notification-center/notification-center.tsx`
  - `components/ryan-ui/notification-center/notification-center.module.css`
  - `components/ryan-ui/avatar/avatar.tsx`
  - `components/ryan-ui/avatar/avatar.module.css`
  - `components/ryan-ui/lib/ryan-provider.tsx`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-popover lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/notification-center.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Notification inbox behind a bell in an app header, with read and unread state and a count on the badge.
- When the person needs to triage: open a notification's detail, mark it as read, dismiss it, mark all as read, or clear the read ones.

## When not to use

- Use [`toast`](toast.md) or [`toast-stack`](toast-stack.md) for the immediate feedback of an action the person just took.
- Use [`notification-stack`](notification-stack.md) when notifications stay visible on the page as a stack of cards dismissed one by one, with no read state.
- Use [`timeline`](timeline.md) for a full-page activity history, grouped by day.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { NotificationCenter, type NotificationItem } from "@/components/ryan-ui/notification-center/notification-center";
import { avatar } from "@/components/ryan-ui/lib/media";
import { Room, demoStage, useQuietFirstOpen } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { layout: "center", height: 660 };

const notifications: NotificationItem[] = [
  { id: "n1", title: "Emma Collins commented on Checkout redesign", description: "The review step looks great. Can we show the total while editing?", time: "2m ago", tone: "info", actor: { name: "Emma Collins", photo: avatar("emma-collins") } },
  { id: "n2", title: "Deploy finished", description: "Production is live on version 4.12.0.", time: "18m ago", tone: "success" },
  { id: "n3", title: "Storage is 90% full", description: "Archive old exports or upgrade your workspace storage.", time: "1h ago", tone: "warning" },
  { id: "n4", title: "Marcus Johnson invited you to Mobile app", description: "You can now view and edit the board.", time: "3h ago", read: true, tone: "info", actor: { name: "Marcus Johnson", photo: avatar("marcus-johnson") } },
  { id: "n5", title: "Weekly summary is ready", description: "42 issues closed, 9 opened.", time: "Yesterday", read: true },
];

export default function NotificationCenterDemo() {
  // The panel is already open under the bell, inside the stage.
  const quiet = useQuietFirstOpen();
  return (
    <Room below={540}>
      <NotificationCenter notifications={notifications} defaultOpen onOpenAutoFocus={quiet} container={demoStage()} />
    </Room>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `NotificationCenter`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `notifications` (required) | `NotificationItem[]` | — | — |
| `label` | `string` | `"Notifications"` | — |
| `onReadChange` | `(notification: NotificationItem, read: boolean) => void` | — | — |
| `onDismiss` | `(notification: NotificationItem) => void` | — | — |
| `open` | `boolean` | — | — |
| `defaultOpen` | `boolean` | `false` | Starts with the panel open (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` | — | — |
| `avoidCollisions` | `boolean` | `true` | — |
| `container` | `HTMLElement \| null` | — | Render the panel inside this element and limit collisions to it (used by the demo stages). |
| `onOpenAutoFocus` | `(event: Event) => void` | — | Called before the panel moves focus in on open; call event.preventDefault() to keep focus where it is (for a panel that starts open). |

### Exported types

#### `NotificationItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `title` (required) | `string` | — |
| `description` | `string` | — |
| `time` (required) | `string` | — |
| `read` | `boolean` | — |
| `tone` | `"info" \| "success" \| "warning"` | — |
| `actor` | `{ name: string; photo: string }` | A local portrait asset for person-generated updates. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the bell, open or close the panel; on a row, show or hide the detail with its actions. |
| `Esc` | Closes the panel and returns focus to the bell. |
| `Tab` or `Shift + Tab` | Move through the panel's controls: close, the “All” and “Unread” filters, rows, and actions. |

## Accessibility

- It is a Radix popover: the bell receives `aria-expanded` from the primitive and an `aria-label` with `label` plus the unread count; the panel carries an `aria-label` and the summary is `aria-live="polite"`.
- Each row is a button with `aria-expanded` and a name that combines the title, the unread state, and the show-or-hide-details action; the filters use `aria-pressed`.
- Focus is repositioned after each action: on dismiss it goes to the neighboring row, and after bulk actions it goes to the filter buttons.

## Motion

- The panel grows from the bell, which tilts 12° while open; rows enter in a 35 ms cascade and collapse their own height on a spring when leaving, in sequence on bulk actions.
- The counts roll like an odometer (the larger number rises from below, the smaller one descends from above), the filter highlight slides between “All” and “Unread”, and the mark-as-read button animates its width when its label changes.
- With “reduce motion” on, the CSS animations are removed and changes become a short fade or happen instantly.

## Responsive behavior

- The panel has width `min(424px, 100vw - 24px)` and maximum height `min(590px, 100vh - 24px)`; the list scrolls inside, with the scrollbar hidden.
- Up to 380 px of viewport the spacing shrinks and “Mark all read” loses its text, leaving only the icon.

## Performance

- All notifications are rendered at once, each row with a height animation and no virtualization; keep the list in the tens.

## Notes for AI

- `notifications` is only the initial state (it goes into a `useState`): later changes to the prop are ignored, so to inject new notifications remount with a different `key`.
- Persist with `onReadChange(notification, read)` and `onDismiss(notification)`, called once per item also on bulk actions; `time` is ready-made text, the component does not format dates.
- Import from `@/components/ryan-ui/notification-center/notification-center` (it does not live in `blocks/`); it already draws the bell, depends on `avatar`, and accepts `open` with `onOpenChange`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/notification-center · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
