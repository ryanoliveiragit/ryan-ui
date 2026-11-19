# Announcement bar

> Faixa no topo que alterna mensagens, mostra contagem regressiva e recolhe com suavidade ao ser dispensada.

- Type: component (category Feedback)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/announcement-bar
- Original description: A top banner that rotates messages, counts down, and collapses smoothly when dismissed.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/announcement-bar.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/announcement-bar.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/announcement-bar.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/announcement-bar.json`. Registry path, relative to the site address: `r/announcement-bar.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/announcement-bar/announcement-bar.tsx`
  - `components/ryan-ui/announcement-bar/announcement-bar.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/announcement-bar.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A site-wide message at the top of the page: a time-limited promotion, a new version, or a live event, with an action link.
- Two to four messages that rotate in the same space, pausing on hover or focus and, with `controls`, previous, next, and pause buttons.
- Campaigns the user closes once: with `id`, the dismissal is saved in `localStorage` and the bar does not come back; change the `id` to show a new campaign to everyone.

## When not to use

- Use [`alert`](alert.md) for a message tied to a specific screen or form, helping to resolve a problem there.
- Use [`toast`](toast.md) or [`toast-stack`](toast-stack.md) for the result of something the user just did.
- Use [`countdown`](countdown.md) when the countdown is the centerpiece of the page, such as a launch screen, and not a detail in a strip.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { AnnouncementBar } from "@/components/ryan-ui/announcement-bar/announcement-bar";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./announcement-bar.module.css";

export const stage: DemoStage = { layout: "fill", frame: true, height: 520 };

export default function AnnouncementBarDemo() {
  const [open, setOpen] = useState(true);
  const [sale] = useState(() => Date.now() + 2 * 86_400_000 + 5 * 3_600_000);
  return (
    <div className={styles.page}>
      <AnnouncementBar
        controls
        interval={5000}
        open={open}
        onOpenChange={setOpen}
        messages={[
          { id: "sale", message: "Spring sale: 30% off annual plans.", countdown: { to: sale, label: "Ends in" }, action: { label: "Shop the sale", href: "#sale" } },
          { id: "release", message: "Version 4.2 is here with shared workspaces.", action: { label: "See what's new", href: "#release" } },
          { id: "event", message: "Join our live product tour on Thursday at 10 am PT.", action: { label: "Save your seat", href: "#event" } },
        ]}
      />
      <nav className={styles.nav} aria-label="Example site">
        <span className={styles.brand}><span className={styles.mark} aria-hidden="true" />Northwind</span>
        <span className={styles.links}><span>Product</span><span>Pricing</span><span>Customers</span></span>
        <Button size="sm" variant="secondary" className={styles.cta}>Sign in</Button>
      </nav>
      <section className={styles.hero}>
        <h2 className={styles.title}>Plan, ship and measure every launch</h2>
        <p className={styles.lede}>The bar above sits on top of the page: messages rotate on their own, hover to pause, use the arrows or close it.</p>
        {!open ? <Button variant="secondary" onClick={() => setOpen(true)}>Bring the bar back</Button> : <Caption>Closing it gives the page its space back.</Caption>}
      </section>
    </div>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AnnouncementBar`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `messages` (required) | `Announcement[]` | — | — |
| `id` | `string` | — | Remembers dismissal under this id. Change the id to show a new campaign to everyone again. |
| `open` | `boolean` | — | Whether the bar is shown. Leave it out to let the component manage it. |
| `defaultOpen` | `boolean` | `true` | — |
| `onOpenChange` | `(open: boolean) => void` | — | — |
| `index` | `number` | — | Index of the visible message. |
| `defaultIndex` | `number` | `0` | — |
| `onIndexChange` | `(index: number) => void` | — | — |
| `interval` | `number` | `6000` | Milliseconds each message stays before the next one. Defaults to 6000. |
| `autoPlay` | `boolean` | `true` | Rotate automatically. Pauses on hover, focus, or a hidden tab, and is turned off when the visitor prefers reduced motion. Defaults to true. |
| `controls` | `boolean` | `false` | Show previous, next, and pause controls when there are several messages. Defaults to false: only the close button shows. |
| `dismissible` | `boolean` | `true` | — |
| `tone` | `"neutral" \| "inverted"` | `"neutral"` | — |
| `onAction` | `(announcement: Announcement) => void` | — | — |
| `onCountdownEnd` | `(announcement: Announcement) => void` | — | — |
| `label` | `string` | `"Announcements"` | Accessible name of the region. |
| `className` | `string` | — | — |

### Exported types

#### `AnnouncementAction`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `href` | `string` | — |
| `onClick` | `() => void` | — |

#### `Announcement`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable id, reported to callbacks. |
| `message` (required) | `ReactNode` | — |
| `action` | `AnnouncementAction` | — |
| `countdown` | `{ to: Date \| string \| number; label?: string }` | Counts down to a moment, for example the end of a sale. |

### Other exports

- `clearAnnouncementDismissal` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` or `Shift + Tab` | Moves through the action link and the previous, pause, next, and close buttons; while focus is inside the bar, rotation stays paused. |

## Accessibility

- It is a `<section>` with `aria-label` (default “Announcements”); with more than one message it becomes a carousel (`aria-roledescription`) and each message is a labeled group “N of M”.
- While it rotates on its own, the messages area has `aria-live="off"` so it does not speak on every change; when stopped by pause, focus, mouse, or “reduce motion”, it switches to `polite`.
- The button labels (“Previous announcement”, “Pause announcements”, “Dismiss”) and the countdown reading are fixed in English; pass `label` in your language and adjust the rest in the copied file.

## Motion

- The next message rises from below with a slight blur while the previous one exits upward (going back reverses the path), and the bar follows the new message's height with a no-overshoot spring.
- The pause ring is the rotation clock: it fills linearly during `interval`, stops where it is when paused, and completes the rest on resume; in the countdown, each digit that changes drops in from above.
- Closing collapses the height with a spring and the page moves up with it. With “reduce motion”, automatic rotation is turned off, messages only fade, and closing becomes a short fade.

## Responsive behavior

- Below 560 px of the bar's own width (container query), the column that mirrors the buttons disappears and the message aligns left instead of centering.
- Message, countdown, and link wrap onto lines when space runs out (the countdown and the link do not break internally), and the bar grows to the new height with the spring.

## Performance

- Each countdown wakes once per second, aligned to the full second; the rotation is a linear animation that stops when the tab is hidden, the mouse is over it, or focus is inside.

## Notes for AI

- Import from `@/components/ryan-ui/announcement-bar/announcement-bar`; each item in `messages` needs a stable `id`. The bar stays in the flow (it is not fixed or sticky): place it above the header.
- With controlled `open`, the dismissal is written to `localStorage` (when there is an `id`) but not read; to remember it, keep the state in the component. `clearAnnouncementDismissal(id)` erases the dismissal, and the bar returns on the next mount.
- `controls` is off by default (only the close button appears). `countdown.to` goes through `new Date()`; use an ISO date with a time zone (`Z` or `-03:00`) so it does not depend on the visitor's time zone.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/announcement-bar · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
