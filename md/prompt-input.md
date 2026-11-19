# Prompt input

> Caixa de prompt que cresce com o texto, com anexos, menu de modelo e um botão de enviar que vira parar durante a resposta.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/prompt-input
- Original description: An auto-growing prompt box with attachment chips and a model menu whose send button morphs into stop while a response runs; Enter sends and Shift+Enter adds a line.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/prompt-input.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/prompt-input.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/prompt-input.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/prompt-input.json`. Registry path, relative to the site address: `r/prompt-input.json`.

- npm packages: `@radix-ui/react-dropdown-menu`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/prompt-input/prompt-input.tsx`
  - `components/ryan-ui/prompt-input/prompt-input.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-dropdown-menu lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/prompt-input.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- An assistant's prompt box: grows with the text, sends with Enter and inserts a line break with Shift + Enter.
- Replies that can be interrupted: with `running`, the send button becomes a stop button in the same place.
- Requests with attachments as chips and a menu to choose the model, all inside the same box.

## When not to use

- Use [`textarea`](textarea.md) for a multi-line field in a form, with no send on Enter or stop button.
- Use [`mention-input`](mention-input.md) when the text needs mentions of people with @ or channels with #.
- Use [`chat-app`](chat-app.md) when you want the whole chat screen, with conversation, streaming replies and prompt box already wired up.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useEffect, useRef, useState } from "react";
import PromptInput from "@/components/ryan-ui/prompt-input/prompt-input";
import type { PromptAttachment, PromptModel, PromptSubmission } from "@/components/ryan-ui/prompt-input/prompt-input";
import { Caption, Stack, demoStage } from "./_kit";

const models: PromptModel[] = [
  { id: "atlas-pro", label: "Atlas Pro", description: "Slower, best for hard problems" },
  { id: "atlas-fast", label: "Atlas Fast", description: "Quick answers for everyday work" },
  { id: "atlas-mini", label: "Atlas Mini", description: "Lightest, for short tasks" },
];
const shelf: PromptAttachment[] = [
  { id: "report", name: "q3-revenue.csv", detail: "84 KB" },
  { id: "brief", name: "launch-brief.pdf", detail: "1.2 MB" },
  { id: "notes", name: "interview-notes.md", detail: "6 KB" },
  { id: "chart", name: "churn-by-plan.png", detail: "310 KB" },
];

export default function PromptInputDemo() {
  const [attachments, setAttachments] = useState<PromptAttachment[]>(shelf.slice(0, 2));
  const [model, setModel] = useState("atlas-pro");
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState("Enter sends, Shift+Enter adds a line. The plus button attaches a sample file.");
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function send({ value, attachments: files, model: used }: PromptSubmission) {
    const name = models.find(item => item.id === used)?.label ?? "the model";
    const extras = files.length ? ` with ${files.length} ${files.length === 1 ? "file" : "files"}` : "";
    setNote(`${name} is answering “${value || "your files"}”${extras}. Press stop to interrupt.`);
    setRunning(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { setRunning(false); setNote(`${name} finished the answer.`); }, 3600);
  }

  function attach() {
    const next = shelf.find(file => !attachments.some(item => item.id === file.id));
    if (next) setAttachments([...attachments, next]); else setNote("All four sample files are attached.");
  }

  return (
    <Stack width={560} gap={4}>
      <PromptInput
        placeholder="Ask about your data"
        container={demoStage()}
        models={models}
        model={model}
        onModelChange={setModel}
        attachments={attachments}
        onAttachmentsChange={setAttachments}
        onAttach={attach}
        running={running}
        onSubmit={send}
        onStop={() => { window.clearTimeout(timer.current); setRunning(false); setNote("Stopped. The partial answer was kept."); }}
      />
      <Caption>{note}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `PromptInput`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Controlled text. |
| `defaultValue` | `string` | `""` | Text the box starts with when uncontrolled. |
| `onValueChange` | `(value: string) => void` | — | Called on every edit, and with an empty string after a send. |
| `onSubmit` | `(submission: PromptSubmission) => void` | — | Called when the person sends (Enter or the send button) with text or attachments present. |
| `running` | `boolean` | `false` | True while a response is being generated: the send button becomes a stop button. |
| `onStop` | `() => void` | — | Called when the stop button is pressed. |
| `attachments` | `PromptAttachment[]` | — | Controlled attachment list. |
| `defaultAttachments` | `PromptAttachment[]` | `noAttachments` | Attachments the box starts with when uncontrolled. |
| `onAttachmentsChange` | `(attachments: PromptAttachment[]) => void` | — | Called when a chip is removed, files are picked, or the list is cleared after a send. |
| `onAttach` | `() => void` | — | Called when the attach button is pressed. Without it the button opens the system file picker and adds the chosen files as chips. |
| `models` | `PromptModel[]` | `noModels` | Models offered in the menu. The menu is hidden when the list is empty. |
| `model` | `string` | — | Controlled model id. |
| `defaultModel` | `string` | — | Model selected at first when uncontrolled. Defaults to the first one. |
| `onModelChange` | `(model: string) => void` | — | Called when another model is picked. |
| `placeholder` | `string` | `"Ask anything"` | Placeholder text of the empty box. |
| `label` | `string` | `"Prompt"` | Accessible name of the text box. |
| `maxRows` | `number` | `8` | Lines the box grows to before it scrolls. |
| `clearOnSubmit` | `boolean` | `true` | Empties the text and the attachments after a send. |
| `disabled` | `boolean` | `false` | Blocks typing, attaching and sending. |
| `container` | `HTMLElement \| null` | — | Render the model menu inside this element and limit collisions to it (used by the demo stages). |
| `className` | `string` | — | Extra class for the root element. |

### Exported types

#### `PromptAttachment`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable id, used as the key and passed back on removal. |
| `name` (required) | `string` | File or item name shown on the chip. |
| `detail` | `string` | Short note after the name, such as a size or a type. |

#### `PromptModel`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Value reported by `onModelChange` and `onSubmit`. |
| `label` (required) | `string` | Name shown on the trigger and in the menu. |
| `description` | `string` | One line under the name in the menu. |

#### `PromptSubmission`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | The trimmed prompt text. |
| `attachments` (required) | `PromptAttachment[]` | Attachments on the prompt when it was sent. |
| `model` | `string` | Selected model id, when models are given. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` | In the text box, sends when there is text or an attachment; during IME composition it does not send. |
| `Shift + Enter` | Inserts a line break without sending; the box grows up to `maxRows` rows and then scrolls internally. |
| `Enter` or `Space` or `↓` | On the model selector, opens the menu with focus on the first model. |
| `↑` or `↓` or `Home` or `End` | In the menu, moves between models; the arrows wrap from the last to the first. |
| `Enter` or `Space` | In the menu, chooses the focused model, closes the menu and returns focus to the selector. |
| `Esc` | Closes the menu without changing the model and returns focus to the selector. |

## Accessibility

- The text box is named by `label` (default “Prompt”) and has the hidden description “Press Enter to send, Shift and Enter for a new line.” via `aria-describedby`; the visible hint is `aria-hidden`.
- The icon-only buttons have a fixed English `aria-label` (“Attach files”, “Remove …”, “Send prompt”, “Stop response”), the selector announces itself as “Model: …” and the menu is a Radix radio group.
- After sending, focus returns to the text box; send and stop are the same `<button>`, which only changes its `aria-label`, and stop is disabled without `onStop`.

## Motion

- The box follows the text height with a short spring; the attachment tray opens to its own height, each chip enters growing and the others slide when one leaves.
- When `running` becomes `true`, the arrow leaves upward, a stop square grows in its place and an arc spins around the button; the model name swaps by sliding vertically.
- With “reduce motion” on, the height changes instantly, chips and icons only fade, the arc stops and the menu appears with a quick fade.

## Responsive behavior

- It is a width container: below 22rem the “Enter to send” hint disappears; the model name truncates with an ellipsis, and so does each attachment name, from 11rem.
- The model menu opens above the selector, at least 15rem wide, and Radix repositions it to fit on screen, with 12 px of clearance.

## Notes for AI

- Wire up `onSubmit`, which receives the already-trimmed `value`, `attachments` and `model`, and control `running` with `onStop`; without `onStop`, the stop button is disabled during the reply.
- Without `onAttach`, the button opens the system picker and creates chips with only name and size, without keeping the `File`; to actually send files, pass `onAttach` and control `attachments`.
- By default, text and attachments are cleared after sending (`clearOnSubmit`); with empty `models` the menu disappears, and `model` with `onModelChange` makes the choice controlled.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/prompt-input · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
