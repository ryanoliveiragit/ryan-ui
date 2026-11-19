# Todo list

> Lista do plano de um agente: cada etapa passa de pendente para em andamento e concluída, com contagem de progresso.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/todo-list
- Original description: An agent plan checklist whose steps move from pending to running with a shimmer to done with a drawn check and strike-through, under a live progress count.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/todo-list.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/todo-list.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/todo-list.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/todo-list.json`. Registry path, relative to the site address: `r/todo-list.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/todo-list/todo-list.tsx`
  - `components/ryan-ui/todo-list/todo-list.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/todo-list.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Show an agent's plan as a list in which each step advances from pending to in progress and then to done.
- Plans of known size, where it is worth showing “2 of 5” and a progress bar in the header.
- Compact transcripts: collapsed, the list becomes a line that still shows the step in progress.

## When not to use

- Use [`agent-activity`](agent-activity.md) when steps appear during the work, collect findings in chips or need a duration and an error state.
- Use [`stepper`](stepper.md) to show which stage of a flow the person themselves is in.
- Use [`onboarding-checklist`](onboarding-checklist.md) when the person is the one who checks off tasks; here the steps are not clickable.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useEffect, useState } from "react";
import TodoList from "@/components/ryan-ui/todo-list/todo-list";
import type { TodoItem } from "@/components/ryan-ui/todo-list/todo-list";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 520 };

const plan = [
  { id: "repro", label: "Reproduce the failing checkout test", detail: "Ran checkout.spec.ts 20 times: 3 failures", time: 1500 },
  { id: "read", label: "Read the payment mock and its timers", detail: "Reading tests/mocks/payment.ts", time: 1900 },
  { id: "fix", label: "Replace the fixed delay with an awaited event", detail: "Editing 2 files", time: 2200 },
  { id: "verify", label: "Run the checkout suite 50 times", detail: "Run 31 of 50, no failures so far", time: 2600 },
  { id: "pr", label: "Open a pull request with the fix", detail: "Writing the description", time: 1600 },
];

export default function TodoListDemo() {
  /** Index of the step in progress; `plan.length` means every step is done. */
  const [step, setStep] = useState(1);
  const [paused, setPaused] = useState(false);
  const finished = step >= plan.length;

  useEffect(() => {
    if (paused || finished) return;
    const timer = window.setTimeout(() => setStep(current => current + 1), plan[step]!.time);
    return () => window.clearTimeout(timer);
  }, [finished, paused, step]);

  const items: TodoItem[] = plan.map((item, index) => ({ id: item.id, label: item.label, detail: item.detail, status: index < step ? "done" : index === step ? "running" : "pending" }));

  return (
    <Stack width={440} gap={4}>
      <TodoList title="Fix the flaky checkout test" items={items} />
      <Row justify="space-between">
        <Row gap={2}>
          <Button size="sm" variant="secondary" onClick={() => { setStep(0); setPaused(false); }}>Run again</Button>
          <Button size="sm" variant="ghost" disabled={finished} onClick={() => setPaused(current => !current)}>{paused ? "Resume" : "Pause"}</Button>
        </Row>
        <Caption>{finished ? "Plan complete." : paused ? "Paused." : "The agent is working…"}</Caption>
      </Row>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `TodoList`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `TodoItem[]` | — | The steps, in order. Change an item's `status` to move it along. |
| `title` | `string` | `"Plan"` | Heading of the list. |
| `showProgress` | `boolean` | `true` | Shows the "2 of 5" count and the progress bar. |
| `open` | `boolean` | — | Controlled open state of the list. |
| `defaultOpen` | `boolean` | `true` | Whether the list starts open when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the header is pressed. |
| `className` | `string` | — | Extra class for the root element. |

### Exported types

| Type | Definition |
| --- | --- |
| `TodoStatus` | `"pending" \| "running" \| "done"` |

#### `TodoItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable id, used as the key. |
| `label` (required) | `string` | What the step does. |
| `status` (required) | `"pending" \| "running" \| "done"` | Where the step stands. |
| `detail` | `string` | A line shown under the label while the step runs, such as the file being read. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the header, collapses or opens the list; it is the component's only control. |

## Accessibility

- The header is a `<button>` with `aria-expanded` and `aria-controls`; collapsed, it shows the step in progress, so the button's name keeps saying what is happening.
- The count is an `aria-live="polite"` region that reads “N of M steps done”, and the bar is a `role="progressbar"` with `aria-valuenow` equal to the done count and `aria-valuemax` equal to the total.
- Each step starts with its state for screen readers only (“To do:”, “In progress:”, “Done:”); these texts, “All steps done” and the word “progress” in the bar's label are fixed in English.

## Motion

- The step in progress gets a spinner and a shimmer that runs across the label; on completion, the check mark lands with a small bounce and draws itself, and a strike crosses the label from left to right.
- On mount the steps rise in sequence; steps added later open to their own height, the bar advances with a spring and the done count rolls.
- With “reduce motion” on, everything only fades: the spinner stays still, there is no shimmer or check mark drawing, and the strike appears at once.

## Responsive behavior

- Fills 100% of the parent; collapsed, the current step in the header truncates with an ellipsis on one line, and when open the step labels wrap.

## Notes for AI

- It is data-driven: pass `items` with a stable `id` and change each one's `status` (`pending`, `running`, `done`); there is no error state or duration.
- `detail` only appears while the step is `running`: use it for the file or command of that moment.
- It starts open; use `defaultOpen={false}` or the `open` and `onOpenChange` pair to collapse it, and `showProgress={false}` to remove the count and the bar.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/todo-list · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
