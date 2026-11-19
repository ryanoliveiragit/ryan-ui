# Countdown

> Contagem regressiva com dígitos que rolam e se transformam em um estado ao vivo quando chega a zero.

- Type: component (category Feedback)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/countdown
- Original description: A launch countdown with rolling digits that morphs into a live state at zero.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/countdown.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/countdown.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/countdown.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/countdown.json`. Registry path, relative to the site address: `r/countdown.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/countdown/countdown.tsx`
  - `components/ryan-ui/countdown/countdown.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/countdown.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A fixed moment people are waiting for, such as a launch, a live event, or a registration deadline, with large digits in the center of a section (`variant="large"`).
- A deadline inside a banner, card, or table cell, on a single line (`variant="compact"`).
- Screens that must change on their own at zero: the digits become `completeLabel` (default “Live now”) and `onComplete` fires once, immediately, even with the tab hidden.

## When not to use

- It does not suit elapsed time, such as a stopwatch counting up: it only counts down to `target`.
- Use [`announcement-bar`](announcement-bar.md) when the deadline accompanies a message at the top of the site; it has its own countdown inside the message.
- Use [`slot-text`](slot-text.md) or [`animated-counter`](animated-counter.md) for numbers that change by event, such as a price or total, with no clock behind them.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Countdown } from "@/components/ryan-ui/countdown/countdown";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack } from "./_kit";

export default function CountdownDemo() {
  const [launch, setLaunch] = useState(() => Date.now() + 3 * 86_400_000 + 4 * 3_600_000 + 27 * 60_000 + 12_000);
  const [soon, setSoon] = useState(() => Date.now() + 8_000);
  return (
    <Stack gap={8} align="center">
      <Stack gap={3} align="center">
        <Countdown target={launch} label="Aurora 2.0 launches in" />
        <Caption>Aurora 2.0 launch</Caption>
      </Stack>
      <Row gap={4} justify="center">
        <Countdown target={soon} variant="compact" units={["minutes", "seconds"]} completeLabel="Doors are open" label="Doors open in" />
        <Button size="sm" variant="secondary" onClick={() => setSoon(Date.now() + 6_000)}>Restart 6 s timer</Button>
        <Button size="sm" variant="ghost" onClick={() => setLaunch(Date.now() + 5 * 86_400_000)}>Move launch</Button>
      </Row>
      <Caption>Wait for the small timer to hit zero to see the digits morph into the live state.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Countdown`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `target` (required) | `Date \| number \| string` | — | The moment to count down to. A number is epoch milliseconds, a Date is used as is, and an ISO string with `Z` or an offset such as `2026-10-06T10:00:00-07:00` is exact. A string without an offset is wall time in `timeZone`, or UTC when no zone is given, so the result never depends on the visitor's own time zone. |
| `timeZone` | `string` | — | IANA zone for a target string without an offset, such as "America/Los_Angeles". Daylight saving is resolved for the target date. |
| `units` | `CountdownUnit[]` | `DEFAULT_UNITS` | Units to show, largest first. The largest unit absorbs the rest, so hours can pass 24 when days are left out. |
| `variant` | `"large" \| "compact"` | `"large"` | Large digits with unit labels, or one compact line for banners and table cells. |
| `completeLabel` | `ReactNode` | `"Live now"` | Shown once the target passes. The digits morph into it. |
| `onComplete` | `() => void` | — | Fires once, the moment the countdown reaches zero while mounted. It fires on time even when the tab is hidden. |
| `label` | `string` | `"Time remaining"` | Accessible name, such as "Keynote starts in". |
| `clock` | `() => number` | `systemClock` | Clock source in epoch milliseconds. Pass a server-synced clock when the visitor's device time cannot be trusted. |
| `ref` | `Ref<HTMLDivElement>` | — | — |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `CountdownUnit` | `"days" \| "hours" \| "minutes" \| "seconds"` |

### Other exports

- `toEpoch` (function)

## Accessibility

- The root is `role="timer"` named by `label` (default “Time remaining”); the animated digits are hidden and a hidden text states the time in full, without seconds while more than a minute remains.
- `role="timer"` does not announce changes; if the end matters to screen reader users, announce it in your own live region from `onComplete`.
- The unit names, both visible and read aloud (“Days”, “3 days, 4 hours”), are in English; pass `label` in your language and translate the units in the copied file.

## Motion

- Each digit is a wheel that turns by the shortest path, downward each second (00 → 59 is a single step); on first display, the wheels enter in sequence, left to right.
- At zero, the digits dissolve with slight scale and blur and give way to `completeLabel`, and the box follows the new width and height with a spring; in `compact`, the pill takes on the success tone.
- With “reduce motion”, the digits change without turning, the final swap is a short fade, and the pulsing dot next to the label stays still.

## Responsive behavior

- In `large`, the digit size follows the container width (`cqi` unit), from 1.75 rem up to display size, and four groups fit in 320 px.

## Performance

- The clock only advances while the component is on screen and the tab is visible, and on return it rereads the time, without accumulating delay; a separate timer guarantees the end on time.

## Notes for AI

- Import from `@/components/ryan-ui/countdown/countdown`. For a local time, pass `target="2026-12-01T10:00"` and `timeZone="America/Sao_Paulo"`; a string without a time zone and without `timeZone` is read as UTC.
- `units` defines what appears, and the largest unit absorbs the rest: with `["hours", "minutes"]`, hours go past 24. If the device clock is not reliable, pass `clock` with the server time.
- `onComplete` only fires if the count reaches zero while the component is mounted; if `target` has already passed on mount, it shows `completeLabel` without counting and without calling the callback.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/countdown · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
