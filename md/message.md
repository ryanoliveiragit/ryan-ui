# Message

> Mensagem completa do assistente, com avatar, nome, texto formatado e ações de copiar, refazer e avaliar ao passar o mouse.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/message
- Original description: A full assistant message row with avatar, name and formatted content that staggers in, plus a copy, retry and rate bar that steps in on hover or focus.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/message.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/message.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/message.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/message.json`. Registry path, relative to the site address: `r/message.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/message/message.tsx`
  - `components/ryan-ui/message/message.module.css`
  - `components/ryan-ui/lib/use-copy-feedback.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/message.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- The assistant's reply in a conversation where it does not use a bubble: avatar, name, formatted text and actions below.
- Replies with lists, headings, code, bold and links: `content` accepts a small subset of Markdown.
- When each reply needs copy, retry and rating with thumbs up or down.

## When not to use

- Use [`message-bubble`](message-bubble.md) for the person's messages and for bubble-style conversations.
- Use [`streaming-response`](streaming-response.md) while the text is still arriving word by word.
- Use [`chat-thread`](chat-thread.md) or [`comment-thread`](comment-thread.md) for conversations between people, with reactions, replies and read receipts.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import Message from "@/components/ryan-ui/message/message";
import type { MessageRating } from "@/components/ryan-ui/message/message";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 560 };

const answers = [
  `The deploy failed because the build ran out of memory while bundling the dashboard. Nothing is wrong with your code.

Here is what I would do:

1. Raise the limit with \`NODE_OPTIONS=--max-old-space-size=4096\` in the build settings.
2. Split the charts page with \`import()\` so it stops loading in the main bundle.
3. Run the build again and compare the **bundle report** with last week's.

The second step also cuts about 180 kB from the first load, so it is worth doing even if the first one fixes the build.`,
  `Short version: the bundler hit the 2 GB memory ceiling. Two changes fix it.

- Set \`NODE_OPTIONS=--max-old-space-size=4096\` for the build step.
- Load the charts page lazily with \`import()\`.

After that, the **bundle report** should show the dashboard chunk under 400 kB.`,
];
const feedback: Record<string, string> = { up: "Thanks, marked as a good answer.", down: "Noted, marked as a bad answer." };

export default function MessageDemo() {
  const [version, setVersion] = useState(0);
  const [rating, setRating] = useState<MessageRating>(null);
  const [note, setNote] = useState("Hover the message, or tab into it, to reach the actions.");
  return (
    <Stack width={560} gap={5}>
      <Message
        key={version}
        name="Atlas"
        meta={version === 0 ? "Answered in 4 s" : `Version ${version + 1}`}
        content={answers[version % answers.length]}
        rating={rating}
        onRatingChange={next => { setRating(next); setNote(next ? feedback[next]! : "Rating cleared."); }}
        onCopy={text => setNote(`Copied ${text.length} characters to the clipboard.`)}
        onRetry={() => { setVersion(current => current + 1); setRating(null); setNote("Wrote another version of the answer."); }}
      />
      <Caption>{note}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Message`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | `"Assistant"` | Sender name shown next to the avatar. |
| `avatarSrc` | `string` | — | Image URL for the avatar. Without it (and without `avatar`) a spark mark on the accent is shown. |
| `avatar` | `ReactNode` | — | Custom avatar element, for a logo or initials. Wins over `avatarSrc`. |
| `meta` | `string` | — | Small note after the name, such as the model or the time. |
| `content` | `string` | `""` | Message text in the small Markdown subset described above. |
| `children` | `ReactNode` | — | Custom content. When given, `content` is only used as the text to copy. |
| `actions` | `"hover" \| "always" \| "none"` | `"hover"` | When the action bar shows: on hover or focus, always, or never. Touch screens always show it. |
| `onCopy` | `(text: string) => void` | — | Called after the message text was copied. |
| `onRetry` | `() => void` | — | Called when the person asks for another answer. The retry button is hidden without it. |
| `rating` | `"up" \| "down" \| null` | — | Controlled rating. |
| `defaultRating` | `"up" \| "down" \| null` | `null` | Rating the message starts with when uncontrolled. |
| `onRatingChange` | `(rating: MessageRating) => void` | — | Called when the person rates the answer or clears the rating. The rating buttons are hidden when neither this nor a rating prop is given. |
| `animateIn` | `boolean` | `true` | Staggers the content blocks in when the message mounts. Turn it off for history. |
| `className` | `string` | — | Extra class for the root element. |

### Exported types

| Type | Definition |
| --- | --- |
| `MessageRating` | `"up" \| "down" \| null` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Moves through the links, the code blocks (focusable for scrolling) and each action button; focus inside the row makes the toolbar appear. |
| `Enter` or `Space` | Activates the focused action: copy, retry or rate; repeating the same rating clears it. |
| `←` or `→` | With focus on a wide code block, scroll the code horizontally (native scrolling). |

## Accessibility

- The root is an `<article>` with `aria-label` “Message from” plus the `name`; the avatar is `aria-hidden`.
- The toolbar is a `role="toolbar"` in which each button has an `aria-label`; the rating buttons use `aria-pressed`, and a `role="status"` region announces “Message copied”.
- On touch screens the toolbar is always visible; with a mouse it appears on hover or when focus enters the row, and a rating already given stays visible.

## Motion

- On mount, the content blocks enter in sequence, rising from a light blur; `animateIn={false}` turns this off.
- The toolbar buttons enter one after another, the copy icon turns into a check mark, the retry icon makes a turn with a spring and the chosen thumb makes a small hop.
- With “reduce motion” on, the blocks only fade, with no delay between them, the icons swap with a fade and there is no turn or hop.

## Responsive behavior

- The grid has the avatar column and a flexible column; long text wraps at any point and the code blocks scroll horizontally instead of widening the page.

## Notes for AI

- Pass the text in `content` (paragraphs, lists, headings with `#`, blocks between triple backticks, inline code, `**negrito**` and links `http`, `https`, `mailto`, `/` or `#`); tables and italics come out as plain text.
- The retry button only exists with `onRetry`, and the rating ones only with `onRatingChange`, `defaultRating` or `rating={…}` (`rating={null}` counts); `actions="always"` or `"none"` pins or hides the toolbar.
- With `children`, you render the content and `content` becomes just the text to copy; in long histories, pass `animateIn={false}`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/message · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
