# Scrub input

> Campo numérico estilo Figma: arraste o rótulo para ajustar ou digite valores, unidades e contas.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/scrub-input
- Original description: A Figma-style number field: drag the label to scrub, or type values, units, and arithmetic.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/scrub-input.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/scrub-input.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/scrub-input.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/scrub-input.json`. Registry path, relative to the site address: `r/scrub-input.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/scrub-input/scrub-input.tsx`
  - `components/ryan-ui/scrub-input/scrub-input.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/scrub-input.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Property panels and inspectors (width, position, rotation, opacity), where dragging is faster than typing.
- Numeric fields that benefit from typed calculations and units, such as `320/2 + 8` or `50%`.
- Circular values, such as rotation from 0 to 360, with `wrap`.

## When not to use

- Use [`number-field`](number-field.md) in ordinary forms, where people expect visible plus and minus buttons.
- Use [`slider`](slider.md) when the position within the range matters more than the number.
- Use [`money-input`](money-input.md) for monetary values.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { RotateCw } from "lucide-react";
import ScrubInput from "@/components/ryan-ui/scrub-input/scrub-input";
import { Caption, Row, Stack } from "./_kit";

export default function ScrubInputDemo() {
  const [w, setW] = useState(320);
  return (
    <Stack width={360} gap={4}>
      <Row gap={3} wrap={false}>
        <ScrubInput label="W" value={w} onValueChange={setW} min={0} max={1200} unit="px" units={["px", "%"]} />
        <ScrubInput label="H" defaultValue={180} min={0} max={1200} unit="px" units={["px", "%"]} />
      </Row>
      <Row gap={3} wrap={false}>
        <ScrubInput label={<RotateCw size={16} aria-hidden="true" />} aria-label="Rotation" defaultValue={45} min={0} max={360} wrap unit="°" />
        <ScrubInput label="Opacity" defaultValue={80} min={0} max={100} unit="%" />
      </Row>
      <Caption>Drag a label to scrub, double click to reset, or type math such as 320/2 + 8. Width: {w}.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ScrubInput`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `ReactNode` | — | Text or a 16px icon. Icon labels need `aria-label` so the field keeps an accessible name. |
| `value` | `number` | — | — |
| `defaultValue` | `number` | `0` | — |
| `onValueChange` | `(value: number, details: ScrubInputChangeDetails) => void` | — | Fires for every change, including each step of a scrub. |
| `onValueCommit` | `(value: number, details: ScrubInputChangeDetails) => void` | — | Fires once when a change settles: a scrub ends, Enter or blur commits typing, or a key step lands. |
| `min` | `number` | `-Infinity` | — |
| `max` | `number` | `Infinity` | — |
| `step` | `number` | `1` | One step for arrows and scrubbing. Defaults to 1. |
| `fineStep` | `number` | — | Step with Alt held. Defaults to a tenth of `step`. |
| `coarseStep` | `number` | — | Step with Shift held. Defaults to ten times `step`. |
| `precision` | `number` | — | Decimal places kept. Defaults to the precision of `fineStep`. |
| `pixelsPerStep` | `number` | `2` | Pointer travel in px for one step while scrubbing. Defaults to 2. |
| `wrap` | `boolean` | `false` | Values wrap around from `max` to `min` instead of stopping, as rotation does. Needs both limits. |
| `unit` | `string` | — | The unit shown after the number. With more than one entry in `units`, it becomes a button that cycles them. |
| `defaultUnit` | `string` | — | — |
| `units` | `readonly string[]` | — | Units a typed value may carry, such as ["px", "%"]. Defaults to the current unit. |
| `onUnitChange` | `(unit: string) => void` | — | — |
| `resetValue` | `number` | — | Double click the label to return here. |
| `track` | `boolean` | — | Shows how far the value sits between `min` and `max` as a quiet fill. On by default when both limits are set. |
| `size` | `"sm" \| "md"` | `"md"` | — |
| `pointerLock` | `boolean` | `true` | Locks the pointer while scrubbing when the browser allows it. On by default. |
| `className` | `string` | — | — |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | — | Also accepts the props of this type, except `value`, `defaultValue`, `onChange`, `type`, `size`, `min`, `max`, `step` and `prefix`. |

### Exported types

| Type | Definition |
| --- | --- |
| `ScrubInputSource` | `"scrub" \| "type" \| "key" \| "reset"` |

#### `ScrubInputChangeDetails`

| Field | Type | Description |
| --- | --- | --- |
| `source` (required) | `"scrub" \| "type" \| "key" \| "reset"` | What produced the value: a label drag, a typed entry, an arrow key, or a double click reset. |
| `unit` (required) | `string` | The unit in effect after the change. |

### Other exports

- `evaluateScrubExpression` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | Add or subtract one `step`; with Shift they use `coarseStep` (10× by default) and land on the coarse grid, such as 13 going to 20, and with Alt they use `fineStep` (one tenth). |
| `Enter` | Confirms the typed text, including calculations such as `(100-24)/2` and units from `units`. |
| `Esc` | Discards the typed text and returns to the last value; during a label drag, cancels the drag. |
| `Tab` | Leaving the field confirms the typed text, like Enter. |

## Accessibility

- The field is a `role="spinbutton"` with `aria-valuetext` that speaks the unit in full (“50 percent”, “45 degrees”) and `aria-invalid` for a moment when a calculation is rejected.
- With text in `label`, the `<label>` names the field; with an icon, pass `aria-label`, and the unit button announces itself as “Unit: px. Change unit”.
- Dragging the label is pointer-only; by keyboard, the same adjustment is done with the arrow keys and the modifiers.

## Motion

- At the limits, the field stretches like elastic in the drag direction and springs back on release, and an invalid calculation makes the field shake once.
- The fill bar follows the drag 1:1 and slides to typed values; holding Shift or Alt shows a “×10” or “×0.1” tag.
- With “reduce motion” on, there is no elastic or shake, the bar jumps to the value, and tags and unit only fade.

## Responsive behavior

- It fills the whole column (set it with `--scrub-input-width`); on touch, the label drags horizontally and vertical scrolling goes to the page, and pointer lock applies only to mouse.

## Notes for AI

- Designed for dense rows: short `label` (“W”, “X”, or a 16px icon with `aria-label`), `min`, `max`, `unit`, and `size="sm"`.
- `unit` makes the unit controlled, so handle `onUnitChange`; for the unit button and a typed `50%` to switch the unit on their own, use `defaultUnit`.
- `onValueChange` fires on every drag step, with `details.source`; save in `onValueCommit`, which arrives on release, on Enter, on leaving the field, and on each arrow key.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/scrub-input · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
