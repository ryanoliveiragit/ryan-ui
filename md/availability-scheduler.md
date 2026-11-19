# Availability scheduler

> Grade semanal para marcar horários livres com clique e arraste, com atalhos prontos e um resumo por dia que se atualiza na hora.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/availability-scheduler
- Original description: Week grid of one-hour slots chosen by click, rectangle drag or keyboard, with one-click presets and a live summary of merged ranges per day.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/availability-scheduler.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/availability-scheduler.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/availability-scheduler.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/availability-scheduler.json`. Registry path, relative to the site address: `r/availability-scheduler.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/blocks/availability-scheduler/availability-scheduler.tsx`
  - `components/ryan-ui/blocks/availability-scheduler/availability-scheduler.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/availability-scheduler.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Asking someone which times of the week they are free, to schedule meetings, on-call shifts, or appointments in one-hour blocks.
- Setting up windows that repeat every week, such as business hours or the period when notifications may arrive.
- When the result needs to be checked at a glance: the summary alongside merges adjacent blocks into per-day ranges and totals the hours.

## When not to use

- Use [`date-picker`](date-picker.md) or [`date-range-picker`](date-range-picker.md) when the choice is calendar dates rather than times that repeat every week.
- Use [`time-picker`](time-picker.md) when a single time is enough.
- Avoid when precision needs to be finer than one hour: each cell is a full one-hour block, with no half hours or quarter hours.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import AvailabilityScheduler from "@/components/ryan-ui/blocks/availability-scheduler/availability-scheduler";
import type { DemoStage } from "./_kit";

// A little taller than the default: the grid has twelve hour rows plus presets and a header.
export const stage: DemoStage = { height: 700 };

export default function AvailabilitySchedulerDemo() {
  return <AvailabilityScheduler />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AvailabilityScheduler`

Week grid of one-hour slots: click or drag a rectangle to mark when you are free, apply a preset, and read the result as merged ranges per day.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string[]` | — | Selected one-hour slots as `"day-hour"` ids: day from 0 (first column), hour on the 24 h clock. Pass it with `onValueChange` to control the grid. |
| `defaultValue` | `string[]` | — | Starting selection when uncontrolled. Defaults to weekdays 9 to 5 with a lunch break. |
| `onValueChange` | `(slots: string[]) => void` | — | Called with the sorted selection after a click, a drag, a key press or a preset. |
| `startHour` | `number` | `8` | First hour shown (24 h clock). |
| `endHour` | `number` | `20` | Hour at which the last slot ends (24 h clock). |
| `days` | `string[]` | `WEEK` | Column names, one per day. |
| `presets` | `AvailabilityPreset[]` | `defaultPresets` | One-click selections offered above the grid. |
| `title` | `string` | `"When are you free?"` | Heading above the grid. |
| `className` | `string` | — | Extra class for the section. |

### Exported types

#### `AvailabilityPreset`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | Text on the preset's button. |
| `includes` (required) | `(day: number, hour: number) => boolean` | Whether the slot that starts at `hour` (24 h clock) on `day` (0 is the first column) belongs to the preset. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` or `←` or `→` | Move focus around the grid, one cell at a time. |
| `Space` or `Enter` | Select or deselect the focused time slot. |
| `Shift + ↑` or `Shift + ↓` or `Shift + ←` or `Shift + →` | Paint: the destination cell takes the state (selected or not) of the cell focus came from. |
| `Home` or `End` | Move focus to the first or last day, at the same hour. |
| `Tab` | Moves through the ready-made presets, “Clear”, and the day buttons (which select or clear a whole day), then enters the grid at the current cell. |

## Accessibility

- The grid uses `role="grid"` with `aria-multiselectable`; each cell is a `gridcell` with `aria-selected` and a name like “Monday, 9 AM to 10 AM”, and only the current cell is in the Tab order (roving tabindex).
- The total hours sit in an `aria-live="polite"` region, the ready-made presets expose `aria-pressed`, and each day header is a button with its own name.
- The internal texts (help, “Clear”, “Available”, “Unavailable”, cell names, and the AM/PM clock) are hardcoded in English; only `title`, `days`, and the `presets` labels come through props.

## Motion

- Each selected slot grows from the center of the cell on a no-overshoot spring curve and disappears with a simple fade; in batch changes (preset, whole day) the cells fill in a wave from the origin.
- The total hours change by scrolling: the old number moves up and the new one enters from below, on a no-overshoot spring.
- With “reduce motion” on, cell and button transitions are turned off and the total changes instantly.

## Responsive behavior

- Uses a container query: below 46rem of block width the summary drops below the grid, and below 30rem the days show only the initial.
- The grid body has `touch-action: none`: on touch, dragging over the slots selects them instead of scrolling the page, so leave free space around it for scrolling.

## Performance

- Each time slot is one DOM element (`days` × visible hours, 84 by default), and during a drag the state changes only when the pointer enters another cell, not on every pixel.

## Notes for AI

- Controlled with `value` and `onValueChange`: the selection is a list of `"dia-hora"` ids, with the day counted from 0 and the hour on a 24-hour clock (`"0-9"` is the first day at 9 AM).
- Without `value` or `defaultValue`, the grid starts with the first five columns selected from 9 AM to 5 PM, except noon; pass `defaultValue={[]}` to start empty.
- `startHour` and `endHour` define the rows (8 and 20 by default), `days` the columns, and `presets` the shortcuts, each with a `label` and an `includes(day, hour)` function.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/availability-scheduler · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
