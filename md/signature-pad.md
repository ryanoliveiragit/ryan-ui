# Signature pad

> Quadro de assinatura com traço suave que afina com a velocidade, desfazer, replay e exportação em PNG ou SVG.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/signature-pad
- Original description: Smooth ink that thins with speed, with undo, replay, and PNG or SVG export.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/signature-pad.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/signature-pad.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/signature-pad.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/signature-pad.json`. Registry path, relative to the site address: `r/signature-pad.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/signature-pad/signature-pad.tsx`
  - `components/ryan-ui/signature-pad/signature-pad.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/signature-pad.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Accepting a contract, terms, or a delivery where people sign with a finger, a stylus, or the mouse.
- Flows that store the signature as a PNG or SVG cropped to the ink.
- Tablets and phones at a counter, reception, or delivery.

## When not to use

- When confirming is enough, use an acceptance [`checkbox`](checkbox.md) or [`hold-to-confirm`](hold-to-confirm.md); drawing is slow and has no keyboard alternative.
- A signature with strong legal validity calls for a certificate and identity verification, and the pad only captures a drawing.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import SignaturePad, { type InkStroke } from "@/components/ryan-ui/signature-pad/signature-pad";
import { Caption, Stack } from "./_kit";

export default function SignaturePadDemo() {
  const [strokes, setStrokes] = useState<InkStroke[]>([]);
  return (
    <Stack width={520} gap={3}>
      <SignaturePad signer="Maria Alvarez" hint="Sign here to accept the lease" fileName="lease-signature" onChange={setStrokes} />
      <Caption>{strokes.length ? `${strokes.length} stroke${strokes.length > 1 ? "s" : ""} captured. Undo, replay or export it.` : "Draw with a mouse, finger or pen."}</Caption>
    </Stack>
  );
}
export const stage = { height: 520 };
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SignaturePad`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `signer` | `string` | — | Printed under the baseline, such as the signer's name. |
| `hint` | `string` | `"Sign here"` | Resting hint on the baseline before the first stroke. |
| `defaultColor` | `"black" \| "blue" \| "violet"` | `"black"` | — |
| `defaultWidth` | `"fine" \| "medium" \| "bold"` | `"medium"` | — |
| `onChange` | `(strokes: InkStroke[]) => void` | — | Receives the strokes after every change. |
| `fileName` | `string` | `"signature"` | File name for exports, without extension. |
| `label` | `string` | `"Signature pad"` | Accessible name of the drawing surface. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `InkColor` | `"black" \| "blue" \| "violet"` |
| `InkWidth` | `"fine" \| "medium" \| "bold"` |

#### `InkPoint`

A sampled point: position in pad units, pen pressure between 0 and 1 (or -1 when the device has none), and ms since the stroke began.

| Field | Type | Description |
| --- | --- | --- |
| `x` (required) | `number` | — |
| `y` (required) | `number` | — |
| `p` (required) | `number` | — |
| `t` (required) | `number` | — |

#### `InkStroke`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `points` (required) | `InkPoint[]` | — |
| `color` (required) | `"black" \| "blue" \| "violet"` | — |
| `width` (required) | `"fine" \| "medium" \| "bold"` | — |
| `at` (required) | `number` | When the stroke began, in ms. Replay keeps the real rhythm between strokes. |

#### `OutlineOptions`

| Field | Type | Description |
| --- | --- | --- |
| `size` (required) | `number` | Diameter of the stroke at half pressure, in pad units. |
| `thinning` | `number` | How much pressure changes the width, from 0 to 1. |
| `streamline` | `number` | How far each point trails the pointer, from 0 to 1. Higher is smoother but lags more. |
| `simulatePressure` | `boolean` | Derive pressure from speed when the device reports none: fast is thin, slow is full. |
| `taperStart` | `number` | Length over which the start and the end taper, in pad units. |
| `taperEnd` | `number` | — |
| `last` | `boolean` | False while the stroke is still being drawn, so the end does not taper yet. |

### Other exports

- `PAD_WIDTH` (value)
- `PAD_HEIGHT` (value)
- `getStrokeOutline` (function)
- `outlineToPath` (function)
- `strokePath` (function)
- `signatureToSvg` (function)
- `signatureToPng` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `Ctrl + Z` | With the pad focused, undoes the last stroke (⌘ on Mac). |
| `Ctrl + Shift + Z` or `Ctrl + Y` | With the pad focused, redo. |
| `Delete` or `Backspace` | With the pad itself focused, clear the signature, which undo brings back. |
| `Esc` | With the pad focused, stops playback. |
| `←` or `→` or `↑` or `↓` | In the color and thickness groups, change the option and move focus along, wrapping around. |

## Accessibility

- The pad is focusable, with `role="img"` and `aria-roledescription="signature pad"`; the name says how many strokes there are, and a hidden description teaches the shortcuts.
- A `role="status"` region announces stroke added, undo, clear, playback, and export, and the icon-only buttons have `aria-label` and `title`.
- Drawing has no keyboard alternative: in flows with legal value, also offer another way to sign, such as typing the name.

## Motion

- The stroke thins with speed, or follows pen pressure, and the ends taper like a nib lifting; clearing sweeps a squeegee across the pad, cutting the ink from left to right.
- Playback redraws the strokes at the original pace, with limited pauses and long signatures sped up to about three seconds, and an ink dot follows the tip.
- With “reduce motion” on, clearing is immediate and the “Sign here” hint and the buttons only fade.

## Responsive behavior

- The pad keeps the 600 × 260 aspect ratio and the strokes scale with the width; the toolbar wraps into rows when space runs short.
- On touch, the pad blocks scrolling (`touch-action: none`) so the finger can draw, so leave an area outside it for the page to scroll.

## Performance

- The live stroke is written straight to the SVG on every movement, without a React re-render, and uses the pointer's coalesced events for a smooth line.

## Notes for AI

- There is no `value` and the pad always starts empty: keep the strokes from `onChange` and generate the file with `signatureToPng(traços)` or `signatureToSvg(traços)` to send to the server, instead of the download.
- The exports are cropped to the ink, with a transparent background and fixed print colors, so they come out legible on white paper even in the dark theme.
- `signer` prints the name under the line, `hint` replaces the “Sign here”, and `label` gives the accessible name; the other internal texts are in English.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/signature-pad · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
