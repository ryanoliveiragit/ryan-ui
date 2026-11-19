# Tool approval

> Pedido compacto para rodar uma ferramenta: permita uma vez, sempre ou negue, e ele se recolhe em uma linha de resultado.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/tool-approval
- Original description: A compact inline request to run a tool, with its arguments and allow once, always allow or deny, that collapses into a one-line result once decided.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tool-approval.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tool-approval.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tool-approval.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tool-approval.json`. Registry path, relative to the site address: `r/tool-approval.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/tool-approval/tool-approval.tsx`
  - `components/ryan-ui/tool-approval/tool-approval.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/tool-approval.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Ask permission inside the conversation before an agent runs a tool, showing its name and the exact arguments of the call.
- When the person needs three outcomes: allow once, allow always or deny.
- Long transcripts: after the decision, the request shrinks to a line that records the answer and can be reopened with “Change”.

## When not to use

- Use [`approval-card`](approval-card.md) for a business decision with a summary, details as label and value pairs and an “Undo”.
- Use [`tool-result`](tool-result.md) to record a call that has already run, with input, output and duration.
- Use [`dialog`](dialog.md) when the decision must block the rest of the screen until it is made.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { FilePen, Terminal } from "lucide-react";
import ToolApproval from "@/components/ryan-ui/tool-approval/tool-approval";
import type { ToolDecision } from "@/components/ryan-ui/tool-approval/tool-approval";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./tool-approval.module.css";

export const stage: DemoStage = { height: 520 };

const outcome: Record<ToolDecision, string> = {
  pending: "The agent is paused until you answer.",
  once: "The command ran. The agent will ask again next time.",
  always: "The command ran. The agent can run it again without asking.",
  denied: "The command did not run. The agent will look for another way.",
};

export default function ToolApprovalDemo() {
  const [command, setCommand] = useState<ToolDecision>("pending");
  return (
    <Stack width={460} gap={3}>
      <p className={styles.line}>Port 3000 is taken, so the dev server cannot start. I will find the process that holds it.</p>
      <ToolApproval tool="write_file" icon={<FilePen width={15} height={15} strokeWidth={1.9} />} args={{ path: "notes/port-conflict.md", bytes: 412 }} defaultDecision="always" />
      <ToolApproval
        tool="run_command"
        icon={<Terminal width={15} height={15} strokeWidth={1.9} />}
        description="It lists what is listening on the port."
        args={{ command: "lsof -nP -iTCP:3000 -sTCP:LISTEN", cwd: "~/projects/storefront", timeout: "10 s" }}
        decision={command}
        onDecisionChange={setCommand}
      />
      <Caption>{outcome[command]}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ToolApproval`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tool` (required) | `string` | — | Name of the tool, as the agent calls it (for example "run_command"). |
| `args` | `Record<string, unknown> \| string` | — | Arguments of the call: an object shown as key and value lines, or a ready-made string. |
| `description` | `string` | — | Why the agent wants to run it, in a short sentence. |
| `icon` | `ReactNode` | — | Icon of the tool. |
| `decision` | `"pending" \| "once" \| "always" \| "denied"` | — | Controlled decision. |
| `defaultDecision` | `"pending" \| "once" \| "always" \| "denied"` | `"pending"` | Decision the request starts with when uncontrolled. |
| `onDecisionChange` | `(decision: ToolDecision) => void` | — | Called when the person decides, or reopens the request. |
| `allowChange` | `boolean` | `true` | Shows a "Change" button on the result line that reopens the request. |
| `labels` | `Partial<Record<"once" \| "always" \| "deny" \| "allowedOnce" \| "allowedAlways" \| "denied" \| "change", string>>` | — | Button and result texts, to translate or reword them. |
| `className` | `string` | — | Extra class for the root element. |

### Exported types

| Type | Definition |
| --- | --- |
| `ToolDecision` | `"pending" \| "once" \| "always" \| "denied"` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Moves through “Deny”, “Always allow” and “Allow once”, in that order. |
| `Enter` or `Space` | On a decision button, decides and moves focus to the “Change” of the result line, or to the request itself with `allowChange={false}`. |
| `Enter` or `Space` | On “Change”, reopens the request and moves focus to “Allow once”. |

## Accessibility

- The root is a `role="group"` named “Permission request for” plus the `tool`, and the arguments sit in an “Arguments” group; a truncated value shows the full text in `title`.
- When the decision comes from a button in the request, focus goes to the button that replaces it and does not fall to `body`; the result sits in a `role="status"` region.
- “Wants to run”, “Permission request for” and “Arguments” are fixed in English; the button and result texts are translated through `labels`.

## Motion

- On decision, the request leaves upward with a light blur, the result line enters in its place and the frame follows the new height with a spring.
- The result icon draws itself: a check mark for allow and a two-stroke X for deny.
- With “reduce motion” on, swaps are opacity-only, the height changes instantly and the icons appear already drawn.

## Responsive behavior

- It is a width container: below 21rem the two allow buttons share one row and “Deny” drops below them, at full width; in the result line, the argument disappears.

## Notes for AI

- Pause the agent until `onDecisionChange` returns `once`, `always` or `denied`; the “Always allow” rule is yours, because the component only records the choice.
- `args` accepts an object (one `chave: valor` line per field, non-text values as JSON) or a string with line breaks; the result line shows only the first value.
- Translate with `labels` (`once`, `always`, `deny`, `allowedOnce`, `allowedAlways`, `denied`, `change`); for history, render already-decided requests with `defaultDecision`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/tool-approval · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
