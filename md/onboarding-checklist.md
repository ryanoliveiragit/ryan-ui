# Onboarding checklist

> Lista que guia um novo espaço de trabalho pela configuração, um passo de cada vez.

- Type: component (category Feedback)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/onboarding-checklist
- Original description: Guide a new workspace through setup, one step at a time.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/onboarding-checklist.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/onboarding-checklist.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/onboarding-checklist.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/onboarding-checklist.json`. Registry path, relative to the site address: `r/onboarding-checklist.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/onboarding-checklist/onboarding-checklist.tsx`
  - `components/ryan-ui/onboarding-checklist/onboarding-checklist.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/onboarding-checklist.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- The initial setup of an account or workspace, with three to eight steps that can be done in any order.
- Steps the interface itself performs: with `actionLabel` and an asynchronous `onAction`, the button shows loading, marks the step when done, and shows the error message if it fails.
- A welcome card the user can collapse (`defaultHidden`, `onHiddenChange`) and which, at the end, swaps `title` for `doneTitle`.

## When not to use

- Use [`stepper`](stepper.md) when the order is mandatory, such as in a checkout where one step unlocks the next.
- Use [`todo-list`](todo-list.md) to show an AI agent's plan advancing on its own, with the user checking nothing.
- Use [`checkbox`](checkbox.md) for a simple task list, with no details or per-item actions.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { OnboardingChecklist } from "@/components/ryan-ui/onboarding-checklist/onboarding-checklist";
import { Stack } from "./_kit";

const wait = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));
let inviteAttempts = 0;

export default function OnboardingChecklistDemo() {
  return (
    <Stack width={440}>
      <OnboardingChecklist
        title="Set up your workspace"
        defaultCompleted={["profile"]}
        steps={[
          { id: "profile", title: "Create your profile", description: "Add your name and a photo so teammates recognise you." },
          { id: "invite", title: "Invite your team", description: "Send invitations to up to five teammates so you can work together.", actionLabel: "Send invites", onAction: async () => { await wait(900); if (inviteAttempts++ === 0) throw new Error("We could not reach the mail service. Try again."); } },
          { id: "repo", title: "Connect a repository", description: "Link GitHub to see deploys next to your pull requests.", actionLabel: "Connect GitHub", onAction: () => wait(900) },
          { id: "billing", title: "Choose a plan", description: "Pick Starter or Pro. You can change it any time." },
        ]}
      />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `OnboardingChecklist`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` | — | — |
| `doneTitle` | `string` | `"You’re all set"` | Title once every step is done. |
| `steps` (required) | `OnboardingStep[]` | — | — |
| `defaultCompleted` | `string[]` | `[]` | — |
| `onCompletedChange` | `(completed: string[]) => void` | — | — |
| `defaultHidden` | `boolean` | `false` | — |
| `onHiddenChange` | `(hidden: boolean) => void` | — | — |
| `className` | `string` | — | — |

### Exported types

#### `OnboardingStep`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `title` (required) | `string` | — |
| `description` | `string` | — |
| `actionLabel` | `string` | Label of the button that does the step. Without it, the step is checked off by hand. |
| `onAction` | `() => void \| Promise<void>` | Runs the step. Resolve to check it off; throw an Error to keep it open and show the error's message. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | With focus on a step's title, moves to the previous or next title, wrapping around at the end of the list. |
| `Home` or `End` | Moves to the title of the first or last step in the list. |
| `Enter` or `Space` | On the title, opens or closes the step's details; on the circle, checks or unchecks; on the action, runs `onAction`. |

## Accessibility

- Each circle is a button with `role="checkbox"` and `aria-checked`, named by the step's title; the title opens the details with `aria-expanded` and `aria-controls`.
- The ring is `role="progressbar"` (“N of M steps done”) and a `role="status"` region announces each step done or undone; the `onAction` error appears with `role="alert"`.
- When a focused step collapses, focus moves to the action of the next open step, and unchecking in the completed group moves focus to the circle of the step that came back.

## Motion

- On checking, the circle fills from the center and the checkmark draws itself; the title gets a strikethrough that crosses the line and, after 0.72 s, the step collapses into the completed group.
- Rows and panels open and close their height with a no-overshoot spring; the ring fills with each step, the numbers turn in the direction of the change, and a checkmark appears in the ring when everything is finished.
- With “reduce motion”, heights change immediately with a short fade, strikethrough and fill appear without transition, and the action button's spinner stops.

## Responsive behavior

- In a card narrower than 380 px (container query), the hide button shows only the arrow and keeps its spoken name.

## Notes for AI

- Import from `@/components/ryan-ui/onboarding-checklist/onboarding-checklist`. It is uncontrolled: pass `defaultCompleted` with the ids already done and save progress from `onCompletedChange`.
- In `onAction`, return a Promise: resolving marks the step; throwing `new Error("mensagem")` keeps the step open with the message. Without `actionLabel`, the step is only checked by hand.
- The fixed texts (“Setup progress”, “Hide”, “completed”, the default error message) are in English; translate them in the copied file. Each step needs a stable `id`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/onboarding-checklist · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
