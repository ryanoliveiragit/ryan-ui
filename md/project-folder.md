# Project folder

> Pasta que entreabre ao passar o mouse e, no clique, deixa os documentos subirem e se abrirem em leque.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/project-folder
- Original description: A folder whose flap leans open on hover while its documents peek out, then rise and fan out with a springy stagger on click.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/project-folder.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/project-folder.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/project-folder.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/project-folder.json`. Registry path, relative to the site address: `r/project-folder.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/blocks/project-folder/project-folder.tsx`
  - `components/ryan-ui/blocks/project-folder/project-folder.module.css`
  - `components/ryan-ui/lib/media.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/project-folder.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Grid or shelf of projects in portfolios, dashboards, and file home screens, where peeking at the first documents on hover gives context.
- To show at a glance the kind of content in a folder (text, chart, or image) before opening it.

## When not to use

- Use [`file-tree`](file-tree.md) to actually navigate files and subfolders, with selection and keyboard.
- Use [`card-folder`](card-folder.md) when the content is a set of cards with tabs to read one at a time.
- If opening the folder should list or open files, the block alone is not enough: when open, it only draws three sheets, with no links.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import ProjectFolderPreview from "@/components/ryan-ui/blocks/project-folder/project-folder";

export default function ProjectFolderDemo() {
  return <ProjectFolderPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ProjectFolder`

A folder whose flap leans open on hover and whose sheets rise and fan out on click.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` | — | Folder name, shown under it. |
| `meta` | `string` | — | Short line under the name while the folder is closed, such as "12 files, edited 2h ago". |
| `files` | `ProjectFile[]` | `[]` | Files in the folder. The first three peek out; the rest are counted. |
| `tone` | `"accent" \| "neutral"` | `"neutral"` | `accent` fills the folder with the accent color; `neutral` keeps it quiet. |
| `open` | `boolean` | — | Whether the folder is open. Pass it with `onOpenChange` to control it. |
| `defaultOpen` | `boolean` | `false` | Whether the folder starts open when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when a click or key press opens or closes the folder. |
| `className` | `string` | — | Extra class for the folder button. |

### `ProjectFolderPreview`

Ready preview: three project folders; opening one closes the others.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

#### `ProjectFile`

| Field | Type | Description |
| --- | --- | --- |
| `name` (required) | `string` | File name, printed at the top of its sheet. |
| `kind` | `"text" \| "chart" \| "image"` | What the little sheet shows: lines of text, a bar chart, or a picture. |
| `image` | `string` | Picture for `image` sheets. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | Open or close the folder, spreading out or gathering the sheets. |
| `Tab` | With focus coming from the keyboard, the folder opens slightly as on mouse hover. |

## Accessibility

- The whole folder is a native `<button>` with `aria-expanded`; the drawing (tab, sheets, and counter) is `aria-hidden`, so the accessible name comes from the name and the line below it.
- When open, the line below swaps the description for the names of the first three sheets plus “and N more”, hardcoded in English, and that is what the screen reader then announces.
- The sheet images have empty `alt`, because they are decorative.

## Motion

- With the mouse over it or keyboard focus, the tab tilts back 24° in 3D and the sheets peek out; on click, the tab opens to 42° and the sheets rise in a fan on a slightly bouncy spring, 45 ms one after another.
- The tab uses a heavier spring, with practically no bounce; on close, the sheets return in reverse order and the line under the name swaps with a short slide.
- With “reduce motion” on, the tab does not rotate, the sheets jump into place, and the line only fades.

## Responsive behavior

- Everything scales from `--folder-size` (default 13rem), set on the folder or a parent; the folder reserves space above itself for the sheets to rise, but when open they extend slightly past the sides.

## Notes for AI

- Import the named component `ProjectFolder`; the default export is a shelf of three folders where opening one closes the others, built with `open` and `onOpenChange`.
- `files` draws only the first three sheets (`kind` `text`, `chart`, or `image`, with `image` for the URL) and counts the rest; to show the real content, react to `onOpenChange`.
- Leave side space between neighboring folders for the open fan; `tone="accent"` paints the folder in the accent color and the sheets' paper stays light in both themes.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/project-folder · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
