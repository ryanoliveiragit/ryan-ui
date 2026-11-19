# Message bubble

> Balão de conversa para você e para o assistente, com cauda, agrupamento, horário e tiques de entrega animados.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/message-bubble
- Original description: A chat bubble for the person and the assistant that pops in from its tail corner, groups consecutive messages, and draws delivery ticks under a timestamp.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/message-bubble.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/message-bubble.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/message-bubble.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/message-bubble.json`. Registry path, relative to the site address: `r/message-bubble.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/message-bubble/message-bubble.tsx`
  - `components/ryan-ui/message-bubble/message-bubble.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/message-bubble.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Messenger-style conversations: the person's bubbles sit on the right in the accent color and the assistant's on the left on a neutral surface.
- Sequences of messages from the same sender: `MessageBubbleGroup` tightens the inner corners and leaves the tail only on the last bubble.
- When the sent message should show time and delivery state (`sending`, `sent`, `delivered`, `read`, `failed`) or the other party is typing (`typing`).

## When not to use

- Use [`message`](message.md) for long assistant replies, with Markdown and a toolbar for copy, retry and rating.
- Use [`chat-thread`](chat-thread.md) when you need the ready-made conversation, with reactions, read receipts, typing indicator and input field.
- Use [`chat-app`](chat-app.md) when you want the whole chat screen, with conversation list and prompt box.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUp } from "lucide-react";
import { MessageBubble, MessageBubbleGroup } from "@/components/ryan-ui/message-bubble/message-bubble";
import type { MessageBubbleFrom, MessageBubbleStatus } from "@/components/ryan-ui/message-bubble/message-bubble";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./message-bubble.module.css";

export const stage: DemoStage = { height: 560 };

interface Line { id: number; from: MessageBubbleFrom; text: string; time: string; status?: MessageBubbleStatus; typing?: boolean; fresh?: boolean }

const history: Line[] = [
  { id: 1, from: "assistant", text: "Morning! Your flight to Lisbon is confirmed for Friday.", time: "9:38" },
  { id: 2, from: "assistant", text: "Want me to book the airport transfer too?", time: "9:38" },
  { id: 3, from: "user", text: "Yes please.", time: "9:41", status: "read" },
  { id: 4, from: "user", text: "Anything that gets me downtown before noon.", time: "9:41", status: "read" },
];
const replies = ["Done. A car will be waiting at arrivals at 10:15.", "Got it, I added that to the booking.", "Sure. I will confirm once the driver accepts."];
/** The demo keeps its own clock so new lines continue the sample conversation: one minute per exchange. */
const clock = (turn: number) => `9:${42 + (turn % 18)}`;

/** Consecutive lines from one sender become one group, so only the last bubble of a run keeps its tail. */
function runs(lines: Line[]) {
  return lines.reduce<Line[][]>((groups, line) => {
    const last = groups[groups.length - 1];
    if (last && last[0]!.from === line.from) last.push(line); else groups.push([line]);
    return groups;
  }, []);
}

export default function MessageBubbleDemo() {
  const [lines, setLines] = useState(history);
  const [draft, setDraft] = useState("");
  const nextId = useRef(history.length + 1);
  const sent = useRef(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(timer => window.clearTimeout(timer)), []);
  const later = (ms: number, run: () => void) => { timers.current.push(window.setTimeout(run, ms)); };
  const patch = (id: number, change: Partial<Line>) => setLines(current => current.map(line => line.id === id ? { ...line, ...change } : line));

  function send(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const id = nextId.current++;
    const replyId = nextId.current++;
    const turn = sent.current++;
    const reply = replies[turn % replies.length]!;
    setDraft("");
    setLines(current => [...current.filter(line => !line.typing), { id, from: "user", text, time: clock(turn), status: "sending", fresh: true }]);
    later(600, () => patch(id, { status: "sent" }));
    later(1300, () => patch(id, { status: "delivered" }));
    later(2100, () => { patch(id, { status: "read" }); setLines(current => [...current, { id: replyId, from: "assistant", text: "", time: clock(turn), typing: true, fresh: true }]); });
    later(3900, () => patch(replyId, { typing: false, text: reply }));
  }

  return (
    <Stack width={400} gap={4}>
      <div className={styles.thread}>
        {runs(lines).map(group => (
          <MessageBubbleGroup key={group[0]!.id} from={group[0]!.from} label={group[0]!.from === "user" ? "Your messages" : "Messages from the assistant"}>
            {group.map((line, index) => {
              const last = index === group.length - 1;
              return <MessageBubble key={`${line.id}${line.typing ? "-typing" : ""}`} typing={line.typing} animateIn={!!line.fresh} timestamp={last && !line.typing ? line.time : undefined} status={last ? line.status : undefined}>{line.text}</MessageBubble>;
            })}
          </MessageBubbleGroup>
        ))}
      </div>
      <form className={styles.composer} onSubmit={send}>
        <input className={styles.field} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Write a message" aria-label="Message" />
        <button type="submit" className={styles.send} aria-label="Send message" disabled={!draft.trim()}><ArrowUp width={18} height={18} strokeWidth={2.25} aria-hidden="true" /></button>
      </form>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `MessageBubble`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `from` | `"user" \| "assistant"` | `"assistant"` | Who wrote it. Decides the side, the color and where the tail points. |
| `children` | `ReactNode` | — | The message. Text wraps; links, emphasis and inline code are fine. |
| `position` | `"single" \| "first" \| "middle" \| "last"` | `"single"` | Place inside a run of bubbles from the same sender. `MessageBubbleGroup` sets it for you. |
| `timestamp` | `string` | — | Time shown under the bubble, already formatted (for example "9:41"). |
| `status` | `"sending" \| "sent" \| "delivered" \| "read" \| "failed"` | — | Delivery state shown as ticks after the timestamp. Each new tick draws itself in. |
| `typing` | `boolean` | `false` | Shows three bouncing dots instead of the content while the other side is writing. |
| `tail` | `boolean` | `true` | Draws the tail on a single or last bubble. |
| `animateIn` | `boolean` | `true` | Pops the bubble in from its tail corner when it mounts. Turn it off for history that is already there. |
| `author` | `string` | — | Name read by screen readers before the message. Defaults to "You" or "Assistant". |
| `className` | `string` | — | Extra class for the row element. |

### `MessageBubbleGroup`

A run of bubbles from one sender. It spaces them tightly and gives each its place, so only the last one carries the tail.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `from` | `"user" \| "assistant"` | `"assistant"` | Sender of every bubble in the group. |
| `children` (required) | `ReactNode` | — | `MessageBubble` elements, as direct children. Each one gets its `from` and `position` from the group. |
| `label` | `string` | — | Accessible name of the group, for example "Messages from Dana". |
| `className` | `string` | — | Extra class for the group element. |

### Exported types

| Type | Definition |
| --- | --- |
| `MessageBubbleFrom` | `"user" \| "assistant"` |
| `MessageBubblePosition` | `"single" \| "first" \| "middle" \| "last"` |
| `MessageBubbleStatus` | `"sending" \| "sent" \| "delivered" \| "read" \| "failed"` |

## Accessibility

- Each bubble starts with the author for screen readers only (“You”, “Assistant” or the `author` you pass), and the delivery state has a hidden text equivalent to the ticks.
- The typing dots are a `role="status"` with `aria-label` “Typing”; `MessageBubbleGroup` is a `role="group"` that gets its name from `label`.
- The bubble does not create a live region for new messages: put the list in a container with that role, such as `message-scroller`, which uses `role="log"`.

## Motion

- The bubble emerges from the tail corner, growing and rising with a spring with a slight bounce; `animateIn={false}` turns this off for history.
- Each new tick draws itself when `status` changes (those already there on mount do not repeat); `sending` shows a small spin and `typing`, three dots in a wave.
- With “reduce motion” on, the bubble and ticks only fade, and the spin and dots stay still.

## Responsive behavior

- The bubble takes at most 82% of the container width, up to 34rem; the text preserves line breaks and breaks long words.

## Notes for AI

- Group consecutive messages from the same sender in a `MessageBubbleGroup from="user"`: it sets `from` and `position` on each child, which must be direct `MessageBubble`s (a wrapper in between breaks this).
- `timestamp` arrives already formatted (for example “9:41”) and `status` draws the ticks; in a group, pass both only on the last bubble, as the demo does.
- For the typing indicator, render a bubble with `typing` and swap it for the message when the text arrives; outside groups, `position` and `tail` control corners and tail.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/message-bubble · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
