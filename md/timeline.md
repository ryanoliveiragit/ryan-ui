# Timeline

> Linha do tempo com os eventos mais recentes primeiro, agrupados por dia e com detalhes que se expandem.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/timeline
- Original description: Follow what happened, newest first, grouped by day.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/timeline.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/timeline.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/timeline.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/timeline.json`. Registry path, relative to the site address: `r/timeline.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/timeline/timeline.tsx`
  - `components/ryan-ui/timeline/timeline.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/timeline.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A project's history, audit log, or sequence of deploys, where order and recency matter more than comparing fields.
- Feeds that receive updates while the screen is open: the new event enters at the top, the others move down, and its title is announced to the screen reader.
- When only some events have details worth opening: with `detail`, the row becomes a button that expands in place.

## When not to use

- Use [`sortable-data-table`](sortable-data-table.md) when people need to sort or compare records by column.
- Use [`stepper`](stepper.md) to show the steps of a flow and what is already complete, not dated events.
- Use [`notification-center`](notification-center.md) for notices with read and unread state.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useMemo } from "react";
import { GitMerge, Rocket, TriangleAlert } from "lucide-react";
import { Timeline, type TimelineEvent } from "@/components/ryan-ui/timeline/timeline";
import { avatar } from "@/components/ryan-ui/lib/media";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 520 };

export default function TimelineDemo() {
  const now = useMemo(() => Date.now(), []);
  const m = 60_000, h = 60 * m;
  const events: TimelineEvent[] = [
    { id: "e1", at: now - 8 * m, actor: "Marcus Johnson", title: "merged Checkout redesign into main", meta: "Pull request #482", avatar: avatar("marcus-johnson"), detail: "Squashed 7 commits. 24 files changed, 3 reviewers approved." },
    { id: "e2", at: now - 20 * m, title: "Production deploy succeeded", meta: "Build 2041", icon: <Rocket size={14} aria-hidden="true" />, tone: "success", detail: "Deployed to 3 regions in 2m 41s." },
    { id: "e3", at: now - 3 * h, actor: "Emma Collins", title: "commented on Hero headline", avatar: avatar("emma-collins") },
    { id: "e4", at: now - 5 * h, title: "Staging deploy failed", meta: "Build 2039", icon: <TriangleAlert size={14} aria-hidden="true" />, tone: "danger", detail: "Type check failed in billing/invoice.ts on line 88." },
    { id: "e5", at: now - 26 * h, actor: "Olivia Bennett", title: "approved Billing migration", meta: "Pull request #471", icon: <GitMerge size={14} aria-hidden="true" />, avatar: avatar("olivia-bennett") },
    { id: "e6", at: now - 30 * h, actor: "Jasmine Brooks", title: "opened Pricing page experiment", meta: "Pull request #476", avatar: avatar("jasmine-brooks") },
  ];
  return (
    <Stack width={480}>
      <Timeline events={events} now={now} label="Project activity" maxHeight={460} />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Timeline`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `events` (required) | `TimelineEvent[]` | — | Updates in any order; the newest shows first. |
| `now` (required) | `number` | — | Reference time for relative labels and day groups, in epoch milliseconds. Pass a ticking clock to keep labels fresh. |
| `label` (required) | `string` | — | Accessible name for the feed. |
| `timeZone` | `string` | `"UTC"` | Time zone for day groups and clock times. Fixed by default so server and client agree. |
| `locale` | `string` | `"en-US"` | — |
| `maxHeight` | `number \| string` | — | Height of the scrolling area. Without it the feed grows with the page and reveals on page scroll. |
| `scrollToNew` | `boolean` | `true` | Scroll back to the top when a new update arrives while the feed is scrolled down. |
| `defaultExpanded` | `string[]` | `[]` | — |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | Heading level for the day labels. |
| `className` | `string` | — | — |

### Exported types

#### `TimelineEvent`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `at` (required) | `string \| number` | When it happened, as an ISO string or epoch milliseconds. |
| `actor` | `string` | Who did it, shown first in the foreground color. |
| `title` (required) | `string` | What happened, completing the actor: "merged Checkout redesign into main". |
| `meta` | `string` | Short context under the title, such as a pull request or a build. |
| `detail` | `ReactNode` | Revealed in place when the row is expanded. Rows without detail are not interactive. |
| `avatar` | `string` | Portrait for an event by a person. |
| `icon` | `ReactNode` | Icon for a system event, used when there is no avatar. |
| `tone` | `"neutral" \| "success" \| "danger"` | Status of a system event. Always say the outcome in the title too, so it never rests on color. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | Move focus to the previous or next row that has `detail`; rows without detail don't receive focus. |
| `Home` or `End` | Go to the first or last row with detail. |
| `Enter` or `Space` | Open or close the focused row's detail. |

## Accessibility

- The feed is a `region` named by `label`; each day is a `<section>` tied to its heading (`role="heading"` at the `headingLevel` level, 3 by default), and events form an ordered list.
- Rows with `detail` are `<button>`s with `aria-expanded` and `aria-controls`; the time is a `<time>` with the full date in hidden text, and new events are announced in a `role="status"` region.
- `tone` only changes the marker's color: write the outcome in the `title` (“Deploy failed”); the avatar has an empty `alt` because the name already comes in `actor`.

## Motion

- Each row reveals itself once, on entering the viewport: the marker appears growing and the vertical stroke draws to the next one; rows that appear together enter 90 ms apart.
- New events enter at the top, making room while the others move down; the detail opens with a spring on height, the arrow rotates, and the relative time and day count swap by rolling.
- With “reduced motion” on, there is no stagger or displacement: markers, strokes, and details appear instantly or with a short fade, and the return to the top is instant.

## Responsive behavior

- With `maxHeight`, the feed scrolls internally, day headings stick to the top, and the bottom edge fades while there are more events; without it, the feed grows with the page.
- If a new event arrives while the feed is scrolled down, it returns to the top on its own; turn this off with `scrollToNew={false}`.

## Performance

- There is no virtualization: all events stay in the DOM and each row detects its viewport entry only once; for long histories, limit what is passed in `events`.

## Notes for AI

- Pass `events`, `label`, and `now` (epoch ms); the component has no clock of its own, so update `now` from time to time (every minute, for example) so relative times don't go stale.
- Days and hours use `timeZone="UTC"` by default: pass the local time zone (`"America/Sao_Paulo"`) and `locale`; “Today”, “Yesterday”, “updates”, and the times `8m` and `Now` stay in English.
- Use a stable `id`: it is how an event is recognized as new, animates its entrance, and is announced; on another surface, define `--timeline-surface` for the day headings' background.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/timeline · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
