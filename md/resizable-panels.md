# Resizable panels

> Painéis que trocam espaço entre si ao arrastar o divisor.

- Type: component (category Disclosure)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/resizable-panels
- Original description: Trade space between panes by dragging the divider between them.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/resizable-panels.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/resizable-panels.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/resizable-panels.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/resizable-panels.json`. Registry path, relative to the site address: `r/resizable-panels.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/resizable-panels/resizable-panels.tsx`
  - `components/ryan-ui/resizable-panels/resizable-panels.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/resizable-panels.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Email or editor layouts, such as folders, list, and reading side by side, where each person adjusts the space for the task.
- A side panel that can be hidden by dragging it to the edge (`collapsible`) and comes back through the tab that appears on the divider.
- Comparing two pieces of content side by side, such as code and preview, with limits in px (`minSize`, `maxSize`).

## When not to use

- Use [`image-compare`](image-compare.md) to compare two overlaid images with a divider.
- Use [`drawer`](drawer.md) or [`tabs`](tabs.md) on phone screens, where side-by-side panels become too narrow.
- Avoid it when you need a vertical split, with one panel above the other: the group only splits horizontally.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { ResizablePanel, ResizablePanels } from "@/components/ryan-ui/resizable-panels/resizable-panels";
import { Caption, Stack } from "./_kit";

const pane = (title: string, rows: string[]) => (
  <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-2)", width: "100%" }}>
    <strong style={{ color: "var(--text-primary)", fontSize: "var(--text-sm)" }}>{title}</strong>
    {rows.map(r => <span key={r} style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", whiteSpace: "nowrap" }}>{r}</span>)}
  </div>
);

export default function ResizablePanelsDemo() {
  return (
    <Stack gap={4} width={640}>
      <div style={{ height: 260, border: "1px solid var(--border)", borderRadius: "var(--radius-panel)", overflow: "hidden", background: "var(--surface)" }}>
        <ResizablePanels label="Mail layout">
          <ResizablePanel id="folders" label="Folders" defaultSize={22} minSize={110} collapsible>{pane("Folders", ["Inbox", "Starred", "Drafts", "Sent"])}</ResizablePanel>
          <ResizablePanel id="list" label="Messages" defaultSize={38} minSize={160}>{pane("Messages", ["Design review notes", "Invoice 2041", "Team offsite plan"])}</ResizablePanel>
          <ResizablePanel id="reader" label="Reader" defaultSize={40} minSize={160}>{pane("Design review notes", ["From Jasmine Brooks", "Thursday, 9:14 AM"])}</ResizablePanel>
        </ResizablePanels>
      </div>
      <Caption>Drag a divider, use arrow keys, or drag the folders pane closed.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ResizablePanel`

Carries a pane's configuration into `ResizablePanels`. Rendered on its own it shows its children unchanged.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | `string` | — | Stable id, also used by the dividers' `aria-controls`. |
| `label` (required) | `string` | — | Names the pane for its divider, for example "Folders". |
| `defaultSize` (required) | `number` | — | Starting share of the group. Shares are relative, so they need not add up to 100. |
| `minSize` | `number` | — | Width in px where the pane starts to resist. Its content never reflows below it; it clips and fades instead. |
| `maxSize` | `number` | — | — |
| `collapsible` | `boolean` | — | Dragging well past the minimum, or flicking toward the edge, snaps the pane closed. Its divider then shows a restore tab. |
| `defaultCollapsed` | `boolean` | — | — |
| `className` | `string` | — | — |
| `children` | `ReactNode` | — | — |

### `ResizablePanels`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Names the group for assistive technology. |
| `children` (required) | `ReactNode` | — | `ResizablePanel` elements, in order. The set of panes should stay the same for the life of the group. |
| `onLayoutChange` | `(sizes: number[]) => void` | — | Called with each pane's share in percent after a resize settles. |
| `className` | `string` | — | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | On the focused divider, move the edge 16 px; at the limit of a collapsible panel, the next arrow hides it and the opposite one brings it back at the minimum. |
| `Shift + ←` or `Shift + →` | Move the edge 64 px. |
| `Home` or `End` | Take the left panel to the smallest or largest allowed size. |
| `Enter` | Hides the neighboring collapsible panel or shows the hidden one again. |
| `Esc` | During a drag, returns the divider to the position it started from. |

## Accessibility

- Each divider is a focusable `separator` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` in percent, named by the `label` of the panel on the left and tied to it by `aria-controls`.
- With a panel hidden, the divider announces “<name> hidden, press Enter to show”, fixed text in English, and the hidden content is `inert`.
- The group is a `group` named by `label`; `aria-valuenow` already shows the destination as soon as the spring starts, without waiting for it to settle.

## Motion

- The divider follows the pointer 1:1 and resists like elastic past the limits; pulling well below the minimum of a `collapsible` panel, or making a fast gesture toward the edge, closes it.
- State changes and the keyboard use no-overshoot springs; the content fades as the panel is squeezed below the minimum and stays pinned to the moving edge, like a drawer.
- With “reduce motion” on, the panels go straight to the final size and the restore tab only fades.

## Responsive behavior

- The group is a size container: when it gets narrower than the sum of the minimums, each minimum shrinks proportionally, and the panels keep their proportions when the window changes.
- The group takes `height: 100%`, so the parent needs a defined height; the demo uses a 260 px box.

## Notes for AI

- Assemble `ResizablePanels` with `ResizablePanel` children, each with a unique `id`, `label`, and `defaultSize` (relative proportions, they do not need to add up to 100); `minSize` is in px and defaults to 80.
- The set of panels must stay the same for the whole life of the group; to swap the panels, remount the group with a different `key`.
- To remember the layout, save the percentages from `onLayoutChange` and pass them as `defaultSize` on the next mount; a double click on the divider returns to the default.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/resizable-panels · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
