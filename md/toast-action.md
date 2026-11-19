# Toast action

> Aviso com uma ação, como Desfazer, e uma barra fina que se esgota até ele sair; passar o mouse ou focar pausa a contagem.

- Type: component (category Feedback), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/toast-action
- Original description: A toast with one action, such as Undo, and a thin countdown bar that drains until it leaves; hover or focus holds the countdown, and taking the action swaps the copy for a short confirmation.
- Versions: Padrão ([`toast`](toast.md)), Pilha ([`toast-stack`](toast-stack.md)), Com ação (this item), Progresso ([`toast-progress`](toast-progress.md))

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast-action.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast-action.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast-action.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast-action.json`. Registry path, relative to the site address: `r/toast-action.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/toast-action/toast-action.tsx`
  - `components/ryan-ui/toast-action/toast-action.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/toast-action.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Right after something reversible, such as deleting, archiving, or sending, offering “Undo” while the timer bar runs.
- When the user needs time to react: the countdown stops with the mouse over it, with focus, or with the tab hidden and resumes where it left off.
- When the result of the action should be clear: on tapping it, the text swaps to `confirmation` with a drawn checkmark before the notice leaves.

## When not to use

- Use [`toast`](toast.md) for a simple confirmation, with no action.
- Use [`toast-stack`](toast-stack.md) when several notices may arrive in sequence; this one shows one at a time.
- Use [`confirm-morph`](confirm-morph.md) or [`hold-to-confirm`](hold-to-confirm.md) when the destructive action should be confirmed beforehand, not undone afterward.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FileArchive, FileSpreadsheet, FileText, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ToastAction from "@/components/ryan-ui/toast-action/toast-action";
import type { ToastActionCloseReason } from "@/components/ryan-ui/toast-action/toast-action";
import { Button } from "@/components/ryan-ui/button/button";
import { motionTokens } from "@/components/ryan-ui/lib/motion-tokens";
import { Caption, demoStage } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./toast-action.module.css";

export const stage: DemoStage = { height: 480 };

interface SharedFile { id: string; name: string; detail: string; Icon: LucideIcon }

const sharedFiles: SharedFile[] = [
  { id: "report", name: "Q3-report.pdf", detail: "2.4 MB, edited yesterday", Icon: FileText },
  { id: "forecast", name: "Forecast-2027.xlsx", detail: "860 KB, edited 2 hours ago", Icon: FileSpreadsheet },
  { id: "brand", name: "brand-kit.zip", detail: "42 MB, shared with 6 people", Icon: FileArchive },
];
const hint = "Delete a file, then hover or focus the toast to hold its countdown.";

export default function ToastActionDemo() {
  const reduce = useReducedMotion();
  // On the docs page the preview starts right after a delete: the last file is gone and its Undo toast is counting down.
  const [inStage] = useState(() => demoStage() !== null);
  const [files, setFiles] = useState(() => inStage ? sharedFiles.slice(0, -1) : sharedFiles);
  const [removed, setRemoved] = useState<{ file: SharedFile; index: number; count: number } | null>(() => inStage ? { file: sharedFiles[sharedFiles.length - 1]!, index: sharedFiles.length - 1, count: 1 } : null);
  const [open, setOpen] = useState(inStage);
  const [note, setNote] = useState(hint);

  function remove(file: SharedFile) {
    setRemoved({ file, index: files.indexOf(file), count: (removed?.count ?? 0) + 1 });
    setFiles(files.filter(item => item !== file));
    setOpen(true);
    setNote(hint);
  }

  function restore() {
    if (!removed) return;
    const next = [...files];
    next.splice(Math.min(removed.index, next.length), 0, removed.file);
    setFiles(next);
    setNote(`${removed.file.name} is back where it was.`);
  }

  function onOpenChange(next: boolean, reason?: ToastActionCloseReason) {
    setOpen(next);
    if (removed && reason !== "action") setNote(`${removed.file.name} was deleted for good.`);
  }

  return (
    <div className={styles.scene}>
      <section className={styles.panel} aria-label="Shared files">
        <header className={styles.header}><span>Shared files</span><span className={styles.count}>{files.length}</span></header>
        <ul className={styles.list}>
          {/* Rows fold their height, so the ones below slide up (or make room again) in the same motion. */}
          <AnimatePresence initial={false}>
            {files.map(file => (
              <motion.li
                key={file.id}
                className={styles.item}
                initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={reduce ? { duration: motionTokens.duration.instant } : { height: motionTokens.spring.smooth, opacity: { duration: motionTokens.duration.fast } }}
              >
                <div className={styles.row}>
                  <span className={styles.tile} aria-hidden="true"><file.Icon width={18} height={18} strokeWidth={1.75} /></span>
                  <span className={styles.text}><span className={styles.name}>{file.name}</span><span className={styles.detail}>{file.detail}</span></span>
                  <button type="button" className={styles.remove} aria-label={`Delete ${file.name}`} onClick={() => remove(file)}><Trash2 width={16} height={16} strokeWidth={1.75} aria-hidden="true" /></button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {files.length === 0 ? <div className={styles.empty}><span>No shared files left.</span><Button variant="secondary" size="sm" onClick={() => { setFiles(sharedFiles); setOpen(false); setRemoved(null); setNote(hint); }}>Bring the samples back</Button></div> : null}
      </section>
      <Caption className={styles.note}>{note}</Caption>
      <ToastAction
        open={open}
        onOpenChange={onOpenChange}
        position="bottom-center"
        contained
        className={styles.toast}
        resetKey={removed?.count}
        icon={<Trash2 width={15} height={15} strokeWidth={2} />}
        title={removed ? `${removed.file.name} deleted` : ""}
        description="It stays recoverable until this closes."
        actionLabel="Undo"
        onAction={restore}
        confirmation="File restored"
        confirmationDescription={removed ? `${removed.file.name} is back in Shared files.` : undefined}
        duration={6000}
      />
    </div>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ToastAction`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` | — | What just happened, in a few words. Changing the title or description while the toast is open swaps the copy in place and restarts the countdown. |
| `description` | `string` | — | Optional second line with the detail. |
| `resetKey` | `string \| number` | — | Identifies the event the toast is about. A new value while the toast is open starts it over (action back, countdown full) even when the copy is the same, for example when the same file is deleted twice. |
| `icon` | `ReactNode` | — | Glyph in the status circle before the action is taken, for example a trash icon at 16px. |
| `actionLabel` | `string` | `"Undo"` | Label of the single action. |
| `onAction` | `() => void` | — | Runs when the action is taken. The toast then shows the confirmation and leaves by itself. |
| `confirmation` | `string` | `"Action undone"` | Title shown after the action is taken. |
| `confirmationDescription` | `string` | — | Optional second line of the confirmation. |
| `confirmationDuration` | `number` | `1800` | Milliseconds the confirmation stays before the toast leaves. |
| `open` | `boolean` | — | Whether the toast is showing (controlled). |
| `defaultOpen` | `boolean` | `true` | Whether the toast starts showing when `open` is not passed. |
| `onOpenChange` | `(open: boolean, reason?: ToastActionCloseReason) => void` | — | Called when the toast closes itself, with the reason: `"timeout"`, `"dismiss"`, or `"action"` whenever the action was taken first. |
| `duration` | `number` | `6000` | Milliseconds of countdown before the toast closes itself. Pass 0 or Infinity to keep it until it is closed; the bar is then hidden. |
| `position` | `"inline" \| "bottom-right" \| "bottom-center" \| "bottom-left"` | `"inline"` | Where the toast sits. `inline` stays in the flow; the bottom positions pin it to the window. |
| `contained` | `boolean` | `false` | With a bottom position, pins the toast inside the nearest positioned ancestor instead of the window, for panels and previews. |
| `hotkey` | `boolean` | `true` | Alt+T moves focus to the action, so keyboard users can reach it before the countdown ends. |
| `className` | `string` | — | Extra class for the toast surface. |

### Exported types

| Type | Definition |
| --- | --- |
| `ToastActionCloseReason`: Why the toast closed: the countdown ran out, the person closed it (button, Escape or swipe), or the action was taken. | `"timeout" \| "dismiss" \| "action"` |
| `ToastActionPosition`: `inline` renders where it is placed, like `Toast`. The others pin it to the bottom edge, like `ToastStack`. | `"inline" \| "bottom-right" \| "bottom-center" \| "bottom-left"` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Alt + T` | Moves focus to the open notice's action (or to the close button, after the action), to reach it before the time runs out; turn off with `hotkey={false}`. |
| `Tab` or `Shift + Tab` | With focus inside the notice, the countdown pauses; on leaving, it resumes where it left off. |
| `Enter` or `Space` | On the action, runs `onAction` and shows the confirmation; focus moves to the close button. |
| `Esc` | With focus inside, closes the notice and returns focus to where it was before. |

## Accessibility

- It is `role="status"` with `aria-live="polite"`; the outgoing copy is hidden, so only the current text is read, including the confirmation.
- On closing with focus inside, it returns to where it was before entering the notice; after the action, it goes to the close button instead of dropping onto the page.
- `duration={0}` keeps the notice until it is closed, for those who need more time; the close `aria-label` is fixed in English (“Dismiss notification”).

## Motion

- A thin bar at the bottom empties at a linear pace until the notice leaves; while the countdown is paused, it appears dimmer.
- On taking the action, the icon shrinks with blur and a checkmark draws itself in its place, the text swaps rising and the height follows with a spring; the action button leaves the flow and fades.
- It enters rising with a spring and flies off when dragged sideways. With “reduce motion”, the bar drops in 8 steps, everything only fades, and dragging is turned off.

## Responsive behavior

- In `bottom-*` positions it is fixed to the window at up to 24 rem and, on screens below 30 rem, centers at the bottom; with `contained`, it attaches to the positioned ancestor.
- In a notice narrower than 23 rem, the action drops below the text instead of squeezing it.

## Notes for AI

- Import from `@/components/ryan-ui/toast-action/toast-action`. Undo the operation in `onAction` and only delete for good in `onOpenChange` when the reason is not `"action"`.
- To repeat the notice on an identical event (the same file deleted twice), change `resetKey`: the action comes back and the bar fills again.
- Use `position="bottom-center"` (or another corner) to fix it to the window, or `inline` to stay in the flow; in a preview inside a panel, add `contained` and give the parent `position: relative`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/toast-action · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
