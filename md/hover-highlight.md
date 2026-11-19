# Hover highlight

> Grupo em que um único fundo desliza até o item sob o cursor ou em foco, ideal para menus, navegação e barras de ferramentas.

- Type: component (category Actions), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/hover-highlight
- Original description: A group in which one shared background pill glides to the hovered or focused item and returns to the selected one.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hover-highlight.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hover-highlight.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hover-highlight.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hover-highlight.json`. Registry path, relative to the site address: `r/hover-highlight.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/hover-highlight/hover-highlight.tsx`
  - `components/ryan-ui/hover-highlight/hover-highlight.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/hover-highlight.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Navigation rows, menus, and icon bars where a shared background should follow the pointer and rest on the current section (`value`).
- When you want the effect on your own items: any element with `data-highlight-item`, at any depth, gets the pill.

## When not to use

- Use [`tabs`](tabs.md) or [`segmented-control`](segmented-control.md) when the chosen item swaps the displayed content: here there is no `role="tablist"` or panels.
- Use [`dropdown-menu`](dropdown-menu.md) or [`context-menu`](context-menu.md) when the actions should live in a floating menu, with menu semantics.
- Use [`floating-button-group`](floating-button-group.md) for a ready-made action bar, with tooltips and a single `Tab` stop.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Archive, Bold, Code, CreditCard, Italic, Link, List, LogOut, Quote, Settings, Strikethrough, Underline, Users } from "lucide-react";
import { HoverHighlight, HoverHighlightItem } from "@/components/ryan-ui/hover-highlight/hover-highlight";
import { Caption, Stack, Surface } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 520 };

const pages = ["Overview", "Clients", "Invoices", "Reports"];
const menu = [
  { label: "Team members", hint: "G T", icon: Users },
  { label: "Billing and plans", hint: "G B", icon: CreditCard },
  { label: "Archived projects", hint: "G A", icon: Archive },
  { label: "Workspace settings", hint: "G S", icon: Settings },
];
const tools = [
  { label: "Bold", icon: Bold }, { label: "Italic", icon: Italic }, { label: "Underline", icon: Underline }, { label: "Strikethrough", icon: Strikethrough },
  { label: "Link", icon: Link }, { label: "Bulleted list", icon: List }, { label: "Quote", icon: Quote }, { label: "Inline code", icon: Code },
];
const hint = { marginLeft: "auto", paddingLeft: "var(--space-4)", color: "var(--text-muted)", fontSize: "var(--text-xs)", fontWeight: 400 } as const;

export default function HoverHighlightDemo() {
  const [page, setPage] = useState("Overview");
  return (
    <Stack width={400} gap={5} align="center">
      <Stack gap={2} align="center">
        <Surface padding={1} style={{ borderRadius: "var(--radius-pill)" }}>
          <HoverHighlight orientation="horizontal" tone="accent" value={page} onValueChange={setPage} aria-label="Sections" role="group" style={{ flexWrap: "nowrap" }}>
            {pages.map(name => <HoverHighlightItem key={name} value={name}>{name}</HoverHighlightItem>)}
          </HoverHighlight>
        </Surface>
        <Caption>The pill follows the pointer and returns to {page}.</Caption>
      </Stack>

      <Surface padding={2} width={320}>
        <HoverHighlight aria-label="Workspace menu" role="group">
          {menu.map(({ label, hint: keys, icon: Icon }) => (
            <HoverHighlightItem key={label}>
              <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
              {label}
              <span style={hint}>{keys}</span>
            </HoverHighlightItem>
          ))}
          <HoverHighlightItem disabled>
            <LogOut size={16} strokeWidth={1.75} aria-hidden="true" />
            Leave workspace
            <span style={hint}>Owner</span>
          </HoverHighlightItem>
        </HoverHighlight>
      </Surface>

      <Surface padding={1}>
        <HoverHighlight orientation="horizontal" aria-label="Text formatting" role="toolbar" style={{ flexWrap: "nowrap" }}>
          {tools.map(({ label, icon: Icon }) => (
            <HoverHighlightItem key={label} aria-label={label} style={{ width: "var(--control-height-sm)", justifyContent: "center", padding: 0 }}>
              <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
            </HoverHighlightItem>
          ))}
        </HoverHighlight>
      </Surface>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `HoverHighlight`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Direction the items flow in. It also decides which arrow keys move focus. |
| `tone` | `"muted" \| "accent"` | `"muted"` | Pill color: a quiet neutral wash, or the solid accent with dark text on top. |
| `value` | `string \| null` | — | Value of the item the pill rests on while nothing is hovered (controlled). Pass null for none. |
| `defaultValue` | `string \| null` | `null` | Resting item when uncontrolled. |
| `onValueChange` | `(value: string) => void` | — | Called when someone picks an item that has a `value`. |
| `arrowNavigation` | `boolean` | `true` | Arrow keys, Home and End move focus between items. |
| `className` | `string` | — | Extra class for the group element. |
| `children` (required) | `ReactNode` | — | `HoverHighlightItem`s, or any elements carrying `data-highlight-item`, at any depth. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | Also accepts the props of this type, except `defaultValue` and `onChange`. |

### `HoverHighlightItem`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Identifies the item for `value` and `onValueChange`. Items without a value only take the hover pill. |
| `href` | `string` | — | Renders a link instead of a button. |
| `disabled` | `boolean` | `false` | Leaves the item out of hover, focus and selection. |
| `className` | `string` | — | Extra class for the item. |
| `children` (required) | `ReactNode` | — | Item content: text, icons, shortcuts. |
| `...props` | `HTMLAttributes<HTMLElement>` | — | Also accepts the props of this type, except `children`. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↓` or `↑` | In the `vertical` orientation (default), move focus between enabled items and wrap around at the ends; in `horizontal`, use `→` and `←`. |
| `Home` or `End` | Go to the first and last enabled item; arrows, `Home`, and `End` are turned off with `arrowNavigation={false}`. |
| `Enter` or `Space` | Trigger the focused item, and an item with `value` becomes the selected one; items with `href` are links and respond only to `Enter`. |

## Accessibility

- The group is a `<div>` with no role: pass `role` and `aria-label`, like `role="toolbar"` or `role="group"`, as the demo does.
- Items are `<button>` or, with `href`, links; the selected one gets `aria-current="true"`, and `disabled` disables the button or removes the link's `href` and sets `aria-disabled`.
- The pill is decorative (`aria-hidden`), and each item remains a `Tab` stop, in addition to the arrows.

## Motion

- A single pill background slides and resizes to the item under the pointer or with keyboard focus, on a spring with no overshoot, and returns to the selected one when the pointer leaves; between two items it stays on the last one, without flickering.
- While an item is pressed, the pill shrinks to 0.97 and releases on a spring curve.
- With “reduce motion”, the pill jumps straight to the item and does not shrink on press.

## Responsive behavior

- In the `horizontal` orientation, items wrap by default (`flex-flow: row wrap`) and the pill follows to the new line; pass `style={{ flexWrap: "nowrap" }}` to keep a single row.
- When the group size changes (a font loading, a section opening, a window resized), the pill repositions without animating.

## Notes for AI

- Build with `<HoverHighlight>` and `<HoverHighlightItem>` children; give items a `value` and control selection with `value` and `onValueChange` on the group, or use `defaultValue`.
- Items without `value` only get the hover highlight; `tone="accent"` uses the accent color with dark text, and `--hover-highlight-radius` changes the pill radius.
- `HoverHighlightItem` forwards props to the `<button>` or `<a>` (like `aria-label` and `style`); its `onClick` runs before the selection, and `event.preventDefault()` in it prevents the item from being selected.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/hover-highlight · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
