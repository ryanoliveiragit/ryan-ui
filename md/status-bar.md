# Status bar

> Faixa de disponibilidade com uma barra por dia, colorida pelo estado, dica por dia e o percentual geral.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/status-bar
- Original description: An uptime strip with one bar per day colored by status, bars that lift around the pointer, a gliding tooltip and an overall percentage that counts up.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/status-bar.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/status-bar.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/status-bar.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/status-bar.json`. Registry path, relative to the site address: `r/status-bar.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/status-bar/status-bar.tsx`
  - `components/ryan-ui/status-bar/status-bar.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/status-bar.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A status page: a service's availability over the last days, one bar per day, with the overall percentage and the current state in the header.
- When each day may carry an incident note: the tooltip shows date, state, availability, and the `note` text.
- As a day picker to open incident details elsewhere on the screen, with `onSelectDate`.

## When not to use

- Use [`activity-heatmap`](activity-heatmap.md) for activity volume per day over a year, with no service states.
- Use [`line-chart`](line-chart.md) or [`sparkline`](sparkline.md) for a continuous metric, such as latency, instead of one state per day.
- States outside the five provided (`operational`, `degraded`, `outage`, `maintenance`, `unknown`) can't be represented.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import StatusBar, { type StatusDay } from "@/components/ryan-ui/status-bar/status-bar";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

type Incident = Omit<StatusDay, "date">;
const LAST_DAY = Date.UTC(2026, 10, 10);

/** Ninety days ending on a fixed date; every day is operational unless an incident is listed for it. */
function history(incidents: Record<number, Incident>): StatusDay[] {
  return Array.from({ length: 90 }, (_, index) => ({
    date: new Date(LAST_DAY - (89 - index) * 86_400_000).toISOString().slice(0, 10),
    ...(incidents[index] ?? { status: "operational" as const }),
  }));
}

const services: Record<string, { name: string; days: StatusDay[] }> = {
  api: {
    name: "API gateway",
    days: history({
      12: { status: "degraded", uptime: 99.1, note: "Elevated latency in eu-west for 13 minutes." },
      13: { status: "degraded", uptime: 99.6, note: "Latency recovering after the eu-west rollback." },
      41: { status: "outage", uptime: 94.2, note: "Primary database failover, 83 minutes of errors." },
      58: { status: "maintenance", uptime: 100, note: "Scheduled certificate rotation, no downtime." },
      77: { status: "degraded", uptime: 99.3, note: "Slow token refresh for a share of sessions." },
    }),
  },
  dashboard: {
    name: "Dashboard",
    days: history({
      0: { status: "unknown" }, 1: { status: "unknown" }, 2: { status: "unknown" },
      27: { status: "maintenance", uptime: 100, note: "Planned upgrade of the reporting cluster." },
      63: { status: "degraded", uptime: 98.8, note: "Charts loaded slowly for 17 minutes." },
    }),
  },
  webhooks: {
    name: "Webhooks",
    days: history({
      19: { status: "outage", uptime: 91.5, note: "Delivery queue stalled for two hours." },
      20: { status: "degraded", uptime: 98.9, note: "Backlog draining, deliveries delayed." },
      52: { status: "degraded", uptime: 99.5, note: "Retries delayed by a few minutes." },
      70: { status: "maintenance", uptime: 100, note: "Queue storage migration." },
      88: { status: "degraded", uptime: 99.2, note: "Delayed deliveries to some endpoints." },
      89: { status: "degraded", uptime: 99.7, note: "Still investigating delayed deliveries." },
    }),
  },
};

const dayLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" });

export default function StatusBarDemo() {
  const [service, setService] = useState("api");
  const [selected, setSelected] = useState<string | null>(null);
  const { name, days } = services[service]!;
  const day = days.find(entry => entry.date === selected);

  return (
    <Stack gap={4} width={640}>
      <SegmentedControl label="Service" value={service} onValueChange={value => { setService(value); setSelected(null); }}
        options={[{ value: "api", label: "API" }, { value: "dashboard", label: "Dashboard" }, { value: "webhooks", label: "Webhooks" }]} />
      <Surface>
        <StatusBar label={name} days={days} selectedDate={selected} onSelectDate={setSelected} />
      </Surface>
      <Caption>
        {day
          ? `${dayLabel.format(new Date(`${day.date}T00:00:00Z`))}: ${day.note ?? (day.status === "unknown" ? "No data recorded for this day." : "No incidents reported.")}`
          : "Hover or use the arrow keys along the strip, click a day to pin it, or pick a status in the legend."}
      </Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `StatusBar`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `days` (required) | `StatusDay[]` | — | One entry per day, oldest first. |
| `label` (required) | `string` | — | Name of the service. It also names the strip for assistive technology. |
| `uptime` | `number` | — | Overall uptime in percent. Defaults to the average of the days that have data. |
| `precision` | `number` | `2` | Decimal places of the overall percentage. |
| `caption` | `string` | — | Text under the percentage. Defaults to "uptime, last {n} days". |
| `selectedDate` | `string \| null` | — | Selected day as YYYY-MM-DD, or null for none. Leave undefined to let the strip keep its own selection. |
| `defaultSelectedDate` | `string \| null` | `null` | Day selected at first when the strip keeps its own selection. |
| `onSelectDate` | `(date: string \| null) => void` | — | Called with the day that was clicked, or null when the selected day is clicked again. |
| `locale` | `string` | `"en-US"` | Formatting locale. Fixed by default so server and client render the same labels. |
| `className` | `string` | — | Extra class for the root element. |

### Exported types

| Type | Definition |
| --- | --- |
| `DayStatus` | `"operational" \| "degraded" \| "outage" \| "maintenance" \| "unknown"` |

#### `StatusDay`

| Field | Type | Description |
| --- | --- | --- |
| `date` (required) | `string` | Calendar day as YYYY-MM-DD. |
| `status` (required) | `"operational" \| "degraded" \| "outage" \| "maintenance" \| "unknown"` | Worst state the service reached that day. |
| `uptime` | `number` | Share of the day the service answered, from 0 to 100. Defaults by status when omitted; days without data are left out of the average. |
| `note` | `string` | Short note for the tooltip, such as the incident title. |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | Move focus to the previous or next day and show that day's tooltip. |
| `↑` or `Page Up` | Step back seven days. |
| `↓` or `Page Down` | Step forward seven days. |
| `Home` or `End` | Go to the first or last day. |
| `Enter` or `Space` | On a day, select or clear the selection; in the legend, pin or release that state's highlight. |
| `Esc` | Closes the tooltip. |

## Accessibility

- The strip is a `role="group"` named with the service and the number of days; each day is a `<button>` with `aria-pressed` whose name carries the full date, state, availability, and note.
- Focus uses a roving tabindex (a single day in the `Tab` order, initially the most recent); the legend is a group of toggle buttons with each state's day count.
- The state names and header phrases (`All systems operational`, `Degraded performance`) are hardcoded in English; only `caption` and the `locale` formats change.

## Motion

- When half of the strip enters the viewport, the bars rise in a wave from left to right (about half a second in total) and the percentage counts up to the value.
- The bar under the pointer stretches and the two neighbors on each side follow it progressively less; the single tooltip glides on a spring between days and a ring pulses endlessly on the current state's point.
- With “reduced motion” on, the bars only fade, with no scale, the pulse is turned off, and the percentage appears directly.

## Responsive behavior

- Bars divide the container's width equally, with a 1 to 3 px gap: many days in a narrow container give very thin bars, so shorten the period on phones.
- Below 380 px of container width the percentage shrinks; the tooltip slides sideways to stay inside the component and, on touch, stays visible for about two seconds.

## Performance

- Each day is a `<button>`, and the highlight around the pointer is computed in CSS from a variable, with no JavaScript per bar; the cost grows with the number of days.

## Notes for AI

- Pass `days` from oldest to most recent (`{ date, status, uptime?, note? }`) and `label` with the service name; the header state is that of the last day.
- Without `uptime` on each day, the average uses assumed values per state (99.4 for `degraded`, 96 for `outage`); provide the real value per day or the total in the `uptime` prop.
- Despite the name, it isn't an application's status bar: it is a service's availability strip; selection is controlled with `selectedDate` and `onSelectDate`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/status-bar · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
