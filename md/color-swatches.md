# Color swatches

> Amostras de cor em grupo de opções: um anel desliza com mola até a cor escolhida e cada amostra reage ao toque.

- Type: component (category Inputs), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/color-swatches
- Original description: A radio group of color swatches whose selection ring glides between swatches on a spring, with press feedback.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/color-swatches.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/color-swatches.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/color-swatches.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/color-swatches.json`. Registry path, relative to the site address: `r/color-swatches.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/color-swatches/color-swatches.tsx`
  - `components/ryan-ui/color-swatches/color-swatches.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/color-swatches.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Choosing one of a few fixed colors: a product finish, the color of a label or a project.
- When some color may be unavailable: `disabled` on the option shows it struck through, and the keyboard skips over it.
- In forms: `name` adds a hidden field with the chosen value.

## When not to use

- Use [`color-picker`](color-picker.md) when the person needs any color, with hue, opacity, or a typed value.
- Use [`radio-cards`](radio-cards.md) when each option needs visible text, price, or description; here the color name only appears in the mouse tooltip and for the screen reader.
- To check several colors at the same time: it is a radio group, so only one is chosen.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { ColorSwatches } from "@/components/ryan-ui/color-swatches/color-swatches";
import type { ColorSwatch } from "@/components/ryan-ui/color-swatches/color-swatches";
import { Caption, Field, Stack, Surface } from "./_kit";

// Product finishes are data, not theme: these are the colors of the item being sold, so they are literal values rather than tokens.
const finishes: ColorSwatch[] = [
  { value: "graphite", color: "#3a3d42", label: "Graphite" },
  { value: "bone", color: "#e9e4d8", label: "Bone" },
  { value: "moss", color: "#6f7f4f", label: "Moss" },
  { value: "clay", color: "#c2714f", label: "Clay" },
  { value: "harbor", color: "#3f6c8f", label: "Harbor blue" },
  { value: "plum", color: "#6d3b5e", label: "Plum", disabled: true },
];

const labels: ColorSwatch[] = [
  { value: "teal", color: "var(--tone-teal)", label: "Teal" },
  { value: "sky", color: "var(--tone-sky)", label: "Sky" },
  { value: "violet", color: "var(--tone-violet)", label: "Violet" },
  { value: "orchid", color: "var(--tone-orchid)", label: "Orchid" },
  { value: "rose", color: "var(--tone-rose)", label: "Rose" },
  { value: "amber", color: "var(--tone-amber)", label: "Amber" },
  { value: "green", color: "var(--tone-green)", label: "Green" },
];

export default function ColorSwatchesDemo() {
  const [finish, setFinish] = useState("moss");
  const [tag, setTag] = useState("sky");
  const chosen = finishes.find(option => option.value === finish);

  return (
    <Surface width={380} padding={6}>
      <Stack gap={6}>
        <Field label={<>Finish: <strong style={{ color: "var(--foreground)", fontWeight: 600 }}>{chosen?.label}</strong></>}>
          <ColorSwatches label="Finish" options={finishes} value={finish} onValueChange={setFinish} />
          <Caption>Plum is out of stock until March.</Caption>
        </Field>
        <Field label="Label color">
          <ColorSwatches label="Label color" options={labels} value={tag} onValueChange={setTag} size="sm" shape="rounded" />
        </Field>
      </Stack>
    </Surface>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ColorSwatches`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` (required) | `ColorSwatch[]` | — | The colors to choose from. |
| `value` | `string` | — | The chosen value (controlled). |
| `defaultValue` | `string` | — | The value chosen at first (uncontrolled). |
| `onValueChange` | `(value: string) => void` | — | Runs when a swatch is chosen. |
| `label` (required) | `string` | — | Accessible name of the group, for example "Color". |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Swatch diameter: `sm` 24 px, `md` 32 px, `lg` 40 px. |
| `shape` | `"circle" \| "rounded"` | `"circle"` | Swatch shape. |
| `name` | `string` | — | Field name: adds a hidden input so the value submits with a form. |
| `disabled` | `boolean` | `false` | Turns the whole group off. |
| `className` | `string` | — | Extra class names for the root element. |

### Exported types

#### `ColorSwatch`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | The value reported when this swatch is chosen. |
| `color` (required) | `string` | Any CSS color: a hex code, `oklch(...)`, or a token such as `var(--tone-teal)`. |
| `label` | `string` | Spoken name and tooltip, for example "Forest green". Falls back to the value. |
| `disabled` | `boolean` | Shown struck through and skipped by the keyboard, for a color that is unavailable. |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `↓` | Chooses the next enabled color; from the last it wraps to the first. |
| `←` or `↑` | Chooses the previous enabled color; from the first it goes to the last. |
| `Home` or `End` | Chooses the first or last enabled color. |
| `Enter` or `Space` | Chooses the focused color, when it is not already the chosen one. |
| `Tab` | Enters the group at the chosen color, or at the first enabled one when nothing has been chosen. |

## Accessibility

- The group is a `role="radiogroup"` named by `label` (required) and each color is a `role="radio"` button with `aria-checked` and a roving tabindex.
- Give each option a `label`: it is the name read by the screen reader and the mouse tooltip; without it, what is heard is the `value`.
- The choice is marked by an outer ring and the unavailable color by a strike, so neither state depends on color alone.

## Motion

- A single ring slides from one color to another with a gentle spring, instead of vanishing from one and appearing on the other.
- The swatch grows slightly under the cursor and sinks when pressed.
- With “reduce motion” on, the ring changes place instantly and swatches do not change scale.

## Responsive behavior

- Swatches wrap (`flex-wrap`) and measure 24, 32, or 40 px depending on `size` (`sm`, `md`, `lg`).

## Notes for AI

- `options` is `{ value, color, label?, disabled? }[]`, and `color` accepts any CSS color, including tokens like `var(--tone-teal)`.
- Controlled with `value` + `onValueChange` or uncontrolled with `defaultValue`; the group's `label` is required and does not show on screen.
- Since the color name is not visible, show the choice as text alongside, as the demo does with “Finish: Moss”; `shape` toggles between `circle` and `rounded`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/color-swatches · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
