# Chat app

> Tela de chat completa: lista de conversas, respostas simuladas que chegam aos poucos e caixa de prompt.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/chat-app
- Original description: A complete chat screen: a conversation list with a gliding active marker, a thread whose simulated replies think, stream in and can be stopped, copied or regenerated, and a growing prompt box.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/chat-app.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/chat-app.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/chat-app.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/chat-app.json`. Registry path, relative to the site address: `r/chat-app.json`.

- npm packages: `motion`, `lucide-react`
- Uses other ryan-ui items (installed along with it): [Streaming response](streaming-response.md), [Loading states](loading-states.md)
- Files, once installed:
  - `components/ryan-ui/blocks/chat-app/chat-app.tsx`
  - `components/ryan-ui/blocks/chat-app/chat-app.module.css`
  - `components/ryan-ui/blocks/chat-app/chat-app-data.ts`
  - `components/ryan-ui/lib/use-copy-feedback.ts`
  - `components/ryan-ui/lib/media.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/chat-app.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Prototype or demo of an AI chat product: conversation list and replies that “think”, arrive word by word, and can be stopped, copied, or redone.
- Usability tests, guided tours, or presentation pages where ready-made replies (`reply`) are enough and there is no server.
- Screens that need to go from desktop to mobile: below 760px of width, the conversation list becomes a drawer.

## When not to use

- Use [`chat-thread`](chat-thread.md) for conversation between people, with reactions, read receipts, and attachments.
- Use [`ai-sidebar`](ai-sidebar.md) when the assistant sits in a panel beside the page, rather than on its own screen.
- Avoid connecting directly to a streaming model: `reply` is synchronous and returns the whole text; for real replies, combine [`prompt-input`](prompt-input.md), [`message`](message.md), and [`message-scroller`](message-scroller.md), or edit the block.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import ChatAppPreview from "@/components/ryan-ui/blocks/chat-app/chat-app";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { layout: "fill", frame: true, height: 680 };

export default function ChatAppDemo() {
  return <ChatAppPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ChatApp`

A complete chat screen: a list of conversations, the thread of the open one and a prompt box. Replies are simulated in the browser: a short "thinking" beat, then the answer streams in word by word and can be stopped, copied or regenerated. In a narrow container the conversation list turns into a drawer.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `conversations` | `ChatConversation[]` | `sampleConversations` | Conversations the screen starts with. The first one is open. |
| `suggestions` | `ChatSuggestion[]` | `sampleSuggestions` | Prompt ideas shown in an empty conversation. |
| `reply` | `(prompt: string, attempt: number) => string` | `sampleReply` | Produces the simulated reply to a prompt. `attempt` grows by one on every regenerate. Replace it with your own canned answers. |
| `onSend` | `(prompt: string, conversationId: string) => void` | — | Called when the person sends a prompt, with the conversation it went to. |
| `assistantName` | `string` | `"Assistant"` | Name of the assistant, used in labels. |
| `user` | `ChatUser` | `sampleUser` | The signed-in person shown at the foot of the conversation list. |
| `speed` | `number` | `26` | Words per second of the streamed replies. |
| `height` | `number \| string` | — | Height of the screen, as a CSS length or a number of pixels. Defaults to the full viewport height. |
| `className` | `string` | — | Class name added to the root element. |

### `ChatAppPreview`

Ready-made preview with sample conversations.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

#### `ChatMessage`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable id of the message. |
| `role` (required) | `"user" \| "assistant"` | Who wrote it. |
| `text` (required) | `string` | The message text. Blank lines split paragraphs. |
| `state` (required) | `"thinking" \| "streaming" \| "done" \| "stopped"` | Where an assistant reply is: waiting to start, arriving, finished, or stopped early. User messages are always "done". |

#### `ChatConversation`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable id of the conversation. |
| `title` (required) | `string` | Title shown in the list and above the thread. |
| `updated` (required) | `string` | Short label of when it last changed: "Now", "2h", "Yesterday". |
| `messages` (required) | `ChatMessage[]` | Messages, oldest first. |

#### `ChatSuggestion`

| Field | Type | Description |
| --- | --- | --- |
| `title` (required) | `string` | Short heading of the card. |
| `prompt` (required) | `string` | The prompt the card sends. |

#### `ChatUser`

| Field | Type | Description |
| --- | --- | --- |
| `name` (required) | `string` | Name shown at the foot of the conversation list. |
| `detail` | `string` | Second line under the name, such as a plan or an email. |
| `avatar` | `string` | Avatar image address. |

### Other exports

- `sampleUser` (value)
- `sampleConversations` (value)
- `sampleSuggestions` (value)
- `sampleReply` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` | In the message box, sends the text; while a reply is arriving, it does nothing (the button beside it becomes the stop button). |
| `Shift + Enter` | Breaks the line; the box grows up to 168px and then scrolls. |
| `Esc` | At narrow width, closes the conversation drawer and returns focus to the button that opened it. |
| `Enter` or `Space` | On the buttons, open a conversation, create another, send a suggestion, or stop, copy, and redo the reply. |

## Accessibility

- The messages sit in an `ol` list, each turn starts with “You:” or with `assistantName` for the screen reader only, and a `role="status"` region announces when the assistant is replying.
- At narrow width, the drawer gets `inert` when closed and the rest of the screen gets it when open; opening moves focus to “New chat” and closing returns it to the conversations button.
- The open conversation has `aria-current`, the send button is renamed “Stop the reply” during the reply, and the copy button becomes “Copied”; the fixed texts are in English.

## Motion

- Messages rise with a soft spring; the reply “thinks” for about a second with a shimmer on the text and then arrives word by word at the speed of `speed`.
- The active conversation marker slides between items, the drawer enters from the side with a no-overshoot spring, and the send icon rotates until it becomes the stop icon.
- With “reduce motion” on, springs, slides, and press effects are turned off and the reply appears whole after the “thinking” interval, without the word-by-word effect.

## Responsive behavior

- Below 760px of the block's own width (measured by `ResizeObserver`), the conversation list becomes a drawer over the conversation, with a darkened backdrop and a button in the header.
- Takes `100dvh` by default, with a minimum of 30rem; inside a page or a frame, pass `height` so it does not push the rest of the layout.

## Performance

- Uses two `ResizeObserver`s (block width and conversation height, to follow the reply to the end) and one timer per reply; all messages of the open conversation stay in the DOM.

## Notes for AI

- Import `ChatApp` by name (the default export is the preview); `conversations` only sets the initial state: after that, conversations and messages live inside the block.
- Replies are simulated: `reply(prompt, attempt)` returns the text (blank lines separate paragraphs) and `onSend` reports each send; the “Simulated replies” badge in the header is hardcoded.
- Depends on `streaming-response` and `loading-states`, installed along with it; pass `user` to change the example person at the bottom of the list and `assistantName` for the labels.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/chat-app · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
