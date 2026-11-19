# File upload

> Envio de arquivos com arrastar e soltar, limite de tamanho, progresso e mensagens de erro.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/file-upload
- Original description: A complete file selection flow with constraints, progress, and error feedback.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-upload.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-upload.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-upload.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-upload.json`. Registry path, relative to the site address: `r/file-upload.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/file-upload/file-upload.tsx`
  - `components/ryan-ui/file-upload/file-upload.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/file-upload.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Forms that ask for one or more files with type and size rules, showing the reason for rejection on the file's own row.
- Upload with per-file progress, cancellation on removal, and a retry button on failure, wired to your `onUpload`.

## When not to use

- Use [`file-dropzone`](file-dropzone.md) when a generous area to drop files is enough, with no list or progress.
- Avoid for choosing a profile image with cropping or a preview: each row shows only a type icon, the name, and the size.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { FileUpload } from "@/components/ryan-ui/file-upload/file-upload";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { layout: "center", height: 520 };

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function FileUploadDemo() {
  return (
    <Stack width={480}>
      <FileUpload
        label="Project files"
        description="Drop images or PDFs here, or browse. Up to 5 MB each."
        accept="image/*,application/pdf"
        maxSize={5 * 1024 * 1024}
        onUpload={async (file, { onProgress, signal }) => {
          for (let percent = 0; percent <= 100; percent += 10) {
            if (signal.aborted) return;
            onProgress(percent);
            await wait(180);
          }
        }}
      />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `FileUpload`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `accept` | `string` | — | — |
| `disabled` | `boolean` | `false` | — |
| `label` | `string` | `"Upload files"` | — |
| `description` | `string` | `"Drop files here or browse from your device."` | — |
| `multiple` | `boolean` | `true` | — |
| `maxSize` | `number` | — | — |
| `value` | `FileUploadItem[]` | — | — |
| `onChange` | `(files: FileUploadItem[]) => void` | — | — |
| `onUpload` | `(file: File, options: { onProgress: (percent: number) => void; signal: AbortSignal }) => Promise<void>` | — | Uploads each accepted file. Report progress from 0 to 100, resolve when done, or reject to mark the file as failed. Removing a file aborts its signal. |

### Exported types

#### `FileUploadItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `file` (required) | `File` | — |
| `error` | `string` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the upload area, open the system file-picker window. |
| `Enter` or `Space` | On each row's buttons, remove the file or retry; on removal, focus goes to the neighboring file's “remove” or back to the upload area. |

## Accessibility

- The upload area is a focusable `role="button"`, with `aria-disabled` and the description tied by `aria-describedby`; the real file `input` is hidden and out of the Tab order.
- An `aria-live` region announces files added, rejected, uploaded, failed, and removed, and each row's buttons include the file name (“Remove foto.png”, “Retry foto.png”).

## Motion

- Each row opens and closes its height on a spring; the progress bar and the percentage follow the same spring, and the bar only collapses after showing 100%.
- The status texts swap rising from a slight blur, the done checkmark is drawn, and the cloud rises slightly when a file hovers over the area.
- With “reduce motion” on, rows, bar, and texts change instantly or only fade, and the cloud does not move.

## Performance

- Each upload has its own `AbortController`: removing the file or unmounting the component cancels the signal, so your `onUpload` must respect `signal` to stop the network request.

## Notes for AI

- Although it is among the blocks, it installs at `@/components/ryan-ui/file-upload/file-upload`; without `onUpload`, files just appear as ready and nothing is sent.
- `onUpload(file, { onProgress, signal })` must call `onProgress` from 0 to 100, resolve when finished, and reject on failure; files rejected by `accept` or `maxSize` (in bytes) stay in the list and are not sent.
- `value` and `onChange` control the `{ id, file, error }` list; with `multiple={false}`, a new file replaces the previous one and cancels the upload in progress.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/file-upload · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
