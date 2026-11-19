# Message scroller

> Área de conversa que acompanha as mensagens novas, solta quando você rola para cima e mostra um atalho com as não lidas.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/message-scroller
- Original description: A conversation scroll area that follows new messages while the reader is at the bottom, lets go when they scroll up, and offers a jump to latest pill with an unread count.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/message-scroller.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/message-scroller.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/message-scroller.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/message-scroller.json`. Registry path, relative to the site address: `r/message-scroller.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/message-scroller/message-scroller.tsx`
  - `components/ryan-ui/message-scroller/message-scroller.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/message-scroller.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- The scroll area of a conversation that receives new messages or streaming text and should follow the end while the reader is there.
- When scrolling up should release the follow behavior, without pulling the reader back, and offer a shortcut to the latest message.
- Live logs in general (run logs, event feeds) where new content enters from the bottom.

## When not to use

- Use [`scroll-area`](scroll-area.md) for static content that only needs thin scrollbars and edge fades.
- Use [`chat-thread`](chat-thread.md) or [`chat-app`](chat-app.md) when you want the ready-made conversation, with messages and input field, and not just the container.
- Use [`infinite-masonry`](infinite-masonry.md) for feeds that load more items on reaching the end, instead of following what arrives.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useEffect, useState } from "react";
import MessageScroller from "@/components/ryan-ui/message-scroller/message-scroller";
import { MessageBubble } from "@/components/ryan-ui/message-bubble/message-bubble";
import type { MessageBubbleFrom, MessageBubblePosition } from "@/components/ryan-ui/message-bubble/message-bubble";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./message-scroller.module.css";

export const stage: DemoStage = { height: 560 };

const script: { from: MessageBubbleFrom; text: string }[] = [
  { from: "user", text: "How is the migration going?" },
  { from: "assistant", text: "Copying the orders table now. 38% done." },
  { from: "assistant", text: "No write errors so far." },
  { from: "user", text: "Great. Ping me when the indexes are rebuilt." },
  { from: "assistant", text: "Orders table copied: 2.4 million rows in 41 s." },
  { from: "assistant", text: "Rebuilding indexes on customers and invoices." },
  { from: "user", text: "Any slow queries showing up?" },
  { from: "assistant", text: "One: the weekly revenue report took 3.2 s. I added it to the follow-up list." },
  { from: "assistant", text: "Indexes rebuilt. Running the row count check." },
  { from: "user", text: "Perfect, thanks." },
  { from: "assistant", text: "Row counts match on all 14 tables. The migration is complete." },
];
const START = 7;
/** Keeps the demo light however long it runs. */
const LIMIT = 80;

export default function MessageScrollerDemo() {
  const [count, setCount] = useState(START);
  const [live, setLive] = useState(true);
  const [following, setFollowing] = useState(true);

  useEffect(() => {
    if (!live) return;
    const timer = window.setInterval(() => setCount(current => current + 1), 1700);
    return () => window.clearInterval(timer);
  }, [live]);

  const first = Math.max(0, count - LIMIT);
  const lines = Array.from({ length: count - first }, (_, offset) => ({ id: first + offset, ...script[(first + offset) % script.length]! }));

  return (
    <Stack width={420} gap={4}>
      <MessageScroller className={styles.panel} label="Migration thread" onAtBottomChange={setFollowing}>
        {lines.map((line, index) => {
          const before = lines[index - 1]?.from === line.from, after = lines[index + 1]?.from === line.from;
          const position: MessageBubblePosition = before && after ? "middle" : before ? "last" : after ? "first" : "single";
          return <div key={line.id} className={before ? undefined : styles.turn}><MessageBubble from={line.from} position={position} animateIn={false}>{line.text}</MessageBubble></div>;
        })}
      </MessageScroller>
      <Row justify="space-between">
        <Row gap={2}>
          <Button size="sm" variant="secondary" onClick={() => setLive(current => !current)}>{live ? "Pause messages" : "Resume messages"}</Button>
          <Button size="sm" variant="ghost" onClick={() => setCount(current => current + 1)}>Add one</Button>
        </Row>
        <Caption>{following ? "Following the latest" : "Released: reading history"}</Caption>
      </Row>
      <Caption>Scroll up inside the thread. It stops following, and the pill counts what arrives until you jump back.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `MessageScroller`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` | — | The messages. Each direct child counts as one message for the unread count; give them stable keys. |
| `label` | `string` | `"Conversation"` | Accessible name of the scroll area. |
| `threshold` | `number` | `32` | How close to the bottom, in pixels, still counts as being at the bottom. |
| `jumpLabel` | `string` | `"Jump to latest"` | Text of the pill that returns to the newest message. |
| `animateItems` | `boolean` | `true` | New messages rise in as they are added. Messages present on the first render never animate. |
| `fadeEdges` | `boolean` | `true` | Fades the top and bottom edges while there is more content in that direction. |
| `onAtBottomChange` | `(atBottom: boolean) => void` | — | Called when the reader leaves or returns to the bottom. |
| `className` | `string` | — | Extra class for the root element. |
| `style` | `CSSProperties` | — | Inline style for the root element, for example a height. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` or `Page Up` or `Page Down` or `Home` or `End` or `Space` | With focus on the area, scroll the conversation (native scrolling) and immediately interrupt the automatic slide to the end. |
| `Tab` | Moves focus to the scroll area, which is focusable, then to whatever is interactive in the messages and to the jump button. |
| `Enter` or `Space` | On the “Jump to latest” button, returns to the end; focus moves to the scroll area, because the button disappears. |

## Accessibility

- The visible area is a focusable `role="region"` named by `label`; the content is a `role="log"` with `aria-live="polite"`, so new messages are announced.
- The jump button shows the text of `jumpLabel`, and the counter has an `aria-label` with the number of new messages (in English, with no translation prop).
- When the button is activated by keyboard, focus goes to the scroll area instead of being lost when the button leaves.

## Motion

- New messages rise with a spring and a slight scale-up; those already present on the first render do not animate.
- The return to the end is a spring slide in the scroll position; the jump button emerges from below and the unread number rolls to each new total.
- With “reduce motion” on, scrolling goes straight to the end, and messages and button only fade.

## Responsive behavior

- The height comes from `--message-scroller-height` (default 22rem) or from `className` and `style`; scrolling is internal, and the top and bottom edges fade when there is more content in that direction.

## Performance

- Two `ResizeObserver`s track the content and the frame; there is no virtualization and each child gets an animated wrapper, so limit the history in very long conversations.

## Notes for AI

- Each direct child counts as one message: give each a stable `key`; the unread counter compares the number of children, so trimming old messages while new ones arrive makes it stop going up.
- Set the height (variable `--message-scroller-height`, `className` or `style`); `onAtBottomChange` signals when the reader leaves the end or returns, and `threshold` (32 px) says what still counts as the end.
- It pairs with `message-bubble` or `message` as children; pass `animateIn={false}` to them, because the animated entrance is already handled here (`animateItems`).

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/message-scroller · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
