# Funnel chart

> Funil de conversão em que cada etapa surge depois da anterior, com o valor da etapa e a queda percentual entre elas.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/funnel-chart
- Original description: Conversion funnel with a value per stage and the drop-off percentage between stages: stages grow in one after another and morph when the data changes.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/funnel-chart.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/funnel-chart.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/funnel-chart.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/funnel-chart.json`. Registry path, relative to the site address: `r/funnel-chart.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/funnel-chart/funnel-chart.tsx`
  - `components/ryan-ui/funnel-chart/funnel-chart.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/funnel-chart.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A fixed sequence of stages (checkout, signup, onboarding) where the question is how many move from each stage to the next.
- Comparing the same funnel across segments or periods by swapping `data`: stages with the same `key` transform to the new width.
- Reports where the percentage drop between stages and the overall conversion must stay visible, without depending on the cursor.

## When not to use

- Use [`sankey-chart`](sankey-chart.md) when the flow splits or merges across several nodes, instead of following a single queue of stages.
- Use [`stepper`](stepper.md) to show which step a person is on in a flow; the funnel shows how many reached each stage.
- Use [`composition-chart`](composition-chart.md) or [`donut-chart`](donut-chart.md) when the values are parts of a whole, not stages where each contains the next.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import FunnelChart, { type FunnelStage } from "@/components/ryan-ui/funnel-chart/funnel-chart";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface, type DemoStage } from "./_kit";

export const stage: DemoStage = { height: 660 };

const stages = (values: number[]): FunnelStage[] => [
  { key: "views", label: "Product views", value: values[0] ?? 0 },
  { key: "cart", label: "Added to cart", value: values[1] ?? 0 },
  { key: "checkout", label: "Checkout", value: values[2] ?? 0 },
  { key: "payment", label: "Payment", value: values[3] ?? 0 },
  { key: "purchase", label: "Purchased", value: values[4] ?? 0 },
];

const devices: Record<string, FunnelStage[]> = {
  desktop: stages([18400, 11960, 8130, 5690, 4380]),
  mobile: stages([26900, 13180, 7250, 4060, 2640]),
};

export default function FunnelChartDemo() {
  const [device, setDevice] = useState("desktop");
  return (
    <Stack gap={4} width={560}>
      <SegmentedControl label="Device" value={device} onValueChange={setDevice} options={[{ value: "desktop", label: "Desktop" }, { value: "mobile", label: "Mobile" }]} />
      <Surface>
        <FunnelChart data={devices[device] ?? []} label="Checkout funnel, last 30 days" unit="shoppers" />
      </Surface>
      <Caption>Stages grow in from the top. Hover a stage, or focus the chart and use the arrow keys, to see how many continued and how many dropped.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `FunnelChart`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `FunnelStage[]` | — | Stages from first to last. |
| `label` (required) | `string` | — | What moves through the funnel, such as "Checkout funnel". Names the chart for assistive technology and heads the readout. |
| `unit` | `string` | `""` | Unit after counts in the header and tooltip, such as "shoppers". |
| `formatValue` | `(value: number) => string` | `value => grouped.format(value)` | Formats stage values. |
| `stageHeight` | `number` | `44` | Height of each stage bar in pixels. |
| `connectorHeight` | `number` | `28` | Height of the tapered connector between two stages in pixels. |
| `hideHeader` | `boolean` | `false` | Hides the headline with the overall conversion. |
| `activeKey` | `string \| null` | — | Controlled key of the stage in focus, or null for none. The other stages dim while one is in focus. |
| `defaultActiveKey` | `string \| null` | `null` | Stage in focus on first render when uncontrolled. |
| `onActiveChange` | `(key: string \| null) => void` | — | Called when hover, touch or the keyboard moves to another stage, or leaves the chart. |
| `className` | `string` | — | Extra class on the root figure. |

### Exported types

#### `FunnelStage`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | Stable identity. A stage that survives a data change keeps its place and morphs to its new width. |
| `label` (required) | `string` | Name of the stage, such as "Added to cart". |
| `value` (required) | `number` | How many reached this stage. Stages are drawn in the order given. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | With focus on the chart, move to the previous or next stage and show its tooltip; `←` and `→` do the same. |
| `Home` or `End` | Go to the first and last stage. |
| `Esc` | Removes the highlight from the current stage. |
| `Tab` | The chart is a single `Tab` stop: on receiving focus by keyboard, it highlights the first stage; on losing it, none. |

## Accessibility

- A focusable vertical `role="slider"` sits over the chart, and its `aria-valuetext` describes the current stage: name, value, share of the first stage, and drop from the previous one.
- The drawing, labels, and tooltip are `aria-hidden`; the same numbers are in a hidden table with stage, value, share of the first stage, and drop.
- `label` is required and names the figure; the fixed texts (“overall conversion”, “Reached”, “dropped off before this stage”) are in English.

## Motion

- When 30% of the chart enters the viewport, the bars grow from the center outward, one stage after another, from top to bottom, followed by the tapers and the drop pills; the numbers count up from zero.
- After that, swapping `data` transforms all stages at once, and the tooltip slides from stage to stage on a spring while the others fade.
- With “reduced motion”, the chart appears ready and swaps are instant.

## Responsive behavior

- Width is measured with `ResizeObserver` and the drawing uses real pixels; the label column spans 84 px to 176 px (at most 34% of the width) and long names are truncated.
- Height grows with the number of stages (44 px of `stageHeight` plus 28 px of `connectorHeight` by default); on touch, tapping a stage shows the tooltip and vertical scrolling stays free.

## Notes for AI

- `label` is required; pass `data` in stage order, with a stable `key`: each bar's width is relative to the largest value, and the percentages are relative to the first stage and the previous one.
- Pass values that don't grow from one stage to the next: the component doesn't validate this, and the drop would come out negative.
- Only the width comes from the parent; to control the highlighted stage use `activeKey` with `onActiveChange` (without updating the state, the cursor does nothing), and `hideHeader` removes the header with the overall conversion.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/funnel-chart · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
