# Waffle chart

> Gráfico de unidades 10 por 10 em que cada célula vale um por cento e voa para o novo grupo quando os dados mudam.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/waffle-chart
- Original description: A ten by ten unit chart where every cell is one percent, and cells fly to their new group when the data changes.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/waffle-chart.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/waffle-chart.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/waffle-chart.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/waffle-chart.json`. Registry path, relative to the site address: `r/waffle-chart.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/waffle-chart/waffle-chart.tsx`
  - `components/ryan-ui/waffle-chart/waffle-chart.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/waffle-chart.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Showing parts of a whole as countable squares, where each cell is worth one percent: energy mix, survey responses, budget by area.
- Comparing two moments with the same categories: when `data` changes, cells that change group fly to their new place and the legend rolls the percentages.
- When color can't be the only channel: besides color, categories alternate between square, round, and framed cells.

## When not to use

- Use [`donut-chart`](donut-chart.md) or [`composition-chart`](composition-chart.md) when there are many small categories: below half a percent, a category may end up with no cell.
- Use [`bar-chart`](bar-chart.md) to compare values that don't add up to a whole.
- Use [`progress`](progress.md) or [`usage-meter`](usage-meter.md) for a single fraction, such as quota usage.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import WaffleChart, { type WaffleCategory } from "@/components/ryan-ui/waffle-chart/waffle-chart";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

const years: Record<string, WaffleCategory[]> = {
  "2015": [
    { key: "wind", label: "Wind", value: 64 },
    { key: "solar", label: "Solar", value: 18 },
    { key: "hydro", label: "Hydro", value: 120 },
    { key: "nuclear", label: "Nuclear", value: 210 },
    { key: "gas", label: "Gas", value: 380 },
    { key: "coal", label: "Coal", value: 408 },
  ],
  "2023": [
    { key: "wind", label: "Wind", value: 215 },
    { key: "solar", label: "Solar", value: 190 },
    { key: "hydro", label: "Hydro", value: 132 },
    { key: "nuclear", label: "Nuclear", value: 205 },
    { key: "gas", label: "Gas", value: 340 },
    { key: "coal", label: "Coal", value: 118 },
  ],
};

export default function WaffleChartDemo() {
  const [year, setYear] = useState("2015");
  return (
    <Stack gap={4} width={520}>
      <SegmentedControl label="Year" value={year} onValueChange={setYear} options={[{ value: "2015", label: "2015" }, { value: "2023", label: "2023" }]} />
      <Surface>
        <WaffleChart data={years[year] ?? []} label={`Electricity generation, ${year}`} unit="TWh" />
      </Surface>
      <Caption>One cell is one percent. Switch years and cells fly to their new group; hover a legend row to focus a source.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `WaffleChart`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `WaffleCategory[]` | — | Categories in fill order. The first fills from the bottom-left corner, column by column. |
| `label` (required) | `string` | — | What the whole is, such as "Electricity generation, 2023". Names the chart for assistive technology. |
| `unit` | `string` | `""` | Unit after each raw value in the tooltip and table, such as "TWh". |
| `formatValue` | `(value: number, category: WaffleCategory) => string` | — | — |
| `rows` | `number` | `10` | Grid rows. rows × columns cells make the whole; 10 × 10 means one cell per percent. |
| `columns` | `number` | `10` | — |
| `accentKey` | `string \| null` | — | The category painted in the accent. Pass null to keep every category neutral. Defaults to the first category. |
| `activeKey` | `string \| null` | — | Controlled focused category. Others dim while one is focused. |
| `defaultActiveKey` | `string \| null` | `null` | — |
| `onActiveChange` | `(key: string \| null) => void` | — | — |
| `legend` | `boolean` | `true` | Category list with shares that roll to their new value. |
| `decimals` | `number` | `0` | Decimal places for shares. |
| `emptyLabel` | `string` | `"No data"` | — |
| `ref` | `Ref<HTMLElement>` | — | — |
| `className` | `string` | — | — |

### Exported types

#### `WaffleCategory`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | Stable identity. Cells keep following their category when the data changes, so a new dataset flows instead of repainting. |
| `label` (required) | `string` | Name in the legend, the tooltip, and the data table. |
| `value` (required) | `number` | Raw amount. Shares are computed from the total; negatives count as zero. |
| `color` | `string` | Any CSS color. Defaults to the first series for accentKey, the supporting series for the next three, then neutral steps. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | With focus on the grid, move up or down one cell in the column and read its category. |
| `←` or `→` | Move to the neighboring cell, in the previous or next column. |
| `Page Up` or `Page Down` | Page Down jumps to the start of the next category; Page Up returns to the start of the current one or, if already there, of the previous one. |
| `Home` or `End` | Go to the first or last filled cell. |
| `Esc` | Ends the reading and hides the tooltip. |
| `Enter` or `Space` | In the legend, pin or release the category's highlight. |

## Accessibility

- The grid is a focusable group with `aria-roledescription="waffle chart"` and the instructions in its name, in English; an `aria-live="polite"` region reads the current cell's category with share and value.
- The legend is a list of buttons with `aria-pressed`; a hidden summary and table carry each category's value, share, and number of cells.
- Cell shape is a second channel besides color: apart from the highlighted category, categories alternate between square, round, and framed, and the legend repeats the shape.

## Motion

- On entering the viewport, cells grow and appear in a short wave, in fill order: bottom to top, column by column.
- When the data changes, cells that change group or position fly to the new place, shrinking mid-flight, and change color and shape along the way; the legend percentages roll.
- With “reduced motion” on, cells go straight to their final place and color and the percentages swap without rolling.

## Responsive behavior

- In a container of 420 px or more, the legend sits beside the grid; below that, it drops to a one-column list.
- The grid is at most 300 px wide (232 px with the legend beside it) and the cells follow that measure; on touch, dragging horizontally scans the cells and the vertical gesture scrolls the page.

## Performance

- Each cell is an animated element with `will-change: transform`: the default grid has 100, and larger `rows` × `columns` multiply that number.

## Notes for AI

- Pass `data` as `{ key, label, value }` in fill order, with raw values: slices are computed and rounded to whole cells that always sum to the grid (10 × 10, one percent each).
- Keep `key` stable between datasets so cells fly instead of repainting; `unit` and `formatValue` format the tooltip and table, and `decimals` the percentages.
- The accent color goes to `accentKey` (the first category, by default) and the next three use the other series colors; `activeKey` with `onActiveChange` controls the pinned category.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/waffle-chart · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
