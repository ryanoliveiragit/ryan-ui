# Color picker

> Uma amostra que se expande em seletor, com formatos, conta-gotas, cores salvas e leitura de contraste.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/color-picker
- Original description: A swatch that grows into a picker with format morphing, eyedropper, saved swatches, and contrast readout.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/color-picker.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/color-picker.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/color-picker.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/color-picker.json`. Registry path, relative to the site address: `r/color-picker.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Text morph](text-morph.md)
- Files, once installed:
  - `components/ryan-ui/color-picker/color-picker.tsx`
  - `components/ryan-ui/color-picker/color-picker.module.css`
  - `components/ryan-ui/text-morph/text-morph.tsx`
  - `components/ryan-ui/text-morph/text-morph.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/color-picker.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Free color choice in a theme, brand, or label editor, with opacity and text input in hex, RGB, HSL, or OKLCH.
- When legibility matters: `background` feeds the WCAG contrast reading (ratio and level) of the color over the background it will sit on.
- Flows where people save and reuse colors: saved swatches can be applied, reordered, and removed.

## When not to use

- Use [`color-swatches`](color-swatches.md) when the choice is among a few fixed colors, like a product's finishes.
- Avoid inside containers that clip content or near the right or bottom edge of the screen: the panel uses no portal and does not flip, it grows down and to the right from the swatch.
- When the color needs to be confirmed or canceled: each adjustment calls `onValueChange` right away and the done button only closes the panel.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import ColorPicker from "@/components/ryan-ui/color-picker/color-picker";
import { Caption } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 580 };

/** The swatch is the panel's top-left corner: it sits at the left of a box as wide as the panel, so the open panel is centered. */
const PANEL = 304;

export default function ColorPickerDemo() {
  // The preview opens the picker on load (focus stays on the page); the space it grows into is reserved below the swatch.
  const [color, setColor] = useState("#2F6BFF");
  return (
    <div style={{ display: "flex", width: `min(${PANEL}px, 100%)`, flexDirection: "column", alignItems: "flex-start", gap: "var(--space-3)" }}>
      <div style={{ paddingBottom: 400 }}>
        <ColorPicker
          label="Accent"
          value={color}
          onValueChange={setColor}
          defaultOpen
          defaultSwatches={[
            { id: "a", color: "#2F6BFF" },
            { id: "b", color: "#E5484D" },
            { id: "c", color: "#30A46C" },
            { id: "d", color: "#F5A524" },
          ]}
        />
      </div>
      <Caption>Current value: {color}. Drag the area, switch the format or save a swatch.</Caption>
    </div>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ColorPicker`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Any color the picker can read: hex, rgb(), hsl(), or oklch(). |
| `defaultValue` | `string` | `"#2F6BFF"` | — |
| `onValueChange` | `(hex: string) => void` | — | Receives the color as hex, with two alpha digits when it is not opaque. |
| `background` | `string` | `"#FFFFFF"` | The background the color will sit on, for the contrast readout. |
| `label` | `string` | `"Color"` | Name shown on the swatch, such as "Accent". |
| `swatches` | `ColorSwatch[]` | — | — |
| `defaultSwatches` | `ColorSwatch[]` | — | — |
| `onSwatchesChange` | `(swatches: ColorSwatch[]) => void` | — | — |
| `maxSwatches` | `number` | `7` | Most saved swatches. Saving past it drops the oldest. |
| `defaultFormat` | `"hex" \| "rgb" \| "hsl" \| "oklch"` | `"hex"` | — |
| `defaultOpen` | `boolean` | `false` | Start with the panel open, without moving focus into it (for previews and onboarding). Later opens move focus as usual. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `ColorFormat` | `"hex" \| "rgb" \| "hsl" \| "oklch"` |

#### `ColorSwatch`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `color` (required) | `string` | — |

#### `Hsva`

| Field | Type | Description |
| --- | --- | --- |
| `h` (required) | `number` | — |
| `s` (required) | `number` | — |
| `v` (required) | `number` | — |
| `a` (required) | `number` | — |

### Other exports

- `toHex` (function)
- `parseColor` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | Open and close the panel from the swatch and apply the focused saved color; in the text field, `Enter` applies the typed value. |
| `←` or `→` or `↑` or `↓` | Move the focused control by 1: saturation and brightness in the area, hue and opacity on the bars; among saved colors, `←` and `→` move focus. |
| `Shift + ←` or `Shift + →` or `Shift + ↑` or `Shift + ↓` or `Page Up` or `Page Down` | Take steps of 10 instead of 1 on the color controls. |
| `Home` or `End` | On the hue and opacity bars, go to the minimum or maximum; on saved colors, to the first or last. |
| `Alt + ←` or `Alt + →` | Change the position of the focused saved color; `Delete` or `Backspace` remove it. |
| `Esc` | Closes the panel and returns focus to the swatch; with a value being edited in the text field, it first discards what was typed. |

## Accessibility

- The swatch is a button with `aria-haspopup="dialog"` and `aria-expanded`; the panel is a non-modal `role="dialog"`, with no focus trap, and does not close if focus leaves it with `Tab`.
- On open, focus goes to the saturation and brightness control; `Esc` and the done button return focus to the swatch.
- The controls are `role="slider"` with `aria-valuetext` and the contrast has a text version for screen readers, but the internal labels (`Hue`, `Opacity`, `Done`…) are fixed in English.

## Motion

- The swatch grows into the panel through an animated clip with a spring, and the content appears just behind the advancing edge.
- Controls follow the pointer with a short spring, the format button morphs the text from one format into the other, and an invalid value makes the field shake.
- With “reduce motion” on, the panel only fades, controls jump to position, and the text switches format with no transition.

## Responsive behavior

- The panel is `min(19rem, 100vw - 32px)` wide and opens over the swatch, growing down and to the right: reserve that space in the layout.

## Performance

- The panel is only mounted while it is open or closing, and the eyedropper only appears where the browser offers the `EyeDropper` API.

## Notes for AI

- `value` accepts hex, `rgb()`, `hsl()`, or `oklch()`, but `onValueChange` always returns uppercase hex, with two alpha digits when the color is not opaque.
- Color and swatches work controlled or not: `value` or `defaultValue`, and `swatches` or `defaultSwatches` with `onSwatchesChange`; when saving beyond `maxSwatches` (default 7), the last one in the list drops out.
- Depends on `text-morph`, and the file also exports `parseColor` and `toHex` to convert colors outside the component.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/color-picker · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
