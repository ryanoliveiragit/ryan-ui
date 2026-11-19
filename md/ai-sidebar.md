# AI sidebar

> Painel de assistente que desliza ao lado da página, com cabeçalho, mensagens, sugestões e caixa de prompt.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/ai-sidebar
- Original description: A docked assistant panel that springs in beside the page and pushes it aside (or slides over it when narrow), with a header, a message list that follows new messages, suggestion chips and a growing prompt box.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-sidebar.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-sidebar.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-sidebar.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-sidebar.json`. Registry path, relative to the site address: `r/ai-sidebar.json`.

- npm packages: `motion`, `lucide-react`
- Uses other ryan-ui items (installed along with it): [Loading states](loading-states.md)
- Files, once installed:
  - `components/ryan-ui/ai-sidebar/ai-sidebar.tsx`
  - `components/ryan-ui/ai-sidebar/ai-sidebar.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/ai-sidebar.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- An assistant that sits beside the content it comments on (document, dashboard, editor) and pushes the page instead of covering it.
- Short, contextual conversations about the current screen, with ready-made suggestions that send the prompt in one tap.
- Split layouts: the panel chooses between docking and overlaying based on the width of its own container, not the window.

## When not to use

- Use [`chat-app`](chat-app.md) when the conversation is the whole screen, with a conversation list and replies that can be stopped or redone.
- Use [`drawer`](drawer.md) for a temporary side panel that is not a conversation.
- Use [`prompt-input`](prompt-input.md) with [`message-scroller`](message-scroller.md) when you need attachments, a model menu or a stop button: the prompt box built in here only sends text.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { AiSidebar } from "@/components/ryan-ui/ai-sidebar/ai-sidebar";
import type { AiSidebarMessage } from "@/components/ryan-ui/ai-sidebar/ai-sidebar";
import { StreamingResponse } from "@/components/ryan-ui/streaming-response/streaming-response";
import { Button } from "@/components/ryan-ui/button/button";
import type { DemoStage } from "./_kit";
import styles from "./ai-sidebar.module.css";

export const stage: DemoStage = { layout: "fill", height: 600 };

const suggestions = ["Summarize this plan", "What are the risks?", "Draft the kickoff email"];

const replies: Record<string, string> = {
  "Summarize this plan": "The plan ships usage-based billing in three phases over eight weeks: metering in weeks 1 to 3, the new invoices in weeks 4 to 6, and a gradual rollout in weeks 7 and 8.\n\nSuccess means fewer than 2% of invoices needing a manual correction in the first month.",
  "What are the risks?": "Two stand out. Metering depends on the events pipeline, which dropped data twice last quarter, so the plan needs a reconciliation job before invoices go out.\n\nThe second is support load: customers moving from seats to usage will ask about their first bill, and the help articles are not scheduled until week 7.",
  "Draft the kickoff email": "Subject: Usage-based billing kicks off Monday\n\nHi team, we start the eight week build on Monday. Daniel owns metering, Olivia owns invoices and Sofia runs the rollout. The first checkpoint is the metering demo on Friday of week 3. Reply here with anything that could block your part.",
};
const fallback = "I can only see this page. From what is written here, the closest answer is in the timeline section: the rollout starts in week 7 with ten percent of accounts and widens once the invoice error rate stays under the target.";

export default function AiSidebarDemo() {
  const [open, setOpen] = useState(() => (typeof window === "undefined" ? true : window.matchMedia("(min-width: 900px)").matches));
  const [messages, setMessages] = useState<AiSidebarMessage[]>([]);
  const [pending, setPending] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const count = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const send = (text: string) => {
    const id = ++count.current;
    setMessages(current => [...current, { id: `user-${id}`, role: "user", content: text }]);
    setPending(true);
    timer.current = window.setTimeout(() => {
      setPending(false);
      setMessages(current => [...current, { id: `assistant-${id}`, role: "assistant", content: <StreamingResponse className={styles.reply} text={replies[text] ?? fallback} speed={22} controls={false} /> }]);
    }, 1100);
  };

  return (
    <div className={styles.frame}>
      <AiSidebar open={open} onOpenChange={setOpen} messages={messages} pending={pending} suggestions={suggestions} onSend={send} title="Assistant" subtitle="Reading: Usage-based billing plan" launcher={false}>
        <article className={styles.page}>
          <div className={styles.bar}>
            <span className={styles.crumb}>Projects / Billing</span>
            <Button size="sm" variant={open ? "secondary" : "primary"} onClick={() => setOpen(current => !current)} aria-expanded={open}>
              <Sparkles size={14} aria-hidden="true" />
              {open ? "Hide assistant" : "Ask assistant"}
            </Button>
          </div>
          <h1 className={styles.title}>Usage-based billing plan</h1>
          <p className={styles.lead}>Move every paid workspace from seat pricing to metered usage in eight weeks, without a surprise on anyone's first invoice.</p>
          <h2 className={styles.section}>Timeline</h2>
          <ul className={styles.timeline}>
            <li><span>Weeks 1 to 3</span>Metering: count events per workspace and store daily totals.</li>
            <li><span>Weeks 4 to 6</span>Invoices: new line items, proration and a preview page.</li>
            <li><span>Weeks 7 to 8</span>Rollout: ten percent of accounts first, then everyone.</li>
          </ul>
          <h2 className={styles.section}>Success measure</h2>
          <p className={styles.body}>Fewer than 2% of invoices need a manual correction during the first month after rollout.</p>
        </article>
      </AiSidebar>
    </div>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AiSidebar`

An assistant panel docked beside the page. It slides in on a spring and pushes the page aside; in a narrow container it slides over the page behind a scrim instead. Inside: a header, a message list that follows new messages, suggestion chips and a prompt box that grows with the text. Enter sends, Shift+Enter adds a line, Escape closes.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` | — | The page the assistant docks beside. |
| `messages` (required) | `AiSidebarMessage[]` | — | The conversation, oldest first. |
| `open` | `boolean` | — | Whether the panel is open (controlled). |
| `defaultOpen` | `boolean` | `false` | Whether the panel starts open (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the launcher, the close button or Escape opens or closes the panel. |
| `onSend` | `(text: string) => void` | — | Called with the trimmed text when the person sends a prompt or picks a suggestion. |
| `pending` | `boolean` | `false` | Shows the thinking indicator after the last message and holds the send button. |
| `suggestions` | `string[]` | — | Prompt ideas shown as chips above the prompt box. Picking one sends it. |
| `title` | `string` | `"Assistant"` | Heading of the panel. |
| `subtitle` | `string` | — | Short line under the heading, such as what the assistant can see. |
| `placeholder` | `string` | `"Ask anything"` | Placeholder of the prompt box. |
| `emptyText` | `string` | `"Ask about this page, or start from a suggest…` | Text shown while the conversation is empty. |
| `side` | `"left" \| "right"` | `"right"` | Side the panel docks on. |
| `width` | `number` | `360` | Width of the docked panel in pixels. |
| `overlayBelow` | `number` | `640` | Below this container width in pixels the panel slides over the page instead of pushing it aside. |
| `launcher` | `boolean` | `true` | Shows a floating button that opens the panel while it is closed. Turn it off when the page has its own trigger. |
| `className` | `string` | — | Class name added to the root element. |

### Exported types

#### `AiSidebarMessage`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable id of the message. |
| `role` (required) | `"user" \| "assistant"` | Who wrote it. |
| `content` (required) | `ReactNode` | The message. Text, or any node (a streaming response, a card). |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` | In the prompt box, sends the text; during IME composition it does not send. |
| `Shift + Enter` | Inserts a line break without sending. |
| `Esc` | With focus inside the panel, closes the panel. |
| `Enter` or `Space` | On a suggestion, sends its text as the prompt. |
| `Tab` | Moves through close, suggestions, prompt box and send; with the panel closed, nothing inside it receives focus. |

## Accessibility

- The panel is an `<aside>` labeled by the title; on open, focus goes to the prompt box and, on close, returns to the element that had it before, if it still exists (the built-in `launcher` leaves the DOM when the panel opens, so it does not get focus back).
- The message list is `aria-live="polite"` and each message carries a screen-reader-only prefix; when closed, the panel is `inert`, and when open in overlay mode, the page behind it is `inert`.
- Labels such as “Close”, “Send message”, “Conversation” and “Suggestions” are fixed in English; `title`, `subtitle`, `placeholder` and `emptyText` are yours.

## Motion

- When docked, the panel opens with a width spring and pushes the page; when overlaid, it slides over the page with a fading scrim.
- New messages rise with a slight scale-up, suggestions enter in sequence when the panel opens, and the list scrolls smoothly to the end on each message.
- With “reduce motion” on, the panel, messages and suggestions change state instantly and scrolling to the end is no longer smooth.

## Responsive behavior

- A `ResizeObserver` measures the container: below `overlayBelow` (640 px by default) the panel slides over the page, with width `min(100%, max(width, 320px))`.
- The prompt box grows with the text up to 132 px and then scrolls internally; suggestions stay on a single line, with horizontal scrolling.

## Performance

- There are two `ResizeObserver`s per instance (container and list) and the list is not virtualized: very long conversations weigh on the DOM.

## Notes for AI

- Wrap the page: `children` is the content beside the panel, and the root uses `height: 100%`, so the parent needs a defined height.
- The conversation is yours: pass `messages` (`id`, `role`, `content`), append the message in `onSend` and turn on `pending` until the reply arrives; `content` accepts nodes, such as a `StreamingResponse`.
- Use `open` with `onOpenChange` and `launcher={false}` when the page already has its own button; this item depends on `loading-states` for the `pending` indicator.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/ai-sidebar · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
