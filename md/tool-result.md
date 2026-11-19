# Tool result

> Registro recolhível de uma chamada de ferramenta, com status, duração e a entrada e a saída formatadas.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/tool-result
- Original description: A collapsible record of a tool call that shows its status, a live or final duration, and formatted input and output that expand with a height spring.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tool-result.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tool-result.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tool-result.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tool-result.json`. Registry path, relative to the site address: `r/tool-result.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/tool-result/tool-result.tsx`
  - `components/ryan-ui/tool-result/tool-result.module.css`
  - `components/ryan-ui/lib/use-copy-feedback.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/tool-result.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- An agent's transcript: each tool call becomes a row with state, name, summary and duration, which opens to show input and output.
- Calls still running: a timer counts live and the output shows waiting lines until the result arrives.
- Debugging: objects appear as indented, colorized JSON, with a copy button on each block.

## When not to use

- Use [`tool-approval`](tool-approval.md) before the call, when the person needs to allow or deny the execution.
- Use [`json-viewer`](json-viewer.md) for large or nested JSON, with a collapsible tree, search and pagination.
- Use [`agent-activity`](agent-activity.md) for a timeline of the agent's steps, without the input and output of each call.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useEffect, useState } from "react";
import ToolResult from "@/components/ryan-ui/tool-result/tool-result";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 640 };

const docs = { matches: 2, results: [{ title: "Rate limits", path: "/docs/api/rate-limits", score: 0.94 }, { title: "Response headers", path: "/docs/api/headers", score: 0.81 }].map(item => `${item.title} (${item.path})`), cached: true };
const tests = { passed: 48, failed: 0, skipped: 2, durationMs: 3180, slowest: "checkout.spec.ts" };

export default function ToolResultDemo() {
  /** Bumped to run the test call again. */
  const [run, setRun] = useState(0);
  const [testing, setTesting] = useState(true);
  /** One record open at a time keeps the transcript compact, the way a long agent log would. */
  const [open, setOpen] = useState<string | null>("search");
  const bind = (id: string) => ({ open: open === id, onOpenChange: (next: boolean) => setOpen(next ? id : null) });

  useEffect(() => {
    setTesting(true);
    const timer = window.setTimeout(() => setTesting(false), 3200);
    return () => window.clearTimeout(timer);
  }, [run]);

  return (
    <Stack width={500} gap={3}>
      <ToolResult tool="search_docs" summary="rate limit headers" durationMs={420} input={{ query: "rate limit headers", limit: 2, includeDrafts: false }} output={docs} {...bind("search")} />
      <ToolResult key={run} tool="run_tests" summary="tests/checkout" status={testing ? "running" : "success"} durationMs={testing ? undefined : tests.durationMs} input={{ path: "tests/checkout", retries: 0 }} output={testing ? undefined : tests} {...bind("tests")} />
      <ToolResult tool="fetch_invoice" summary="inv_8841" status="error" durationMs={1840} input={{ id: "inv_8841" }} error="404 Not Found: no invoice with id inv_8841 in workspace acme." {...bind("invoice")} />
      <Row justify="space-between">
        <Button size="sm" variant="secondary" onClick={() => setRun(current => current + 1)}>Run tests again</Button>
        <Caption>{testing ? "run_tests is still running." : "Open a record to see its input and output."}</Caption>
      </Row>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ToolResult`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tool` (required) | `string` | — | Name of the tool that was called. |
| `status` | `"running" \| "success" \| "error"` | `"success"` | Where the call stands. |
| `summary` | `string` | — | Short text after the name, usually the main argument. |
| `durationMs` | `number` | — | How long the call took, in milliseconds. While `status` is "running" and this is not set, a live timer counts from mount. |
| `input` | `unknown` | — | What the tool was called with. Objects are printed as highlighted JSON; strings are shown as they are. |
| `output` | `unknown` | — | What the tool returned. Same formatting as `input`. |
| `error` | `string` | — | Error message, shown in place of the output when `status` is "error". |
| `open` | `boolean` | — | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Whether the record starts open when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the header is pressed. |
| `className` | `string` | — | Extra class for the root element. |

### Exported types

| Type | Definition |
| --- | --- |
| `ToolResultStatus` | `"running" \| "success" \| "error"` |

### Other exports

- `formatDuration` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the header, opens or collapses the record. |
| `Tab` | With the record open, moves through the copy buttons and the code blocks, which are focusable; collapsed, nothing in the body receives focus. |
| `↑` or `↓` | With focus on a code block, scroll content taller than 15rem (native scrolling). |

## Accessibility

- The header is a `<button>` with `aria-expanded` and `aria-controls`; its name includes the state (“Running”, “Succeeded”, “Failed”), the tool, the summary and the duration with “running for” or “took”.
- Collapsed, the body stays mounted but `inert`; each copy button has its own `aria-label` (“Copy input”, “Copy output”, “Copy error”).
- While running, the output is a `role="status"` skeleton named “Waiting for the result”; all these texts are fixed in English.

## Motion

- The state swaps from a spinner to a badge that enters with a small bounce and a check mark or X that draws itself; on open, input and output rise in sequence.
- The body opens and closes with a spring on the measured height and grows the same way when the result arrives with the record open.
- With “reduce motion” on, the spinner and skeleton stop, the icons only fade, heights change instantly and the timer counts second by second.

## Responsive behavior

- The tool name takes at most 55% of the row and the summary truncates with an ellipsis; in the code blocks long lines wrap, and above 15rem the block scrolls internally.

## Performance

- Each record has a `ResizeObserver`; without `durationMs`, the `running` state also starts a 100 ms `setInterval` (1 s with “reduce motion”), which re-renders the record on each tick.

## Notes for AI

- When it finishes, change `status` to `success` or `error` and pass `durationMs` with `output` or `error`: without `durationMs`, the duration disappears when the state stops being `running`.
- Objects passed as input and output become indented, colorized JSON; strings appear as they are, so send the object, not already-serialized text.
- It starts collapsed; in a list, control `open` and `onOpenChange` to keep one record open at a time, as the demo does.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/tool-result · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
