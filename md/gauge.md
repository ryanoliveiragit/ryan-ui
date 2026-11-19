# Gauge

> Mostra um valor dentro de um intervalo conhecido, com faixas de estado.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/gauge
- Original description: Show a value against a known range.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/gauge.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/gauge.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/gauge.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/gauge.json`. Registry path, relative to the site address: `r/gauge.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/gauge/gauge.tsx`
  - `components/ryan-ui/gauge/gauge.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/gauge.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A single value against a known range on a dashboard: server load, support score, quota usage.
- When the value has named states (healthy, busy, critical): with `thresholds`, color and label change the instant the number crosses each limit.

## When not to use

- Use [`progress`](progress.md) for the progress of a task with a known end, such as a file upload.
- Use [`usage-meter`](usage-meter.md) when it matters to see what fills a quota and how much remains before the limit.
- Use [`slider`](slider.md) when the user needs to adjust the value; the gauge is read-only.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Gauge } from "@/components/ryan-ui/gauge/gauge";
import { Slider } from "@/components/ryan-ui/slider/slider";
import { Caption, Row, Stack } from "./_kit";

export default function GaugeDemo() {
  const [load, setLoad] = useState(42);
  return (
    <Stack gap={8} align="center" width={640}>
      <Row gap={8} justify="center" align="start">
        <div style={{ width: 220 }}>
          <Gauge
            value={load}
            label="Server load"
            detail="12 of 16 cores busy"
            thresholds={[
              { from: 0, tone: "success", label: "Healthy" },
              { from: 60, tone: "warning", label: "Busy" },
              { from: 85, tone: "danger", label: "Critical" },
            ]}
          />
        </div>
        <div style={{ width: 220 }}>
          <Gauge value={7.4} min={0} max={10} label="Support score" detail="Average of 312 ratings" />
        </div>
      </Row>
      <Stack gap={2} width={320}>
        <Slider label="Server load" value={load} onValueChange={setLoad} min={0} max={100} />
        <Caption>Drag the slider: the ring, the number and the state label follow the thresholds.</Caption>
      </Stack>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Gauge`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `number` | — | — |
| `min` | `number` | `0` | — |
| `max` | `number` | `100` | — |
| `label` (required) | `string` | — | — |
| `detail` | `string` | — | — |
| `tone` | `GaugeTone` | `"accent"` | — |
| `thresholds` | `GaugeThreshold[]` | — | — |

### Exported types

#### `GaugeThreshold`

A band that starts at `from`: the highest band the value reaches sets the tone and names the state, so it never rests on color alone.

| Field | Type | Description |
| --- | --- | --- |
| `from` (required) | `number` | — |
| `tone` (required) | `GaugeTone` | — |
| `label` (required) | `string` | — |

## Accessibility

- The ring is a `role="meter"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and an `aria-valuetext` with the percentage and the band name; the drawing and the animated number are `aria-hidden`.
- Each `thresholds` band has a text `label`, so the state doesn't depend on color alone.
- `label` is required; the figure's `aria-label` joins label, value, and maximum with a fixed English “of”.

## Motion

- The first fill waits until half of the gauge enters the viewport: the arc closes slowly, without overshooting the value, while the number counts up.
- On each new value, the arc and number move there on a spring; the band's color and label change when the on-screen number crosses the limit, and the text enters from below if the value rose or from above if it fell.
- With “reduced motion”, the arc and number jump to the value and the texts swap with a quick fade.

## Responsive behavior

- The ring takes `min(100%, 176px)` of width and the stroke thickness scales with it; there is no size prop, so the parent's width decides.

## Notes for AI

- The center always shows the percentage within the range (`7.4` between 0 and 10 appears as 74%), not the raw value; use `detail` to state the value with its unit.
- In `thresholds`, the band with the highest `from` that the value reaches applies: include one with `from` equal to `min` so there is always a state; without `thresholds`, the color comes from `tone`.
- It accepts neither `className` nor a size: wrap it in a container with the width you want, remembering that the ring doesn't exceed 176 px.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/gauge · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
