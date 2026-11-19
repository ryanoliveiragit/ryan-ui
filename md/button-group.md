# Button group

> Ações relacionadas numa só superfície, com realce que desliza entre os segmentos e menu acoplado.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/button-group
- Original description: Related actions joined into one surface with hairline dividers: a hover highlight glides between segments, the pressed one answers in place, and an attached menu can close the row.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/button-group.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/button-group.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/button-group.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/button-group.json`. Registry path, relative to the site address: `r/button-group.json`.

- npm packages: `@radix-ui/react-dropdown-menu`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/button-group/button-group.tsx`
  - `components/ryan-ui/button-group/button-group.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-dropdown-menu lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/button-group.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Related actions on the same object that should read as a single control: Share, Download, Archive.
- When the less-used actions fit in a menu attached to the end of the row (`menu` prop).
- Bars where labels can shrink to icons when width runs short (`collapseLabels`).

## When not to use

- Use [`toggle-group`](toggle-group.md) or [`segmented-control`](segmented-control.md) when the buttons represent a state or a choice: here no segment is marked as pressed.
- Use [`split-button`](split-button.md) when there is a main action and the others are alternatives to it.
- Use [`overflow-actions`](overflow-actions.md) when the bar should send the actions that do not fit the width to a menu.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Archive, Copy, Link2, Share2, Trash2, Download, Bold, Italic, Underline } from "lucide-react";
import ButtonGroup from "@/components/ryan-ui/button-group/button-group";
import { Caption, Field, Row, Stack, demoStage } from "./_kit";

export default function ButtonGroupDemo() {
  const [shareLabel, setShareLabel] = useState("Share");
  const [last, setLast] = useState("None yet");
  const share = () => { setShareLabel("Copied"); setLast("Link copied"); window.setTimeout(() => setShareLabel("Share"), 1600); };
  return (
    // Três usos lado a lado, cada um com o seu rótulo: assim o grupo vertical não parece um menu solto ao lado dos outros.
    <Stack gap={8} align="center" width={560}>
      <Field label="Actions with an attached menu">
      <ButtonGroup
        label="Document actions"
        container={demoStage()}
        items={[
          { id: "share", label: shareLabel, reserve: ["Share", "Copied"], icon: <Share2 size={15} aria-hidden="true" />, onSelect: share },
          { id: "download", label: "Download", icon: <Download size={15} aria-hidden="true" />, onSelect: () => setLast("Download started") },
          { id: "archive", label: "Archive", icon: <Archive size={15} aria-hidden="true" />, onSelect: () => setLast("Archived") },
        ]}
        menu={{
          label: "More actions",
          items: [
            { id: "copy", label: "Duplicate", icon: <Copy size={15} aria-hidden="true" />, onSelect: () => setLast("Duplicated") },
            { id: "link", label: "Copy link", icon: <Link2 size={15} aria-hidden="true" />, onSelect: () => setLast("Link copied") },
            { id: "delete", label: "Delete", icon: <Trash2 size={15} aria-hidden="true" />, destructive: true, onSelect: () => setLast("Deleted") },
          ],
        }}
      />
      </Field>
      <Row justify="center" align="start" gap={10}>
        <Field label="Solid, icon only">
        <ButtonGroup
          label="Text formatting"
          variant="solid"
          size="sm"
          items={[
            { id: "bold", label: "Bold", icon: <Bold size={15} aria-hidden="true" />, iconOnly: true, onSelect: () => setLast("Bold") },
            { id: "italic", label: "Italic", icon: <Italic size={15} aria-hidden="true" />, iconOnly: true, onSelect: () => setLast("Italic") },
            { id: "underline", label: "Underline", icon: <Underline size={15} aria-hidden="true" />, iconOnly: true, onSelect: () => setLast("Underline") },
          ]}
        />
        </Field>
        <Field label="Vertical">
        <ButtonGroup
          label="View mode"
          orientation="vertical"
          size="sm"
          items={[
            { id: "day", label: "Day", onSelect: () => setLast("Day view") },
            { id: "week", label: "Week", onSelect: () => setLast("Week view") },
            { id: "month", label: "Month", onSelect: () => setLast("Month view") },
          ]}
        />
        </Field>
      </Row>
      <Caption>Last action: {last}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ButtonGroup`

Related actions joined into one surface: a shared border and radius, hairline dividers, no gaps. One soft highlight glides between segments under the pointer or keyboard focus, the pressed segment answers in place, and an optional chevron segment opens more actions in a menu aligned to the group's edge.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `ButtonGroupItem[]` | — | — |
| `menu` | `ButtonGroupMenu` | — | Adds a trailing chevron segment that opens these actions in a menu aligned to the group's edge. |
| `label` (required) | `string` | — | Accessible name of the group, such as "Document actions". |
| `variant` | `"outline" \| "solid"` | `"outline"` | — |
| `size` | `"sm" \| "md"` | `"md"` | — |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | — |
| `collapseLabels` | `boolean` | `true` | When the row does not fit its container, segments with an icon drop their label and keep the icon. Horizontal only. |
| `disabled` | `boolean` | `false` | Disables every segment and the menu. |
| `container` | `HTMLElement \| null` | — | Render the menu inside this element and limit collisions to it (used by the demo stages). |
| `className` | `string` | — | — |
| `style` | `CSSProperties` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `ButtonGroupVariant` | `"outline" \| "solid"` |
| `ButtonGroupSize` | `"sm" \| "md"` |
| `ButtonGroupOrientation` | `"horizontal" \| "vertical"` |

#### `ButtonGroupItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable key for the segment. |
| `label` (required) | `string` | Visible text and the accessible name. Changing it crossfades in place, so "Share" can answer "Copied". |
| `reserve` | `string[]` | Every other label this segment can show, such as ["Copied"]. The segment sizes to the widest, so a label change never resizes it. |
| `icon` | `ReactNode` | — |
| `iconOnly` | `boolean` | Shows only the icon; the label becomes the accessible name and the tooltip. |
| `content` | `ReactNode` | Visible content in place of the label, such as a live value. The label stays the accessible name. |
| `onSelect` | `() => void` | — |
| `href` | `string` | Renders the segment as a link. |
| `disabled` | `boolean` | — |

#### `ButtonGroupMenuItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `icon` | `ReactNode` | — |
| `onSelect` | `() => void` | — |
| `href` | `string` | — |
| `disabled` | `boolean` | — |
| `destructive` | `boolean` | Colors the item as a destructive action. |

#### `ButtonGroupMenu`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | Accessible name and tooltip of the chevron segment, such as "More actions". |
| `items` (required) | `ButtonGroupMenuItem[]` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` or `Shift + Tab` | Move through each segment in order; all of them are tab stops. |
| `→` or `←` | Move focus between segments and wrap around at the ends; in the `vertical` orientation `↓` and `↑` apply, and in RTL the arrows are reversed. |
| `Home` or `End` | Move focus to the first and last segment. |
| `Enter` or `Space` | Trigger the focused segment (a segment with `href` is a link and responds only to `Enter`); on the arrow, open the menu. |
| `↓` | On the arrow, opens the menu; inside it, `↓` and `↑` loop through the items and `Enter` selects. |
| `Esc` | Closes the menu and returns focus to the arrow. |

## Accessibility

- The container is `role="group"` with the required `label` as its name; each segment is a `<button>` or, with `href`, a link.
- `iconOnly` segments, with `content`, or collapsed ones use the `label` as `aria-label` (and, with no visible text, also as `title`); a `disabled` item becomes `aria-disabled` and stays focusable.
- A label that changes right after the segment itself is triggered, like “Copied”, is announced once by an `aria-live="polite"` region.

## Motion

- A single highlight slides between segments under the pointer or keyboard focus, on a spring with no overshoot, and neighboring dividers disappear so it reads as one shape.
- The press shrinks only the segment content (0.97; 0.9 on icon ones); a new label rises from a slight blur inside a fixed-width box when `reserve` lists the texts.
- With “reduce motion”, the highlight jumps to the segment, there is no press scale, and the menu only fades.

## Responsive behavior

- With `collapseLabels` (default), when the row does not fit the container, segments with an icon hide the label, which moves to `aria-label` and `title`, and get it back when there is room again.
- The group never exceeds 100% of the container: what is left over scrolls horizontally with no visible scrollbar; in the `vertical` orientation the segments take the full width and do not collapse.

## Performance

- Each group uses `ResizeObserver` on the parent container, on itself, and on each segment, and tests segment positions on every pointer move: suited to bars, not to dozens of groups in a list.

## Notes for AI

- `label` names the group and is required; each item needs `id` and `label`, and the action goes in `onSelect` (or `href`, for the segment to become a link).
- If a label changes (Share → Copied), list all the texts in `reserve` so the segment keeps the width of the longest.
- It is a group of actions with no selected state; `menu` (`label` and `items`) adds the arrow with the menu, and `variant="solid"` is the filled, more prominent version.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/button-group · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
