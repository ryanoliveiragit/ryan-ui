# Loading states

> Indicadores de que a IA está pensando: texto cintilante, pontinhos que saltam, frases que se alternam e contador de etapas.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/loading-states
- Original description: Thinking indicators for AI interfaces: shimmering text, bouncing dots, a rotating status phrase beside an orbiting mark, and a step counter with rolling digits and pips.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/loading-states.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/loading-states.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/loading-states.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/loading-states.json`. Registry path, relative to the site address: `r/loading-states.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/loading-states/loading-states.tsx`
  - `components/ryan-ui/loading-states/loading-states.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/loading-states.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- The interval in which the AI has already received the request and has nothing to show yet.
- `ThinkingDots` inside a chat bubble and `ThinkingShimmer` inline, at the point where the reply will start.
- Longer waits: `ThinkingPhrases` alternates status phrases and `ThinkingSteps` shows “Step 2 of 5” when the number of steps is known.

## When not to use

- Use [`loader`](loader.md) for generic loading outside AI conversations: spinner, dots, bars, ring and orbit in three sizes.
- Use [`skeleton`](skeleton.md) when you can reserve the shape of the content that will arrive.
- Use [`todo-list`](todo-list.md) or [`agent-activity`](agent-activity.md) when each agent step needs to appear with a name and state.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ThinkingDots, ThinkingPhrases, ThinkingShimmer, ThinkingSteps } from "@/components/ryan-ui/loading-states/loading-states";
import { Caption } from "./_kit";
import styles from "./loading-states.module.css";

const plan = ["Reading the brief", "Searching 12 sources", "Comparing prices", "Drafting the summary", "Checking the numbers"];

function Panel({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className={styles.panel}>
      <div className={styles.stage}>{children}</div>
      <Caption>{name}</Caption>
    </div>
  );
}

export default function LoadingStatesDemo() {
  const [step, setStep] = useState(1);
  useEffect(() => {
    const timer = window.setInterval(() => setStep(current => (current % plan.length) + 1), 1900);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className={styles.grid}>
      <Panel name="Shimmer: a reply is about to start">
        <ThinkingShimmer />
      </Panel>
      <Panel name="Dots: someone is typing">
        <span className={styles.bubble}><ThinkingDots /></span>
      </Panel>
      <Panel name="Phrases: a longer wait">
        <ThinkingPhrases phrases={["Thinking", "Reading your files", "Comparing three approaches", "Writing the answer"]} interval={2000} />
      </Panel>
      <Panel name="Steps: a plan with a known length">
        <ThinkingSteps className={styles.fill} current={step} total={plan.length} label={plan[step - 1]} />
      </Panel>
    </div>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ThinkingShimmer`

"Thinking…" with a sheen that sweeps across the letters. The quietest indicator: use it inline, where a reply is about to start.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `"Thinking…"` | The text the sheen runs across. |
| `duration` | `number` | `1.7` | Seconds one pass of the sheen takes. |
| `className` | `string` | — | Class name added to the root element. |

### `ThinkingDots`

Three dots that bounce in a wave, the classic "someone is typing" signal.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `"Thinking"` | Accessible name of the indicator; also shown next to the dots when `showLabel` is set. |
| `showLabel` | `boolean` | `false` | Shows the label as text after the dots. |
| `className` | `string` | — | Class name added to the root element. |

### `ThinkingPhrases`

A status phrase that changes every few seconds beside a small orbiting mark, for waits long enough that one word would feel stuck.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `phrases` | `string[]` | `defaultPhrases` | Status phrases to rotate through, in order. |
| `interval` | `number` | `2200` | Milliseconds each phrase stays. |
| `className` | `string` | — | Class name added to the root element. |

### `ThinkingSteps`

"Step 2 of 5" with one pip per step: finished pips fill, the current one breathes, and the number rolls when the step changes.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `current` (required) | `number` | — | The step in progress, counted from 1. |
| `total` (required) | `number` | — | How many steps there are. |
| `label` | `string` | — | What the current step is doing. |
| `className` | `string` | — | Class name added to the root element. |

### `LoadingStates`

Indicators for the moments an AI is working and has nothing to show yet. One component with four variants; each variant is also exported on its own (`ThinkingShimmer`, `ThinkingDots`, `ThinkingPhrases`, `ThinkingSteps`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"shimmer" \| "dots" \| "phrases" \| "steps"` | `"shimmer"` | Which indicator to show. |
| `label` | `string` | — | Text of the shimmer, name of the dots, or description of the current step. |
| `phrases` | `string[]` | — | Phrases for the "phrases" variant. |
| `interval` | `number` | — | Milliseconds each phrase stays, for the "phrases" variant. |
| `current` | `number` | `1` | Current step, counted from 1, for the "steps" variant. |
| `total` | `number` | `4` | Number of steps, for the "steps" variant. |
| `className` | `string` | — | Class name added to the root element. |

## Accessibility

- Each indicator is a `role="status"`; in the dots and steps the drawing is `aria-hidden`, and the accessible name is the `label` or “Step N of M” followed by the `label`.
- In `ThinkingPhrases` the phrase sits inside the `role="status"`, so each change is a live region update: prefer short phrases and a generous `interval`.
- The default texts (“Thinking…”, the four phrases, “Step … of …”) are in English: `label` and `phrases` are translatable, the “Step N of M” is not.

## Motion

- A shimmer sweeps across the letters (`ThinkingShimmer`), three dots rise in a wave (`ThinkingDots`), a dot orbits a ring beside the phrase (`ThinkingPhrases`) and the current step's pip pulses (`ThinkingSteps`).
- Phrases, step number and label swap by rising from a light blur and leaving upward; the pips fill with a spring without overshoot.
- With “reduce motion” on, each indicator becomes a still, readable state: text without shimmer, still dots and orbit, and immediate text swaps.

## Responsive behavior

- Phrases and the step label stay on one line and truncate with an ellipsis; `ThinkingSteps` shows one pip per step up to 8 steps and, above that, a single bar.

## Performance

- Only `ThinkingPhrases` uses a timer (one `setInterval`, with a minimum of 600 ms); the other indicators are CSS animations.

## Notes for AI

- Import the variant directly (`ThinkingShimmer`, `ThinkingDots`, `ThinkingPhrases`, `ThinkingSteps`) or use `LoadingStates` with `variant`; `showLabel` and `duration` exist only on the individual components.
- `ThinkingSteps` is controlled: pass `current` (starting at 1) and `total`, and change `label` on each step; out-of-range values are clamped to the valid range.
- Mount the indicator only while waiting and swap it for the content when the reply starts; `ai-sidebar` and `chat-app` already depend on this item.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/loading-states · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
