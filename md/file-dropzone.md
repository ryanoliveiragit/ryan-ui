# File dropzone

> Uma área generosa para soltar um ou vários arquivos, com progresso de envio.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/file-dropzone
- Original description: A generous target for dropping one or more files.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-dropzone.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-dropzone.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-dropzone.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-dropzone.json`. Registry path, relative to the site address: `r/file-dropzone.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/file-dropzone/file-dropzone.tsx`
  - `components/ryan-ui/file-dropzone/file-dropzone.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/file-dropzone.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Attaching one or several files by dragging, picking from the device, or pasting a screenshot with the pointer over the target or focus inside it.
- Uploads with per-file feedback: with `onUpload`, each row shows progress, completion, or failure, with a retry button.
- When there are input rules: `accept`, `maxSize`, and `maxFiles` reject files with a message, and the target shakes slightly.

## When not to use

- Use [`file-upload`](file-upload.md) when the file list needs to be controlled from outside (`value` + `onChange`); here it is internal state and `defaultItems` only applies on mount.
- Use [`prompt-input`](prompt-input.md) for attachments inside a message box, where they appear as chips.
- To replace a single image, like a profile photo or cover, a button that opens the picker takes less space than the whole target.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import FileDropzone, { type FileDropzoneUpload } from "@/components/ryan-ui/file-dropzone/file-dropzone";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 520 };

const upload: FileDropzoneUpload = (_item, { onProgress, signal }) =>
  new Promise((resolve, reject) => {
    let p = 0;
    const id = window.setInterval(() => {
      p += 12 + Math.random() * 10;
      if (p >= 100) { window.clearInterval(id); onProgress(100); resolve(); } else onProgress(Math.round(p));
    }, 220);
    signal.addEventListener("abort", () => { window.clearInterval(id); reject(new DOMException("Aborted", "AbortError")); });
  });

export default function FileDropzoneDemo() {
  return (
    <Stack width={440}>
      <FileDropzone
        label="Upload project files"
        description="Drop files here or choose from your device"
        note="PNG, JPG or PDF up to 10 MB"
        accept="image/*,.pdf"
        maxSize={10 * 1024 * 1024}
        maxFiles={5}
        onUpload={upload}
        defaultItems={[{ id: "earlier", name: "brand-guidelines.pdf", size: 2_400_000, status: "uploaded" }]}
      />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `FileDropzone`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `accept` | `string` | — | — |
| `multiple` | `boolean` | `true` | — |
| `maxFiles` | `number` | `5` | — |
| `onFilesChange` | `(files: File[]) => void` | — | — |
| `label` | `string` | `"Add files"` | — |
| `description` | `string` | `"Drop files here or choose from your device"` | — |
| `defaultItems` | `FileDropzoneItem[]` | — | Rows present at mount, such as files uploaded earlier. They render in place without an entrance. |
| `onUpload` | `(item: FileDropzoneItem, options: { onProgress: (percent: number) => void; signal: AbortSignal }) => Promise<void>` | — | Uploads each added file. Without it the list shows plain selections. |
| `maxSize` | `number` | — | Files above this many bytes fail with a size reason and never upload. |
| `listPlacement` | `"below" \| "inside"` | `"below"` | Render the file list under the drop target or inside its edge. |
| `note` | `string` | — | Replaces the small line under the description. |
| `dropLabel` | `string` | — | Label while files hover over the target. |
| `compactAt` | `number` | — | Once the list holds this many files, the prompt folds to a slim bar so the list has room. A file dragged over brings the icon back. |

### Exported types

| Type | Definition |
| --- | --- |
| `FileDropzoneStatus` | `"uploading" \| "uploaded" \| "failed"` |
| `FileDropzoneUpload`: Report 0 to 100 through onProgress, resolve when the file lands, or reject with an Error whose message becomes the row's reason. Removing the row aborts the signal. | `(item: FileDropzoneItem, options: { onProgress: (percent: number) => void; signal: AbortSignal }) => Promise<void>` |

#### `FileDropzoneItem`

`preview` is a thumbnail URL; image files added by the visitor get one automatically.

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `name` (required) | `string` | — |
| `size` (required) | `number` | — |
| `status` | `"uploading" \| "uploaded" \| "failed"` | — |
| `progress` | `number` | — |
| `error` | `string` | — |
| `retryable` | `boolean` | — |
| `file` | `File` | — |
| `preview` | `string` | — |

### Other exports

- `formatFileSize` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the target, open the system file picker. |
| `↑` or `↓` | In the list, move focus to the row above or below, keeping the same action (remove or retry). |
| `Delete` or `Backspace` | Remove the file in the focused row. |
| `Tab` | Moves through the target and each row's buttons. |

## Accessibility

- The whole target is a single `<button>` described by `description` and the note; the native `<input type="file">` stays hidden and outside the tab order.
- Additions, completions, failures, and removals go out in a `role="status"` region, rejections in a `role="alert"`, and each upload has a `role="progressbar"`; these texts are fixed in English.
- On removing a row, focus goes to the next row's remove button (or the previous one, or the target); on retry, to the same row's remove button.

## Motion

- With a file over the target, the dashed border closes into a solid line, the target pulses slowly, the icon's three sheets fan out, and a light on the border follows the pointer.
- New rows drop from the target into the list in sequence and open their own height; the bar and the percentage follow the same spring and, on completion, a checkmark draws itself.
- With “reduce motion” on, rows and texts only fade, progress jumps to the value, and there is no pulse or shake.

## Responsive behavior

- The list is a query container: below 440 px the retry button keeps only the icon, and below 300 px the file's icon or thumbnail disappears.
- `compactAt` folds the target into a low bar when the list reaches that number of files, and `listPlacement="inside"` puts the list inside the target's border.

## Performance

- Added images get a thumbnail via `URL.createObjectURL`, released on removing the row or unmounting; at those same moments, in-progress uploads are aborted by the `signal`.

## Notes for AI

- `onUpload(item, { onProgress, signal })` must return a promise: report 0 to 100, resolve on completion, and reject with an `Error` whose message becomes the failure reason; respect the `signal`.
- Without `onUpload` the list shows only the selections; `onFilesChange(files)` delivers the current `File`s, and the defaults are `multiple` on and `maxFiles={5}`.
- `maxSize` is in bytes and `accept` takes extensions, MIME types, and wildcards like `image/*`; `label`, `description`, `note`, and `dropLabel` default to English.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/file-dropzone · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
