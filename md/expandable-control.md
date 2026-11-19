# Expandable control

> Botão de ícone ou chip que se alarga com mola ao ser pressionado e revela o rótulo ou uma ação extra.

- Type: component (category Actions), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/expandable-control
- Original description: An icon button or chip that widens on a spring when pressed to reveal its label and an optional trailing action.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-control.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-control.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-control.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-control.json`. Registry path, relative to the site address: `r/expandable-control.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/expandable-control/expandable-control.tsx`
  - `components/ryan-ui/expandable-control/expandable-control.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/expandable-control.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A row of icons where only the control in use shows its name, like Share, Save, and Notify on an article.
- Filters or states in chip form (`variant="chip"`) that, when active, show the value and a clear action, like “Status: Open ×”.

## When not to use

- Use [`expanding-button-group`](expanding-button-group.md) when the icons form a single bar and the label should follow the pointer or focus, with no click.
- Use [`chip-group`](chip-group.md) when the person chooses among several filter options.
- Use [`button`](button.md) with a label when the action is used often: here the name only appears after a click.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Bell, Bookmark, Check, Copy, Filter, Radio, Share2, X } from "lucide-react";
import { ExpandableControl } from "@/components/ryan-ui/expandable-control/expandable-control";
import { Caption, Row, Stack } from "./_kit";

type Tool = "share" | "save" | "alerts";

export default function ExpandableControlDemo() {
  const [open, setOpen] = useState<Tool | null>("share");
  const [copied, setCopied] = useState(false);
  const [live, setLive] = useState(false);
  const [filter, setFilter] = useState(true);

  const toggle = (tool: Tool) => (next: boolean) => setOpen(next ? tool : null);
  const copy = () => { setCopied(true); window.setTimeout(() => setCopied(false), 1600); };

  return (
    <Stack gap={8} align="center">
      <Stack gap={3} align="center">
        <Row gap={2} justify="center">
          <ExpandableControl
            tone="accent"
            icon={<Share2 size={18} />}
            label={copied ? "Link copied" : "Share article"}
            expanded={open === "share"}
            onExpandedChange={toggle("share")}
            action={{ icon: copied ? <Check size={16} /> : <Copy size={16} />, label: "Copy link", onClick: copy }}
          />
          <ExpandableControl tone="accent" icon={<Bookmark size={18} />} label="Saved to Reading list" expanded={open === "save"} onExpandedChange={toggle("save")} />
          <ExpandableControl tone="accent" icon={<Bell size={18} />} label="Notify me" detail="weekly" expanded={open === "alerts"} onExpandedChange={toggle("alerts")} />
        </Row>
        <Caption>Press an icon: it opens in place and the others make room.</Caption>
      </Stack>

      <Row gap={2} justify="center">
        <ExpandableControl variant="chip" icon={<Radio size={15} />} label="Live now" detail="128 watching" expanded={live} onExpandedChange={setLive} />
        <ExpandableControl
          variant="chip"
          icon={<Filter size={15} />}
          label="Status: Open"
          expanded={filter}
          onExpandedChange={setFilter}
          action={{ icon: <X size={14} />, label: "Clear filter", onClick: () => setFilter(false) }}
        />
      </Row>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ExpandableControl`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` (required) | `ReactNode` | — | Always visible. Usually a 16 to 18 px icon. |
| `label` (required) | `string` | — | The text revealed when the control opens. Also its accessible name while only the icon shows. |
| `expanded` | `boolean` | — | Open state (controlled). |
| `defaultExpanded` | `boolean` | `false` | Open at first (uncontrolled). |
| `onExpandedChange` | `(expanded: boolean) => void` | — | Runs when the control opens or closes. |
| `action` | `ExpandableControlAction` | — | A second button revealed after the label, such as copy, clear or dismiss. |
| `variant` | `"button" \| "chip"` | `"button"` | `button` is a round control at the standard control height; `chip` is the compact pill for tags and filters. |
| `tone` | `"neutral" \| "accent"` | `"neutral"` | `accent` fills the control with the accent color while it is open. |
| `detail` | `ReactNode` | — | Extra content shown after the label while open, such as a count. |
| `disabled` | `boolean` | `false` | Turns the control off: it is dimmed and ignores pointer and keyboard input. |
| `className` | `string` | — | Extra class names for the root element. |

### Exported types

#### `ExpandableControlAction`

| Field | Type | Description |
| --- | --- | --- |
| `icon` (required) | `ReactNode` | Icon of the trailing button. |
| `label` (required) | `string` | Accessible name of the trailing button, for example "Copy link". |
| `onClick` (required) | `() => void` | Runs when the trailing button is pressed. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the main button, open or close the control; on the extra action, run `action.onClick`. |
| `Esc` | With the control open, closes it and returns focus to the main button. |

## Accessibility

- The main button has `aria-expanded` and an `aria-label` equal to `label`, open or closed; the visible label and `detail` are `aria-hidden`, so anything that is only in `detail` is not announced.
- The extra action is a second `<button>` with `aria-label` and `title` from `action.label`; it only exists with the control open and comes right after the main one in the `Tab` order.

## Motion

- On open, the width grows on a spring with no overshoot and the label slides 8 px out of a slight blur; on close, it fades quickly while the width shrinks, and neighbors follow with no jump.
- The icon stays still in a box the size of the closed control and shrinks to 0.86 on press; the extra action shrinks to 0.9.
- With “reduce motion”, the label and the action only fade, the width changes at once, and the press does not change the scale.

## Notes for AI

- To keep only one open at a time, control it in the parent: `expanded={aberto === "share"}` and `onExpandedChange={v => setAberto(v ? "share" : null)}`.
- `action` takes `icon`, `label`, and `onClick` and only appears with the control open; `detail` adds text after the label, like a count.
- `tone="accent"` fills with the accent color when open, and `variant="chip"` is the compact version, 2rem tall, for filters and tags.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/expandable-control · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
