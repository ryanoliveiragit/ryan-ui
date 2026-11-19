# Segmented control

> Alterne entre poucas visões relacionadas com um seletor segmentado de destaque deslizante.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/segmented-control
- Original description: Switch between a small set of related views.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/segmented-control.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/segmented-control.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/segmented-control.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/segmented-control.json`. Registry path, relative to the site address: `r/segmented-control.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/segmented-control/segmented-control.tsx`
  - `components/ryan-ui/segmented-control/segmented-control.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/segmented-control.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Switching between a few views of the same information, such as Day, Week, Month, and Year, or Chart and Table.
- Single-value filters in toolbars, where the active option must stay visible at all times.

## When not to use

- Use [`tabs`](tabs.md) when each option shows its own content panel and needs the tab and panel roles.
- Use [`toggle-group`](toggle-group.md) when the bar is made of icons or allows several options on at the same time.
- Use [`select`](select.md) when there are many options or the labels are long.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack } from "./_kit";

export default function SegmentedControlDemo() {
  const [range, setRange] = useState("week");
  const [view, setView] = useState("chart");
  const revenue: Record<string, string> = { day: "$1,240", week: "$8,915", month: "$37,402", year: "$441,870" };
  return (
    <Stack width={380} gap={6} align="center">
      <Stack gap={2} align="center">
        <SegmentedControl label="Time range" value={range} onValueChange={setRange} options={[{ value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }, { value: "year", label: "Year" }]} />
        <Caption>Revenue this {range}: {revenue[range]}</Caption>
      </Stack>
      <SegmentedControl label="View" value={view} onValueChange={setView} options={[{ value: "chart", label: "Chart" }, { value: "table", label: "Table" }]} />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SegmentedControl`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` (required) | `Segment[]` | — | — |
| `value` (required) | `string` | — | — |
| `onValueChange` (required) | `(value: string) => void` | — | — |
| `label` | `string` | — | — |
| `onOptionIntent` | `(value: string) => void` | — | Called when the pointer or focus reaches an option, before it is chosen. Use it to start loading what that option shows. |
| `className` | `string` | — | — |

### Exported types

#### `Segment`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | — |
| `label` (required) | `string` | — |
| `accessory` | `ReactNode` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `↓` | Select the next segment and move focus to it, wrapping to the first after the last. |
| `←` or `↑` | Select the previous one, also wrapping. |
| `Home` or `End` | Select the first or last segment. |
| `Tab` | Goes straight to the selected segment; the others stay out of the tab order. |

## Accessibility

- It is a `role="group"` of buttons with `aria-pressed` and a single Tab stop; pass `label`, which becomes the group's `aria-label`.
- The segments are toggle buttons, not tabs: there is no `tabpanel` tied to them, so the content that changes is the page's responsibility.

## Motion

- A single pill slides to the chosen segment on a no-overshoot spring; the labels never change size or weight, only the color follows.
- With “reduce motion” on, the pill changes place instantly and the scroll to the chosen segment is no longer animated.

## Responsive behavior

- When the segments do not fit, the track scrolls horizontally inside the control, fades only the side that has more content, and scrolls the chosen segment into view.
- On screens under 380px wide, the inner spacing of each segment shrinks.

## Notes for AI

- Default export and always controlled: `import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control"`, with `options`, `value`, and `onValueChange`.
- `onOptionIntent` fires when the pointer or focus reaches a segment, before the choice; use it to preload what the segment will show.
- `accessory` puts a badge or counter after the label; the arrows already select, so each keyboard step calls `onValueChange`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/segmented-control · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
