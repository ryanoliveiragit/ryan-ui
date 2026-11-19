# Agent activity

> Linha do tempo ao vivo do que o agente está fazendo: a etapa atual pulsa e as concluídas se recolhem num resumo.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/agent-activity
- Original description: A live timeline of an agent at work: the current step pulses and collects what it finds as chips, and finished steps fold into one summary row that opens again.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/agent-activity.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/agent-activity.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/agent-activity.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/agent-activity.json`. Registry path, relative to the site address: `r/agent-activity.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/agent-activity/agent-activity.tsx`
  - `components/ryan-ui/agent-activity/agent-activity.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/agent-activity.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Show live what an agent is doing on a long task: each step has a type (`search`, `read`, `write`, `think`, `run`) that picks the icon.
- Steps that collect short findings, such as files, sites or results: they appear as chips, one by one, as the `items` list grows.
- Runs with many steps, where finished steps should fold into a single line with a count and total time, and reopen on demand.

## When not to use

- Use [`todo-list`](todo-list.md) when the whole plan is known from the start and you only need to mark each step as pending, in progress or done.
- Use [`tool-result`](tool-result.md) when you need to show the full input and output of each tool call.
- Use [`loading-states`](loading-states.md) for a short wait, with no steps to list.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { AgentActivity } from "@/components/ryan-ui/agent-activity/agent-activity";
import type { AgentStep } from "@/components/ryan-ui/agent-activity/agent-activity";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 600 };

/** Milliseconds between two things happening in the simulated run. */
const BEAT = 620;

const script: Omit<AgentStep, "status" | "duration">[] = [
  { id: "search", kind: "search", title: "Searching the codebase", detail: 'grep "rate limit" src/server', items: ["middleware.ts", "redis.ts", "billing.ts"] },
  { id: "read", kind: "read", title: "Reading 3 files", detail: "src/server", items: ["middleware.ts · 84 lines", "redis.ts · 31 lines", "billing.ts · 127 lines"] },
  { id: "plan", kind: "think", title: "Planning the change", detail: "Limits per plan, stored next to billing" },
  { id: "write", kind: "write", title: "Editing rate-limit.ts", detail: "+10 −6", items: ["rate-limit.ts", "rate-limit.test.ts"] },
  { id: "test", kind: "run", title: "Running the tests", detail: "vitest run src/server", items: ["14 passed"] },
];

/** Every step takes one beat to start, one per item it collects, and one to finish. */
const beatsOf = (step: (typeof script)[number]) => (step.items?.length ?? 0) + 2;
const totalBeats = script.reduce((sum, step) => sum + beatsOf(step), 0);

function stepsAt(beat: number): AgentStep[] {
  let start = 0;
  return script.map(step => {
    const length = beatsOf(step);
    const local = beat - start;
    start += length;
    if (local <= 0) return { ...step, status: "pending", items: undefined };
    if (local >= length) return { ...step, status: "done", duration: length * BEAT };
    return { ...step, status: "running", items: step.items?.slice(0, local - 1) };
  });
}

export default function AgentActivityDemo() {
  const [beat, setBeat] = useState(1);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setBeat(current => (current >= totalBeats ? current : current + 1)), BEAT);
    return () => window.clearInterval(timer);
  }, [run]);
  const steps = useMemo(() => stepsAt(beat), [beat]);
  const finished = beat >= totalBeats;

  return (
    <Stack width={460} gap={3} style={{ minHeight: 520 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
        <Caption>{finished ? "Open the summary row to read the finished steps." : "Finished steps fold into the summary row."}</Caption>
        <Button size="sm" variant="secondary" style={{ flex: "none" }} onClick={() => { setBeat(1); setRun(current => current + 1); }}>
          <RotateCcw size={14} aria-hidden="true" />
          Run again
        </Button>
      </div>
      <AgentActivity key={run} title="Add rate limits per plan" steps={steps} />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AgentActivity`

A live timeline of what an agent is doing. The step in progress pulses and collects what it finds as chips; a step that finishes leaves the live list and folds into one summary row that counts steps and time, which opens to show them again.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` (required) | `AgentStep[]` | — | The steps in order. Update their status as the agent works. |
| `title` | `string` | `"Agent activity"` | Heading of the timeline: usually the task the agent was given. |
| `expanded` | `boolean` | — | Whether the finished steps are shown in full (controlled). |
| `defaultExpanded` | `boolean` | `false` | Whether the finished steps start shown in full (uncontrolled). By default they fold into one summary row. |
| `onExpandedChange` | `(expanded: boolean) => void` | — | Called when the summary row opens or closes the finished steps. |
| `className` | `string` | — | Class name added to the root element. |

### Exported types

| Type | Definition |
| --- | --- |
| `AgentStepKind` | `"search" \| "read" \| "write" \| "think" \| "run"` |
| `AgentStepStatus` | `"pending" \| "running" \| "done" \| "error"` |

#### `AgentStep`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable id of the step. |
| `kind` (required) | `"search" \| "read" \| "write" \| "think" \| "run"` | What kind of work the step is; it picks the icon. |
| `title` (required) | `string` | What the agent is doing, in a few words: "Searching the codebase". |
| `detail` | `string` | One line of detail: the query, the file, the command. |
| `items` | `string[]` | Short things the step found or touched (file names, sites, results). They appear as chips, one by one as the list grows. |
| `status` (required) | `"pending" \| "running" \| "done" \| "error"` | Where the step is. |
| `duration` | `number` | How long the step took, in milliseconds. Shown once it has finished. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | With focus on the summary line, opens or closes the list of finished steps. |
| `Tab` | Moves focus to the summary line, the component's only control; it exists only after the first step finishes. |

## Accessibility

- The root is a `<section>` with `aria-label` equal to `title`; the summary is a `<button>` with `aria-expanded` and `aria-controls`, and the collapsed list is `inert`.
- An invisible `role="status"` region announces the title of the running step and, at the end, how many steps finished; pending and failed steps get a screen-reader-only suffix.
- The fixed texts (“steps finished”, “Done”, “(waiting)”, “(failed)”) are in English in the code and have no translation prop.

## Motion

- On the running step, a ring pulses around the icon and a shimmer runs across the title; chips enter one by one with a short spring, without overshoot.
- When a step finishes, it leaves the live list and folds into the summary line with a height spring, while the finished count rolls to the new value.
- With “reduce motion” on, the pulse, shimmer and spin stop, heights change instantly and chips appear without animation.

## Responsive behavior

- Fills 100% of the parent's width: the header and each step's `detail` truncate with an ellipsis on one line, while the step title and chips wrap.

## Notes for AI

- It is data-driven: pass `steps` with a stable `id` and update `status` (`pending`, `running`, `done`, `error`), `items` and `duration` while the agent works; the component does not measure time itself.
- Each text in `items` is used as the chip's `key`: do not repeat the same text within a step.
- Finished steps start collapsed; use `defaultExpanded` or the `expanded` and `onExpandedChange` pair to open them, for example when a step ends with `error`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/agent-activity · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
