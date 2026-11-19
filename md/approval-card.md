# Approval card

> Cartão que pede sua aprovação antes de o agente agir, com resumo, detalhes que se abrem e o resultado da decisão.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/approval-card
- Original description: A card that asks a person to approve or reject an agent's proposed action, with a summary, details that expand, and a resolved state the buttons morph into.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/approval-card.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/approval-card.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/approval-card.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/approval-card.json`. Registry path, relative to the site address: `r/approval-card.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/approval-card/approval-card.tsx`
  - `components/ryan-ui/approval-card/approval-card.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/approval-card.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- An agent proposes an action with a real effect (refund, send, delete) and a person must approve or reject it before it happens.
- Requests that need context: a summary, facts as label and value pairs and, optionally, a preview of the change behind the details button.
- Review queues where the card stays on screen after the decision, showing what was decided and an “Undo”.

## When not to use

- Use [`tool-approval`](tool-approval.md) for a compact request inside the conversation, with allow once, allow always or deny.
- Use [`confirm-morph`](confirm-morph.md) or [`hold-to-confirm`](hold-to-confirm.md) when the person themselves triggers a destructive action and only needs to confirm it.
- Use [`dialog`](dialog.md) when the decision must block the rest of the screen until it is made.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import ApprovalCard from "@/components/ryan-ui/approval-card/approval-card";
import type { ApprovalStatus } from "@/components/ryan-ui/approval-card/approval-card";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 560 };

const notes: Record<ApprovalStatus, string> = {
  pending: "The agent is waiting. Nothing is sent until you decide.",
  approved: "The agent sent the refund and replied to the customer.",
  rejected: "The agent dropped the refund and will ask the customer for photos.",
};

export default function ApprovalCardDemo() {
  const [status, setStatus] = useState<ApprovalStatus>("pending");
  return (
    <Stack width={440} gap={4}>
      <ApprovalCard
        source="Billing agent"
        title="Refund $240.00 to Maya Torres"
        summary="Order 48213 arrived with a cracked lid. The agent wants to refund the full amount to the original card and close the ticket."
        details={[
          { label: "Customer", value: "Maya Torres" },
          { label: "Order", value: "48213, delivered May 2" },
          { label: "Amount", value: "$240.00" },
          { label: "Refund to", value: "Visa ending 4421" },
          { label: "Policy", value: "Inside the 30-day window" },
        ]}
        approveLabel="Approve refund"
        resolvedLabels={{ approved: "Refund approved", rejected: "Refund rejected" }}
        status={status}
        onStatusChange={setStatus}
      />
      <Caption>{notes[status]}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ApprovalCard`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` | — | The action waiting for a decision, in one line. |
| `summary` | `ReactNode` | — | A sentence or two on what will happen and why. |
| `source` | `string` | — | Who is asking, shown above the title (an agent or a workflow name). |
| `icon` | `ReactNode` | — | Icon of the request while it is pending. |
| `details` | `ApprovalDetail[]` | — | Facts shown when the details are open, as label and value rows. |
| `children` | `ReactNode` | — | Extra content under the detail rows, such as a preview of the change. |
| `status` | `"pending" \| "approved" \| "rejected"` | — | Controlled decision. |
| `defaultStatus` | `"pending" \| "approved" \| "rejected"` | `"pending"` | Decision the card starts with when uncontrolled. |
| `onStatusChange` | `(status: ApprovalStatus) => void` | — | Called when the person approves, rejects or undoes. |
| `detailsOpen` | `boolean` | — | Controlled open state of the details. |
| `defaultDetailsOpen` | `boolean` | `false` | Whether the details start open when uncontrolled. |
| `onDetailsOpenChange` | `(open: boolean) => void` | — | Called when the details toggle is pressed. |
| `approveLabel` | `string` | `"Approve"` | Text of the approve button. |
| `rejectLabel` | `string` | `"Reject"` | Text of the reject button. |
| `resolvedLabels` | `Partial<Record<Exclude<ApprovalStatus, "pending">, string>>` | — | Outcome text per decision, shown in the resolved state. |
| `allowUndo` | `boolean` | `true` | Offers an undo in the resolved state that returns the card to pending. |
| `className` | `string` | — | Extra class for the root element. |

### Exported types

| Type | Definition |
| --- | --- |
| `ApprovalStatus` | `"pending" \| "approved" \| "rejected"` |

#### `ApprovalDetail`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | Name of the fact, such as "Amount". |
| `value` (required) | `ReactNode` | Its value. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | Activates the focused button: details, reject, approve or undo. |
| `Tab` | Moves through the controls in DOM order: details button, reject and approve. |

## Accessibility

- The root is a `<section>` labeled by `title`; the details button exposes `aria-expanded` and `aria-controls`, and the result appears in a `role="status"` region.
- On decision, the pressed button leaves the DOM and the code does not move focus, which lands on `body`; if the queue is used by keyboard, move focus yourself in `onStatusChange`.
- “Show details”, “Hide details”, “Undo” and “needs your approval” are fixed in English; only `approveLabel`, `rejectLabel` and `resolvedLabels` can be translated.

## Motion

- On decision, the icon becomes a check mark or an X that draws itself, a ripple leaves the badge and the buttons give way to the result with a short fade.
- The details open with a height spring and the fact rows enter in sequence.
- With “reduce motion” on, only opacity changes remain: no ripple, no stroke drawing and no color or scale transitions.

## Responsive behavior

- When the window is up to 26rem wide (media query, not container), the two buttons split the full row; the card always fills 100% of the parent.

## Notes for AI

- The card only records the decision: run the action in `onStatusChange` and, to reflect what the server replied, control `status` (`pending`, `approved`, `rejected`).
- “Undo” returns the card to `pending` and calls `onStatusChange("pending")`; if the action cannot be undone once executed, pass `allowUndo={false}`.
- The details button only appears when there are `details` or `children`; each `label` in `details` is used as the `key`, so do not repeat labels.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/approval-card · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
