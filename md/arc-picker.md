# Arc picker

> Seletor radial: as opções ficam em um arco, giram com a rolagem, o arraste ou as setas, e uma moldura abraça a opção ativa.

- Type: component (category Inputs), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/arc-picker
- Original description: A radial text picker: options sit on an arc, the wheel, a drag or the arrow keys turn the dial, and one bracket frame resizes around the active label.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/arc-picker.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/arc-picker.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/arc-picker.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/arc-picker.json`. Registry path, relative to the site address: `r/arc-picker.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/arc-picker/arc-picker.tsx`
  - `components/ryan-ui/arc-picker/arc-picker.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/arc-picker.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Single choice among text options where the rotating gesture is part of the experience: camera lens, mode, period.
- Touch screens or ones with a mouse wheel, where dragging along the arc or scrolling is more direct than opening a menu.
- Ordered sets where seeing the current option and its neighbors is enough: labels fade with distance and disappear a little over three positions from the apex.

## When not to use

- Use [`segmented-control`](segmented-control.md) when there are few options and all need to be visible at the same time.
- Use [`wheel-picker`](wheel-picker.md) for vertical reels of time or date, with several columns.
- Use [`select`](select.md) in dense forms: the horizontal arc takes 30rem by 8rem by default.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { ArcPicker } from "@/components/ryan-ui/arc-picker/arc-picker";
import type { ArcOption, ArcPickerProps } from "@/components/ryan-ui/arc-picker/arc-picker";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack } from "./_kit";

type Side = NonNullable<ArcPickerProps["side"]>;

const lenses: (ArcOption & { spec: string })[] = [
  { value: "13", label: "Ultra wide", spec: "13 mm, f/2.4" },
  { value: "24", label: "Wide", spec: "24 mm, f/1.8" },
  { value: "35", label: "Street", spec: "35 mm, f/1.8" },
  { value: "50", label: "Portrait", spec: "50 mm, f/1.4" },
  { value: "85", label: "Telephoto", spec: "85 mm, f/2.8" },
  { value: "macro", label: "Macro", spec: "100 mm macro, f/2.8" },
  { value: "200", label: "Wildlife", spec: "200 mm, f/4" },
];

const sides: { value: Side; label: string }[] = [
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

export default function ArcPickerDemo() {
  const [lens, setLens] = useState("35");
  const [side, setSide] = useState<Side>("top");
  const chosen = lenses.find(option => option.value === lens);

  return (
    <Stack gap={4} align="center" width={480}>
      {/* A fixed slot, so the controls below hold still while the arc changes side. */}
      <div style={{ display: "flex", width: "100%", height: 280, alignItems: "center", justifyContent: "center" }}>
        <ArcPicker label="Lens" side={side} options={lenses} value={lens} onValueChange={setLens} />
      </div>
      <SegmentedControl label="Arc side" options={sides} value={side} onValueChange={next => setSide(next as Side)} />
      <Caption>{chosen?.label}: {chosen?.spec}. Scroll, drag along the arc, click a label or use the arrow keys.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ArcPicker`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` (required) | `ArcOption[]` | — | The options in order along the arc. |
| `value` | `string` | — | The chosen value (controlled). |
| `defaultValue` | `string` | — | The value chosen at first (uncontrolled). Defaults to the first enabled option. |
| `onValueChange` | `(value: string) => void` | — | Runs when the dial settles on a new option. |
| `label` (required) | `string` | — | Accessible name, for example "Billing period". |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Which part of the dial shows: `top` arches up, `bottom` hangs down, `left` and `right` bow sideways with the labels stacked. |
| `radius` | `number` | — | Radius of the dial in px. Larger is flatter. Defaults to 320 for the top and bottom arcs and 240 for the side arcs. |
| `gap` | `number` | — | Distance between the centers of neighboring options along the arc, in px. By default each pair is spaced by its own label widths. |
| `ticks` | `boolean` | `true` | Draws the tick marks that turn with the dial and the pointer at the apex. |
| `disabled` | `boolean` | `false` | Turns the control off: it is dimmed and ignores pointer and keyboard input. |
| `className` | `string` | — | Extra class names for the root element. |
| `style` | `CSSProperties` | — | Inline styles for the root element, for sizes and CSS variables. |

### Exported types

#### `ArcOption`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | The value reported when this option is chosen. |
| `label` | `string` | The text on the arc. Falls back to the value. |
| `disabled` | `boolean` | Shown dimmed; the dial never comes to rest on it. |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `↓` | Rotates to the next enabled option. |
| `←` or `↑` | Rotates to the previous enabled option. |
| `Home` or `End` | Goes to the first or last enabled option. |

## Accessibility

- The root is a focusable `role="listbox"` with `aria-activedescendant` pointing to the chosen option; each label is a `role="option"` with `aria-selected`.
- `label` is required and becomes the `aria-label`; `aria-orientation` becomes `vertical` on the `left` and `right` arcs.
- Options with `disabled` appear struck through, get `aria-disabled`, and the disc never stops on them, whether by key, wheel, click, or drag.

## Motion

- The disc rotates to the option with a gentle spring and, on releasing a drag, inherits the gesture's velocity before settling on the nearest enabled option.
- The apex brackets adjust with a spring to the width of the nearest label, and labels shrink and fade as they move away.
- Beyond the ends the drag offers elastic resistance; with “reduce motion” on, disc and brackets jump straight to the final position.

## Responsive behavior

- The `top` or `bottom` arc measures 30rem by 8rem (variables `--span` and `--depth`, adjustable via `style`) and respects `max-width: 100%`; the ends fade out through a mask.
- On touch, the horizontal arc lets the page scroll vertically (`touch-action: pan-y`) and the side arcs, horizontally.

## Performance

- Label widths are measured in layout and again when fonts load, and each option tracks the disc position on every frame: keep the list short.

## Notes for AI

- `options` is `{ value, label?, disabled? }[]` with a unique `value`, and the component's `label` is required; use `value` + `onValueChange` or `defaultValue` (without it, the first enabled option applies).
- `side` chooses the disc face (`top`, `bottom`, `left`, `right`), a larger `radius` makes the arc flatter, and `gap` fixes the distance between options, which by default follows each label's width.
- Over the component, the mouse wheel rotates the disc instead of scrolling the page (scrolling only returns at the ends): do not put it in the way of a long scroll.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/arc-picker · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
