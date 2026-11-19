# Streaming response

> Texto que chega palavra por palavra, com cursor e desfoque suave, e controles para pausar, pular e repetir.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/streaming-response
- Original description: Text that streams in word by word behind a caret, each word rising out of a soft blur, with pause, skip and replay controls; reduced motion shows the full text.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/streaming-response.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/streaming-response.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/streaming-response.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/streaming-response.json`. Registry path, relative to the site address: `r/streaming-response.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/streaming-response/streaming-response.tsx`
  - `components/ryan-ui/streaming-response/streaming-response.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/streaming-response.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Show a model's reply arriving word by word, with natural pauses at commas, sentence ends and between paragraphs.
- Real streams: if `text` grows with the new chunk appended at the end, the reveal continues from where it was instead of restarting.
- Demos and onboarding where the person can pause, skip to the end or replay the reply from the status line.

## When not to use

- Use [`message`](message.md) for replies that are already complete, with Markdown and copy, replay and rate actions; here the text is plain, split only into paragraphs.
- Use [`text-reveal`](text-reveal.md) to reveal a short piece of interface with restrained motion, without a cursor or controls.
- Use [`loading-states`](loading-states.md) while no word has arrived yet.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { StreamingResponse } from "@/components/ryan-ui/streaming-response/streaming-response";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./streaming-response.module.css";

export const stage: DemoStage = { height: 560 };

const answer = `Start by replacing fixed durations with springs. A spring has no set length: it reacts to where the element is and how fast it is already moving, so an interrupted animation carries on smoothly instead of snapping back to the start.

Next, give related elements a small stagger. Thirty to forty milliseconds between list rows is enough for the eye to read an order without the interface feeling slow.

Finally, keep exits shorter than entrances. People wait for what is arriving and rarely for what is leaving, so a quick fade out keeps the whole screen feeling responsive.`;

const speeds = { calm: 8, natural: 16, fast: 42 } as const;
type Pace = keyof typeof speeds;

export default function StreamingResponseDemo() {
  const [pace, setPace] = useState<Pace>("natural");
  return (
    <Stack width={560} gap={3}>
      <Surface padding={6} style={{ minHeight: 372, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>How do I make my animations feel less robotic?</p>
        <StreamingResponse className={styles.fill} text={answer} speed={speeds[pace]} />
      </Surface>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
        <SegmentedControl
          label="Pace"
          value={pace}
          onValueChange={value => setPace(value as Pace)}
          options={[{ value: "calm", label: "Calm" }, { value: "natural", label: "Natural" }, { value: "fast", label: "Fast" }]}
        />
        <Caption>{speeds[pace]} words per second. The pace changes mid-stream.</Caption>
      </div>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `StreamingResponse`

Text that arrives word by word, the way a model response does: each word fades up out of a soft blur behind a caret, the pace breathes at punctuation, and the caret leaves when the text settles. The status line can pause, skip to the end or replay. With reduced motion the whole text is shown at once.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` (required) | `string` | — | The text to stream. Blank lines split it into paragraphs. If the text grows (a real stream appending to it), the reveal carries on from where it is; any other change starts over. |
| `speed` | `number` | `16` | Words revealed per second. Sentence ends and commas add a short natural pause. |
| `playing` | `boolean` | — | Whether the stream is running (controlled). Set it to false to hold the text where it is. |
| `defaultPlaying` | `boolean` | `true` | Whether the stream starts running on mount (uncontrolled). |
| `onPlayingChange` | `(playing: boolean) => void` | — | Called when the built-in controls pause, resume or replay the stream. |
| `instant` | `boolean` | `false` | Shows the whole text at once with no stream, for a response that had already finished. |
| `controls` | `boolean` | `true` | Shows the status line with the progress, pause, skip and replay controls. |
| `caret` | `boolean` | `true` | Shows the caret while text is arriving. |
| `onProgress` | `(shown: number, total: number) => void` | — | Called as words appear, with the number of words shown and the total. |
| `onComplete` | `() => void` | — | Called once per run when the last word has appeared. |
| `className` | `string` | — | Class name added to the root element. |

### Other exports

- `takeWords` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the status line controls, pauses or resumes, skips to the end or replays; pause and skip are disabled when the text finishes. |

## Accessibility

- The animated words are `aria-hidden`; a hidden copy holds the whole text from the start, so the screen reader reads the complete reply, not one word at a time.
- The status line is a `role="status"` with “Streaming”, “Paused” or “Complete” and, at the end, the total word count; the icon-only buttons have a fixed English `aria-label` and `title`.
- With `controls={false}` there is no status line: nothing announces that the reply has finished, so notify in another way if that matters.

## Motion

- Each word rises from a soft blur behind a cursor; the pace slows at commas, sentence ends and between paragraphs.
- The cursor breathes lightly while words arrive, blinks on pause and disappears at the end; a thin bar above the status line shows progress.
- With “reduce motion” on, the whole text appears at once and the pause, skip and replay buttons disappear; the status line shows “Complete”.

## Responsive behavior

- In a container stretched into a column, the status line stays at the bottom while the text grows above it, and wraps onto two lines when width runs short.

## Performance

- Each word is a `<span>` and each step is a `setTimeout` followed by a re-render; for long replies that have already finished, pass `instant`.

## Notes for AI

- In a real stream, pass the accumulated text in `text`: appending at the end continues the reveal, but any other change restarts from zero; single line breaks become spaces.
- `onComplete` fires once per run, as soon as all the words received so far have appeared; if the stream pauses between chunks, it fires before the real end, so use your own end signal.
- When stopping a stream midway, keep only what the person saw with `takeWords(text, shown)`, using the number that came from `onProgress`; for history, use `instant`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/streaming-response · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
