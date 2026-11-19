# Usage meter

> Medidor de consumo dividido em partes, com alerta quando o uso se aproxima ou passa do limite do plano.

- Type: component (category Feedback)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/usage-meter
- Original description: Show what fills an allowance and how close it is to the limit.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/usage-meter.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/usage-meter.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/usage-meter.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/usage-meter.json`. Registry path, relative to the site address: `r/usage-meter.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/usage-meter/usage-meter.tsx`
  - `components/ryan-ui/usage-meter/usage-meter.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/usage-meter.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A fixed plan quota, such as storage, seats, or credits, when it matters to see what takes up the space and how much remains until the limit.
- Warn before the limit: from `warnAt` (default 90%) the badge shows “Almost full”, and above the limit the excess portion appears hatched, with a marker at the limit.
- Plan and billing screens where the user explores the categories by hovering, tapping, or using the arrow keys in the legend.

## When not to use

- Use [`progress`](progress.md) for a single progress measure, without categories or a plan limit.
- Use [`composition-chart`](composition-chart.md) or [`donut-chart`](donut-chart.md) for the breakdown of a whole with no limit, or with more than four parts.
- Use [`gauge`](gauge.md) for a single value within a known range.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { UsageMeter } from "@/components/ryan-ui/usage-meter/usage-meter";
import { Button } from "@/components/ryan-ui/button/button";
import { Row, Stack, Surface } from "./_kit";

export default function UsageMeterDemo() {
  const [media, setMedia] = useState(18.4);
  const [docs, setDocs] = useState(9.2);
  const [backups, setBackups] = useState(12.1);
  return (
    <Stack gap={4} width={480}>
      <Surface>
        <UsageMeter
          label="Workspace storage"
          unit="GB"
          limit={50}
          segments={[
            { id: "media", label: "Media", value: media },
            { id: "docs", label: "Documents", value: docs },
            { id: "backups", label: "Backups", value: backups },
          ]}
        />
      </Surface>
      <Row>
        <Button size="sm" variant="secondary" onClick={() => setMedia(m => m + 4)}>Upload 4 GB of media</Button>
        <Button size="sm" variant="secondary" onClick={() => setBackups(b => b + 3)}>Add a backup</Button>
        <Button size="sm" variant="ghost" onClick={() => { setMedia(18.4); setDocs(9.2); setBackups(12.1); }}>Reset</Button>
      </Row>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `UsageMeter`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | What is measured, such as "Workspace storage". |
| `segments` (required) | `UsageMeterSegment[]` | — | Used amounts in display order. Up to four read clearly. |
| `limit` (required) | `number` | — | The plan limit, in the same unit as the segments. |
| `unit` | `string` | `""` | — |
| `decimals` | `number` | `1` | Digits after the decimal point. |
| `freeLabel` | `string` | `"Free"` | — |
| `overLabel` | `string` | `"Over limit"` | — |
| `warnAt` | `number` | `.9` | Share of the limit at which the meter warns that it is almost full. |

### Exported types

#### `UsageMeterSegment`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable identity. Keep it the same while the value changes, so the segment re-flows instead of being replaced. |
| `label` (required) | `string` | — |
| `value` (required) | `number` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | The legend is a single `Tab` stop (roving tabindex); focus already highlights the category in the bar and in the big number. |
| `←` or `→` or `↑` or `↓` | Move focus between the categories and the free-space item, wrapping around. |
| `Home` or `End` | Moves to the first category or to the free-space (or excess) item. |
| `Enter` or `Space` | Pins the highlight on the focused category (`aria-pressed`); again, unpins. |
| `Esc` | Unpins the pinned category. |

## Accessibility

- The bar is `role="img"` with a full summary in `aria-label` (total, each category, and free space); the spinning numbers are `aria-hidden` and there is a hidden text with the total.
- The legend is a group of buttons with roving tabindex and `aria-pressed`; a live region only speaks when the state changes (normal, almost full, over the limit) or the excess changes.
- Above the limit, the excess is hatched as well as colored and the badge gains an icon, so the state does not depend on color alone.

## Motion

- The first time it appears on screen, the segments grow from left to right, one after another; afterward, each change makes them all slide with a no-overshoot spring.
- The numbers spin like an odometer in the direction of the change, the badge adjusts its width with a spring, and highlighting a category dims the others.
- With “reduce motion”, values and widths change immediately and the texts only fade.

## Responsive behavior

- The legend is an `auto-fit` grid with columns of at least 108 px, which becomes more rows in a narrow card; a long title wraps next to the badge.

## Performance

- It waits for 40% of the meter to enter the screen before animating and watches the bar's width with a `ResizeObserver`; the segment positions come from motion values, with no per-frame re-render.

## Notes for AI

- Import from `@/components/ryan-ui/usage-meter/usage-meter`. Pass `segments` with a stable `id` (changing the value keeps the segment and animates), `limit` in the same unit, and `unit`, such as `"GB"`.
- Use at most four segments: the CSS only defines colors for four, and a fifth has no color in the bar and the legend.
- Numbers come out in en-US format (decimal point) and the texts (“of 50 GB used”, “Almost full”) are in English; `freeLabel` and `overLabel` translate only part, the rest is adjusted in the copied file.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/usage-meter · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
