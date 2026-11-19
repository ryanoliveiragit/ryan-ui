# Chat thread

> Conversa com mensagens agrupadas, reações, confirmação de leitura, indicador de digitação e campo de envio com anexos.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/chat-thread
- Original description: A chat thread with grouped messages, reactions, read receipts, typing, and a composer with attachments.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/chat-thread.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/chat-thread.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/chat-thread.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/chat-thread.json`. Registry path, relative to the site address: `r/chat-thread.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/chat-thread/chat-thread.tsx`
  - `components/ryan-ui/chat-thread/chat-thread.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/chat-thread.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Conversation between people or customer support: messages grouped by author and by day, reactions, typing indicator, and read receipts.
- When the delivery state of the user's own message matters: sending, sent, delivered, read, or failed, with a retry button via `onRetry`.
- When the user attaches files with the button, by pasting, or by dragging onto the composer.

## When not to use

- Use [`chat-app`](chat-app.md) for a conversation with an AI assistant, with streaming responses, stop, and regenerate.
- Use [`comment-thread`](comment-thread.md) for a discussion tied to a piece of content, with nested replies, mentions, editing, and resolve.
- Use [`message-bubble`](message-bubble.md) when you only need the bubble, without a list, scrolling, or composer.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useEffect, useMemo, useState } from "react";
import { ChatThread, type ChatMessage, type ChatParticipant, type ChatDraft } from "@/components/ryan-ui/chat-thread/chat-thread";
import { avatar } from "@/components/ryan-ui/lib/media";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 620 };

const participants: ChatParticipant[] = [
  { id: "me", name: "You" },
  { id: "hannah", name: "Hannah Walsh", avatar: avatar("hannah-walsh") },
  { id: "jordan", name: "Jordan Reyes", avatar: avatar("jordan-reyes") },
];

export default function ChatThreadDemo() {
  const base = useMemo(() => Date.now(), []);
  const min = 60_000;
  const messages = useMemo<ChatMessage[]>(() => [
    { id: "m1", authorId: "hannah", createdAt: base - 26 * 60 * min, text: "Hi! Our invoice for October shows two charges for the Team plan." },
    { id: "m2", authorId: "me", createdAt: base - 25 * 60 * min, text: "Thanks for flagging it, Hannah. Let me look at the billing record.", status: "read" },
    { id: "m3", authorId: "hannah", createdAt: base - 40 * min, text: "Any luck? Finance closes the books on Friday." },
    { id: "m4", authorId: "hannah", createdAt: base - 39 * min, text: "Here is the invoice in case it helps.", reactions: [{ emoji: "🙏", count: 1 }] },
    { id: "m5", authorId: "me", createdAt: base - 30 * min, text: "Found it: a seat was added twice during the migration. I refunded the duplicate charge.", status: "read", reactions: [{ emoji: "🎉", count: 1 }] },
    { id: "m6", authorId: "me", createdAt: base - 29 * min, text: "The refund shows up in 3 to 5 business days.", status: "delivered" },
  ], [base]);
  const [typing, setTyping] = useState<string[]>([]);

  useEffect(() => {
    const t = window.setTimeout(() => setTyping(["hannah"]), 1200);
    return () => window.clearTimeout(t);
  }, []);

  const onSend = (_draft: ChatDraft) => {
    setTyping(["hannah"]);
    window.setTimeout(() => setTyping([]), 2500);
  };

  return (
    <Stack width={460} gap={3}>
      <div style={{ height: 520, border: "1px solid var(--border)", borderRadius: "var(--radius-panel)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <ChatThread participants={participants} currentUserId="me" defaultMessages={messages} typing={typing} readBy={{ hannah: "m5" }} onSend={onSend} placeholder="Reply to Hannah" label="Billing support conversation" />
      </div>
      <Caption>Send a message, hover one to react, or attach a file.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ChatComposer`

The message box on its own: autosizing text, attachments by button, paste, or drop, and a send button that morphs when there is something to send.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onSend` (required) | `(draft: ChatDraft) => void` | — | — |
| `placeholder` | `string` | `"Message"` | — |
| `allowAttachments` | `boolean` | `true` | — |
| `accept` | `string` | — | — |
| `disabled` | `boolean` | — | — |
| `labels` | `ChatComposerLabels` | — | Words for localization. Leave out any key to keep its English default. |
| `className` | `string` | — | — |

### `ChatThread`

A chat or support thread: grouped messages with day separators, reactions, read receipts that glide to the latest read message, a typing indicator, and a composer. The list stays pinned to the newest message and offers a pill when new messages land out of view.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `participants` (required) | `ChatParticipant[]` | — | — |
| `currentUserId` (required) | `string` | — | — |
| `messages` | `ChatMessage[]` | — | Controlled messages, oldest first. Leave it out to let the thread keep its own list. |
| `defaultMessages` | `ChatMessage[]` | — | — |
| `typing` | `string[]` | `[]` | Participant ids currently typing. |
| `readBy` | `Record<string, string>` | — | The last message each participant has read, by participant id. Their avatar sits under that message and glides as it moves. |
| `onSend` | `(draft: ChatDraft) => void \| Promise<void>` | — | Called with the composer's text and files. Uncontrolled threads also append the message themselves. |
| `onReact` | `(messageId: string, emoji: string) => void` | — | — |
| `onRetry` | `(messageId: string) => void` | — | — |
| `reactions` | `string[]` | `DEFAULT_REACTIONS` | Emoji offered by the reaction picker. |
| `placeholder` | `string` | `"Message"` | — |
| `composer` | `boolean` | `true` | Show the composer. Defaults to true. |
| `allowAttachments` | `boolean` | `true` | — |
| `accept` | `string` | — | File types the attach button offers, as for `<input accept>`. |
| `groupWindow` | `number` | `5 * 60_000` | Messages from one person closer together than this, in ms, share a group. Defaults to five minutes. |
| `locale` | `string` | `"en-US"` | — |
| `label` | `string` | `"Conversation"` | Accessible name of the message log. |
| `labels` | `ChatThreadLabels` | — | Words for localization. Leave out any key to keep its English default. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `ChatMessageStatus` | `"sending" \| "sent" \| "delivered" \| "read" \| "failed"` |

#### `ChatParticipant`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `name` (required) | `string` | — |
| `avatar` | `string` | Portrait URL. Initials show when it is missing. |

#### `ChatAttachment`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `name` (required) | `string` | — |
| `kind` (required) | `"image" \| "file"` | — |
| `url` | `string` | — |
| `size` | `number` | Bytes. |
| `width` | `number` | Intrinsic image size, used to reserve space before the image loads. |
| `height` | `number` | — |
| `alt` | `string` | — |

#### `ChatReaction`

| Field | Type | Description |
| --- | --- | --- |
| `emoji` (required) | `string` | — |
| `count` (required) | `number` | — |
| `mine` | `boolean` | The current user reacted with this emoji. |

#### `ChatMessage`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `authorId` (required) | `string` | — |
| `text` | `string` | — |
| `createdAt` (required) | `Date \| string \| number` | — |
| `attachments` | `ChatAttachment[]` | — |
| `reactions` | `ChatReaction[]` | — |
| `status` | `"sending" \| "sent" \| "delivered" \| "read" \| "failed"` | Delivery state of the current user's own messages. |

#### `ChatDraft`

| Field | Type | Description |
| --- | --- | --- |
| `text` (required) | `string` | — |
| `files` (required) | `File[]` | — |

#### `ChatComposerLabels`

Words the composer shows or announces. Each has an English default.

| Field | Type | Description |
| --- | --- | --- |
| `send` | `string` | Accessible name of the send button. |
| `attach` | `string` | Accessible name of the attach button. |
| `attachments` | `string` | Accessible name of the list of files waiting to send. |
| `removeFile` | `(name: string) => string` | Accessible name of the button that takes a file back out. |

#### `ChatThreadLabels`

Every word the thread shows or announces. Each has an English default; words with a count or names are functions, so an app can apply its own plural rules.

| Field | Type | Description |
| --- | --- | --- |
| `sending` | `string` | — |
| `sent` | `string` | — |
| `delivered` | `string` | — |
| `read` | `string` | — |
| `failed` | `string` | — |
| `retry` | `string` | — |
| `readBy` | `(names: string[]) => string` | Accessible name of the read receipts under a message. |
| `today` | `string` | Day separators for the last two days. Older days are formatted by `locale`. Defaults come from Intl for `locale`. |
| `yesterday` | `string` | — |
| `typing` | `(names: string[]) => string` | Screen reader announcement of who is typing. |
| `newMessages` | `(count: number) => string` | The pill when new messages land out of view. The count inside it rolls. |
| `jumpToLatest` | `string` | — |
| `unknownAuthor` | `string` | Name shown for a message whose author is not in `participants`. |
| `addReaction` | `string` | — |
| `reactions` | `string` | Accessible name of the reaction picker and of the reactions under a message. |
| `reactWith` | `(emoji: string) => string` | Accessible name of an emoji in the picker. |
| `reactionCount` | `(emoji: string, count: number, includesYou: boolean) => string` | Accessible name of a reaction under a message. |
| `...props` | `ChatComposerLabels` | Also accepts the props of this type. |

#### `ChatThreadHandle`

| Field | Type | Description |
| --- | --- | --- |
| `scrollToBottom` (required) | `(smooth?: boolean) => void` | — |
| `focusComposer` (required) | `() => void` | — |

#### `ChatComposerHandle`

| Field | Type | Description |
| --- | --- | --- |
| `focus` (required) | `() => void` | — |

### Other exports

- `formatBytes` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` | In the message field, sends the text and attachments. |
| `Shift + Enter` | Inserts a line break without sending. |
| `←` or `→` | In the reaction picker, move from one emoji to another, wrapping at the ends. |
| `Esc` | Closes the reaction picker and returns focus to the button that opened it. |
| `Space` or `Enter` | On a reaction under the message, toggle your participation; in the picker, choose the focused emoji. |
| `Tab` | Moves through attachments, reactions, the new messages pill, attach, field, and send; a message's react button appears when focus enters it. |

## Accessibility

- The list is a `role="log"` with `aria-live="polite"`, so new messages are announced; who is typing is announced in a separate `role="status"` region.
- Reactions are buttons with `aria-pressed` and a label with the count; the picker opens with focus on the first emoji and returns it on closing.
- All visible or announced text has an English default and can be replaced through `labels`; also provide `label` (the conversation's name) and `alt` on image attachments.

## Motion

- Each new message pops in from its side with a spring and, if you are at the end, the conversation rises from where it was instead of jumping.
- Reactions appear with scale and the count rolls; the read avatars slide to the last read message, and the typing dots pulse in sequence.
- With “reduce motion”, everything becomes a short fade, the dots stay still, and scrolling to the end is instant.

## Responsive behavior

- The root has `height: 100%` and scrolls internally: the parent must have a defined height, otherwise the list neither scrolls nor stays pinned to the end.
- Bubbles take up to 78% of the width (84% on screens up to 420 px), and on touch screens the react button is always visible.

## Performance

- All messages stay in the DOM, without virtualization: for long histories, load in pages.
- Images use `loading="lazy"`, and `width` and `height` on the attachment reserve the space of a single image before it loads.

## Notes for AI

- With `messages` (controlled) you add the message yourself in `onSend` and update reactions in `onReact`; with `defaultMessages` the list handles this and the callbacks only notify.
- `onSend` receives `{ text, files }` with `File` objects that you must upload to the server; `currentUserId` sets the side of the bubbles, and each `authorId` must exist in `participants`.
- Message text is plain, without markdown; `ChatComposer` is exported separately, and the `ref` offers `scrollToBottom()` and `focusComposer()`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/chat-thread · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
