# Toast progress

> Aviso que acompanha uma tarefa: a barra e a porcentagem avançam e ele vira sucesso, com o check desenhado, ou erro com Tentar de novo.

- Type: component (category Feedback), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/toast-progress
- Original description: A toast that follows a running task: a bar and a percentage advance, then it morphs in place into a success state with a drawn check, or into an error state with Retry.
- Versions: Padrão ([`toast`](toast.md)), Pilha ([`toast-stack`](toast-stack.md)), Com ação ([`toast-action`](toast-action.md)), Progresso (this item)

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast-progress.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast-progress.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast-progress.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast-progress.json`. Registry path, relative to the site address: `r/toast-progress.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/toast-progress/toast-progress.tsx`
  - `components/ryan-ui/toast-progress/toast-progress.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/toast-progress.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Track a background task with a known percentage, such as an upload, export, or import, without blocking the screen.
- Close the loop in the same notice: the bar completes and becomes a success checkmark, or freezes in the danger tone with “Retry” on failure.
- Progress with a detail that changes on each update (“27 of 42 MB”, “3 seconds left”) in `description`, without animating the text swap every time.

## When not to use

- Use [`progress`](progress.md) when the progress should be visible on the page itself, near what is being processed.
- Use [`toast-stack`](toast-stack.md) with `update` for several tasks at once; this one tracks only one.
- Use [`toast`](toast.md) for a result that needed no progress.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useEffect, useRef, useState } from "react";
import { FileArchive } from "lucide-react";
import ToastProgress from "@/components/ryan-ui/toast-progress/toast-progress";
import type { ToastProgressStatus } from "@/components/ryan-ui/toast-progress/toast-progress";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, demoStage } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./toast-progress.module.css";

export const stage: DemoStage = { height: 480 };

const file = { name: "brand-kit.zip", megabytes: 42 };
/** Percent gained on each tick. A fixed sequence, so the demo plays the same way every time. */
const steps = [3, 6, 4, 8, 5, 9, 4, 7, 6, 5];
/** Where the weak connection gives up. */
const dropAt = 64;

interface Upload { open: boolean; status: ToastProgressStatus; value: number }

const fileState: Record<ToastProgressStatus | "idle", string> = { idle: "Ready to upload", loading: "Uploading", success: "Uploaded to Brand assets", error: "Upload interrupted" };

export default function ToastProgressDemo() {
  const [upload, setUpload] = useState<Upload | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const stop = () => window.clearInterval(timer.current);
  useEffect(() => stop, []);
  // On the docs page the preview starts an upload on its own, so the toast and its bar are visible before anything is pressed.
  useEffect(() => {
    if (!demoStage()) return;
    start(0);
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs on the first mount in the preview
  }, []);

  function start(from: number, failAt?: number) {
    stop();
    let value = from;
    let tick = 0;
    setUpload({ open: true, status: "loading", value });
    timer.current = window.setInterval(() => {
      value = Math.min(value + steps[tick++ % steps.length]!, failAt ?? 100);
      const status: ToastProgressStatus = failAt !== undefined && value >= failAt ? "error" : value >= 100 ? "success" : "loading";
      if (status !== "loading") stop();
      setUpload(current => current && { ...current, status, value });
    }, 150);
  }

  const status = upload?.status ?? "idle";
  const value = upload?.value ?? 0;
  // The full upload takes about three seconds at this pace.
  const secondsLeft = Math.max(Math.ceil((100 - value) * 3 / 100), 1);
  const copy = status === "success"
    ? { title: "Upload complete", description: `${file.name} is ready to share.` }
    : status === "error"
      ? { title: "Upload interrupted", description: `The connection dropped at ${value}%. Nothing was lost.` }
      : { title: `Uploading ${file.name}`, description: `About ${secondsLeft} ${secondsLeft === 1 ? "second" : "seconds"} left` };

  return (
    <div className={styles.scene}>
      <section className={styles.panel} aria-label="Brand assets">
        <div className={styles.file}>
          <span className={styles.tile} aria-hidden="true"><FileArchive width={20} height={20} strokeWidth={1.75} /></span>
          <span className={styles.text}><span className={styles.name}>{file.name}</span><span className={styles.detail}>{file.megabytes} MB, {fileState[status]}</span></span>
        </div>
        <Row gap={2}>
          <Button onClick={() => start(0)}>Upload file</Button>
          <Button variant="secondary" onClick={() => start(0, dropAt)}>Upload on a weak signal</Button>
        </Row>
      </section>
      <Caption className={styles.note}>The weak signal drops at {dropAt}%: press Retry in the toast to pick up from there.</Caption>
      <ToastProgress
        open={upload?.open ?? false}
        onOpenChange={open => { if (!open) stop(); setUpload(current => current && { ...current, open }); }}
        position="bottom-center"
        contained
        className={styles.toast}
        // Success is left to the component: it shows as soon as the value reaches 100. Only the failure has to be told.
        status={status === "error" ? "error" : undefined}
        value={value}
        title={copy.title}
        description={copy.description}
        onRetry={() => start(value)}
        duration={4000}
      />
    </div>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ToastProgress`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` | — | What is running, or how it ended. Pass the text for the current status; the copy swaps in place when it changes. |
| `description` | `string` | — | Optional second line. While the task runs it may change on every tick (for example "27 of 42 MB") without replaying the swap. |
| `value` (required) | `number` | — | How far the task is, from 0 to 100. The bar and the number glide to each new value. |
| `status` | `"loading" \| "success" \| "error"` | — | State of the task. Left out, the toast runs until `value` reaches 100 and then shows success. |
| `icon` | `ReactNode` | — | Glyph in the status circle while the task runs. A spinner by default. |
| `formatValue` | `(value: number) => string` | `percent` | Text beside the title while the task runs. Receives the rounded value that is on screen; by default it prints a percentage such as "64%". |
| `retryLabel` | `string` | `"Retry"` | Label of the action shown when the task fails. |
| `onRetry` | `() => void` | — | Runs when Retry is pressed. Without it the failed state has no action. Set `status` back to `"loading"` to resume. |
| `open` | `boolean` | — | Whether the toast is showing (controlled). |
| `defaultOpen` | `boolean` | `true` | Whether the toast starts showing when `open` is not passed. |
| `onOpenChange` | `(open: boolean, reason?: ToastProgressCloseReason) => void` | — | Called when the toast closes itself, with the reason: `"timeout"` or `"dismiss"`. |
| `duration` | `number` | `4000` | Milliseconds the success state stays before the toast closes itself. Pass 0 or Infinity to keep it. A running or failed task never closes by itself. |
| `position` | `"inline" \| "bottom-right" \| "bottom-center" \| "bottom-left"` | `"inline"` | Where the toast sits. `inline` stays in the flow; the bottom positions pin it to the window. |
| `contained` | `boolean` | `false` | With a bottom position, pins the toast inside the nearest positioned ancestor instead of the window, for panels and previews. |
| `hotkey` | `boolean` | `true` | Alt+T moves focus into the toast (to Retry when it is showing). |
| `className` | `string` | — | Extra class for the toast surface. |

### Exported types

| Type | Definition |
| --- | --- |
| `ToastProgressStatus`: `loading` shows the bar and the number; `success` and `error` are the two ways the task can end. | `"loading" \| "success" \| "error"` |
| `ToastProgressCloseReason`: Why the toast closed: the success state timed out, or the person closed it (button, Escape or swipe). | `"timeout" \| "dismiss"` |
| `ToastProgressPosition`: `inline` renders where it is placed, like `Toast`. The others pin it to the bottom edge, like `ToastStack`. | `"inline" \| "bottom-right" \| "bottom-center" \| "bottom-left"` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Alt + T` | Moves focus to “Retry”, when the task failed, or to the close button; turn off with `hotkey={false}`. |
| `Esc` | With focus inside, closes the notice (reason `dismiss`) and returns focus to where it was. |
| `Enter` or `Space` | On “Retry”, calls `onRetry`; focus moves to the close button while the task restarts. |

## Accessibility

- The notice is `role="status"` with `aria-live="polite"`, and the bar is `role="progressbar"` named by the title, with `aria-valuetext` coming from `formatValue`.
- While the task runs, the description that changes on each update has `aria-live="off"` and the number next to the title is `aria-hidden`, so there is no reading at every step.
- On closing with focus inside, it returns to where it was; the close `aria-label` is fixed in English (“Dismiss notification”).

## Motion

- Bar and number slide together to each new `value` with a spring; at the end, the bar completes in 0.32 s and only then does the notice change to success.
- On the state change, the spinner shrinks with blur and a checkmark or an exclamation mark draws itself; the text swaps rising, the number gives way to “Retry” and, on success, the bar thins and disappears.
- With “reduce motion”, the bar jumps to the value, the spinner stays still, swaps only fade, and drag-to-dismiss is turned off.

## Responsive behavior

- In `bottom-*` positions it is fixed to the window at up to 24 rem and centers at the bottom below 30 rem; with `contained`, it attaches to the positioned ancestor.
- In a narrow notice (under 23 rem), “Retry” drops below the text.

## Notes for AI

- Import from `@/components/ryan-ui/toast-progress/toast-progress`. Update `value`; without `status`, reaching 100 already shows success. Failure needs `status="error"`, and to resume go back to `"loading"`.
- Pass the current state's text in `title`. While running or in error, the notice does not close on its own; success closes after `duration`, which restarts from zero if the user holds the notice with the mouse or focus.
- Without `onRetry`, the error appears without a button. If another notice on the page also uses `Alt + T` (`toast-stack`, `toast-action`), turn off `hotkey` on one of them.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/toast-progress · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
