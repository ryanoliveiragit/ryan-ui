# Pull to refresh

> Área de rolagem que você puxa para baixo para atualizar: o indicador estica, gira durante a atualização e volta ao lugar.

- Type: component (category Feedback), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/pull-to-refresh
- Original description: A scroll container you drag down with a finger or the mouse: the indicator stretches, spins while the async refresh runs, confirms and settles.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/pull-to-refresh.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/pull-to-refresh.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/pull-to-refresh.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/pull-to-refresh.json`. Registry path, relative to the site address: `r/pull-to-refresh.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/pull-to-refresh/pull-to-refresh.tsx`
  - `components/ryan-ui/pull-to-refresh/pull-to-refresh.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/pull-to-refresh.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Lists where pulling down is the expected gesture on mobile, such as an inbox, a feed, or notifications.
- An area with its own scrolling inside a panel or an app frame (`height`), which refreshes the content without reloading the page.
- Updates that sometimes start outside the gesture, from a button or a timer: `refreshing` shows the same refresh state.

## When not to use

- It does not suit a whole page scrolling on the `body`: the gesture only exists inside its own container, which needs a height.
- Use [`infinite-masonry`](infinite-masonry.md) when new content should arrive on scrolling to the end, not on pulling the top.
- Use [`message-scroller`](message-scroller.md) for conversations, where new content arrives at the end of the list.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { PullToRefresh } from "@/components/ryan-ui/pull-to-refresh/pull-to-refresh";
import { avatar } from "@/components/ryan-ui/lib/media";
import type { PersonId } from "@/components/ryan-ui/lib/media";
import { motionTokens } from "@/components/ryan-ui/lib/motion-tokens";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./pull-to-refresh.module.css";

export const stage: DemoStage = { height: 580 };

interface Mail { id: string; who: PersonId; from: string; subject: string; time: string; fresh?: boolean; }

const inbox: Mail[] = [
  { id: "m1", who: "jasmine-brooks", from: "Jasmine Brooks", subject: "Design review moved to Thursday", time: "9:41" },
  { id: "m2", who: "daniel-kim", from: "Daniel Kim", subject: "Staging is back up, sorry for the noise", time: "9:12" },
  { id: "m3", who: "sofia-ramirez", from: "Sofia Ramirez", subject: "Vendor contract: two small changes", time: "8:57" },
  { id: "m4", who: "marcus-johnson", from: "Marcus Johnson", subject: "Can you look at the checkout PR?", time: "8:30" },
  { id: "m5", who: "hannah-walsh", from: "Hannah Walsh", subject: "Onboarding call notes", time: "Yesterday" },
  { id: "m6", who: "andre-williams", from: "Andre Williams", subject: "October invoices are ready", time: "Yesterday" },
  { id: "m7", who: "chloe-nguyen", from: "Chloe Nguyen", subject: "Dashboard numbers for the board deck", time: "Monday" },
];
const incoming: Omit<Mail, "id" | "time">[] = [
  { who: "emma-collins", from: "Emma Collins", subject: "New icons are in the shared library" },
  { who: "nathan-cole", from: "Nathan Cole", subject: "Headcount plan needs your sign-off" },
  { who: "ava-mitchell", from: "Ava Mitchell", subject: "Launch post draft, comments welcome" },
  { who: "tyler-hayes", from: "Tyler Hayes", subject: "Northwind wants a second demo" },
];

export default function PullToRefreshDemo() {
  const [mail, setMail] = useState(inbox);
  const [refreshes, setRefreshes] = useState(0);
  const count = useRef(0);

  // Stands in for a network request: a moment later, one new message arrives.
  const refresh = () => new Promise<void>(resolve => {
    window.setTimeout(() => {
      const next = incoming[count.current % incoming.length]!;
      count.current += 1;
      setMail(current => [{ ...next, id: `new-${count.current}`, time: "Now", fresh: true }, ...current.map(item => ({ ...item, fresh: false }))]);
      setRefreshes(count.current);
      resolve();
    }, 1400);
  });

  return (
    <Stack gap={3} align="center" width={340}>
      <div className={styles.phone}>
        <header className={styles.bar}>
          <h2 className={styles.barTitle}>Inbox</h2>
          <span className={styles.barMeta}>{refreshes ? `${refreshes} new since you opened it` : "Up to date"}</span>
        </header>
        <PullToRefresh onRefresh={refresh} label="Inbox messages" refreshLabel="Check for new mail">
          <ul className={styles.list}>
            {mail.map(item => (
              <motion.li key={item.id} className={styles.item} layout="position" initial={item.fresh ? { opacity: 0, y: -16 } : false} animate={{ opacity: 1, y: 0 }} transition={motionTokens.spring.smooth}>
                <img className={styles.avatar} src={avatar(item.who)} alt="" />
                <span className={styles.copy}>
                  <span className={styles.from}>{item.from}{item.fresh ? <span className={styles.fresh} aria-label="New" /> : null}</span>
                  <span className={styles.subject}>{item.subject}</span>
                </span>
                <span className={styles.time}>{item.time}</span>
              </motion.li>
            ))}
          </ul>
        </PullToRefresh>
      </div>
      <Caption>Drag the list down with the mouse or a finger and let go. With the keyboard, Tab to “Check for new mail”.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `PullToRefresh`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onRefresh` (required) | `() => Promise<unknown> \| void` | — | Runs when a pull is released past the threshold. Return a promise: the indicator spins until it settles. |
| `children` (required) | `ReactNode` | — | The scrolling content. |
| `refreshing` | `boolean` | — | Shows the refreshing state from outside, for a refresh that did not start with a pull (a button, a timer). |
| `threshold` | `number` | `72` | Pull distance in pixels at which releasing starts a refresh. |
| `maxPull` | `number` | `150` | The farthest the content can travel, in pixels. Resistance grows toward it. |
| `disabled` | `boolean` | `false` | Turns the gesture off; the content still scrolls. |
| `height` | `number \| string` | — | Height of the scroll area, as a number of pixels or any CSS length. Defaults to filling its parent. |
| `label` | `string` | `"Content"` | Accessible name of the scroll region. |
| `refreshLabel` | `string` | `"Refresh"` | Text of the keyboard refresh button. |
| `className` | `string` | — | Extra class for the outer element. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | The component's first focus stop is the `refreshLabel` button (default “Refresh”), which only appears with keyboard focus; the next `Tab` goes to the scroll area. |
| `Enter` or `Space` | On the button, triggers the same `onRefresh` as the gesture; during the refresh it is `aria-disabled` and does not repeat. |
| `↑` or `↓` or `Page Up` or `Page Down` | With focus on the scroll area, scroll the content (native behavior). |

## Accessibility

- The scroll area is `role="region"`, focusable, with `aria-busy` during the refresh; replace the generic name from `label` (default “Content”) with the name of the list.
- A `role="status"` region announces “Refreshing” and “Updated” (fixed in English in the code), and the visual indicator is `aria-hidden`.

## Motion

- The content follows the finger 1:1 at the start and with increasing resistance up to `maxPull`; the indicator appears, grows, the arrow flips and, past `threshold`, it stretches into a capsule in the accent color.
- On release past the limit, the content holds at up to 56 px while the indicator spins; when the Promise finishes, a checkmark appears for 0.65 s and everything returns with a no-overshoot spring.
- With “reduce motion”, the returns become jumps, the icons only fade, and the spin slows down (2.4 s per turn).

## Responsive behavior

- It fills the parent's height by default; if the parent has no defined height, pass `height` so the area can scroll.
- `overscroll-behavior` prevents the pull from passing to the page and triggering the browser's own reload on mobile.

## Performance

- The pull animates a single motion value (transform), with no React re-render on every frame; touch uses a non-passive listener so it can block scrolling only during the gesture.

## Notes for AI

- Import from `@/components/ryan-ui/pull-to-refresh/pull-to-refresh`. `onRefresh` should return a Promise: the indicator spins until it finishes; without a Promise, it spins for 0.6 s.
- Give the component a height (`height` or a parent with a height) and put the list inside it: it is itself the scrolling area.
- On desktop, dragging with the mouse is not obvious; also keep a visible button that calls the same function and show the state with `refreshing`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/pull-to-refresh · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
