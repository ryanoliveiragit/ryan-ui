# Stepper

> Indicador de etapas de um fluxo, com estados de concluída, atual, pendente e com erro.

- Type: component (category Feedback)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/stepper
- Original description: Show where a person is in a multi-step flow and what is done.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/stepper.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/stepper.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/stepper.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/stepper.json`. Registry path, relative to the site address: `r/stepper.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/stepper/stepper.tsx`
  - `components/ryan-ui/stepper/stepper.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/stepper.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Show which step of a checkout, sign-up, or setup the user is on, above the content (`horizontal`) or beside it (`vertical`).
- Flows where it is possible to go back to a step already done: with `onStepSelect`, completed steps become buttons.
- Flag a step that failed, such as a declined card: `error` swaps the number for an alert and the message takes the place of the description.

## When not to use

- Use [`onboarding-checklist`](onboarding-checklist.md) when the steps can be done in any order and checked by hand.
- Use [`tabs`](tabs.md) when the sections are independent and the user can move back and forth between them freely.
- Use [`adaptive-stepper`](adaptive-stepper.md) to choose a number with minus and plus buttons; despite the similar name, this item indicates steps.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Stepper } from "@/components/ryan-ui/stepper/stepper";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack } from "./_kit";

const steps = [
  { id: "cart", label: "Cart", description: "3 items" },
  { id: "shipping", label: "Shipping", description: "Lisbon, PT" },
  { id: "payment", label: "Payment", description: "Visa 4242" },
  { id: "review", label: "Review", description: "Confirm order" },
];

export default function StepperDemo() {
  const [current, setCurrent] = useState(1);
  const [failed, setFailed] = useState(false);
  const shown = failed ? steps.map(s => (s.id === "payment" ? { ...s, error: "Card declined" } : s)) : steps;
  return (
    <Stack gap={6} width={560}>
      <Stepper steps={shown} current={current} onStepSelect={setCurrent} label="Checkout" completeLabel="Order placed" />
      <Row>
        <Button size="sm" variant="secondary" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>Back</Button>
        <Button size="sm" disabled={current >= steps.length} onClick={() => setCurrent(c => c + 1)}>{current === steps.length - 1 ? "Place order" : "Continue"}</Button>
        <Button size="sm" variant="ghost" onClick={() => setFailed(f => !f)}>{failed ? "Clear error" : "Fail payment"}</Button>
      </Row>
      <Caption>Click a finished step to go back to it.</Caption>
      <Stack gap={2} width={260}>
        <Stepper steps={steps.slice(0, 3)} current={1} orientation="vertical" label="Vertical example" />
      </Stack>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Stepper`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` (required) | `StepperStep[]` | — | — |
| `current` (required) | `number` | — | Index of the step in progress. `steps.length` marks the whole flow complete. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | — |
| `onStepSelect` | `(index: number) => void` | — | Called with the index of a completed step when it is chosen. Without it the stepper is a read-only indicator. |
| `details` | `"all" \| "current"` | `"all"` | `current` shows only the active step's description, for tight spaces. Errors always show. |
| `compact` | `boolean` | `false` | Markers only; labels stay available to assistive tech. Horizontal steppers switch to this below 30rem on their own and show the current step's label underneath. |
| `label` | `string` | `"Progress"` | Accessible name for the stepper. |
| `completeLabel` | `string` | `"All steps complete"` | Announced, and shown in the compact caption, once every step is complete. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `StepperOrientation` | `"horizontal" \| "vertical"` |
| `StepperStatus` | `"complete" \| "current" \| "upcoming" \| "error"` |

#### `StepperStep`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable key, so each step keeps its own motion when the list changes. |
| `label` (required) | `string` | — |
| `description` | `string` | A short hint under the label. |
| `error` | `string` | Marks the step as failed: the marker morphs into an alert and this message replaces the description. |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` or `↑` or `↓` | With `onStepSelect`, move focus between the completed steps and the current one, without wrapping; in right-to-left text, ← and → are swapped. |
| `Home` or `End` | Moves to the first step or to the current step. |
| `Enter` or `Space` | On a completed step, calls `onStepSelect` with its index. |

## Accessibility

- Without `onStepSelect` it is a read-only `role="group"`; with it, it becomes a `<nav>` of buttons. The current step has `aria-current="step"` and each step has its state in hidden text (“Completed”, “Error”).
- An `aria-live="polite"` region announces “Step N of M: label” on each change of `current`, and `completeLabel` at the end; these fixed texts are in English.
- Only completed steps enter the `Tab` order; the current and future ones have `aria-disabled`, and the arrow keys also reach the current one.

## Motion

- On advancing, the line between steps fills with a spring starting from the step that finished; skipping several steps fills one line after another, and the current step's ring appears last.
- A completed step's number shrinks and gives way to a drawn checkmark (on an error, an exclamation mark); new descriptions rise with a slight blur and the height follows.
- With “reduce motion”, lines, markers, and texts change immediately.

## Responsive behavior

- The horizontal one measures its own width (container query): below 30 rem it hides the labels, keeps the markers, and shows the current step's label and description underneath; `compact` forces this mode.
- With `details="current"`, only the current step shows its description, which saves height; errors always appear.

## Notes for AI

- Import from `@/components/ryan-ui/stepper/stepper`. It is controlled by `current`, the index of the step in progress; use `current={steps.length}` to mark the whole flow as completed.
- The stepper only indicates: each step's content and the back and continue buttons are up to you, by changing `current`.
- To go back to completed steps, pass `onStepSelect={setCurrent}`; only indices lower than `current` fire. The error goes on the step itself, in `steps[i].error`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/stepper · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
