# Page header

> Cabeçalho de projeto que encolhe numa barra compacta ao rolar, com abas de contagem animada.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/page-header
- Original description: A project page header that folds into a compact bar as you scroll, with tabs whose counts roll.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/page-header.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/page-header.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/page-header.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/page-header.json`. Registry path, relative to the site address: `r/page-header.json`.

- npm packages: `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tabs`, `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Animated counter](animated-counter.md), [Avatar](avatar.md), [Avatar group](avatar-group.md), [Badge](badge.md), [Button](button.md), [Progress](progress.md)
- Files, once installed:
  - `components/ryan-ui/blocks/page-header/page-header.tsx`
  - `components/ryan-ui/lib/use-copy-feedback.ts`
  - `components/ryan-ui/blocks/page-header/page-header.module.css`
  - `components/ryan-ui/progress/progress.tsx`
  - `components/ryan-ui/progress/progress.module.css`
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`
  - `components/ryan-ui/badge/badge.tsx`
  - `components/ryan-ui/badge/badge.module.css`
  - `components/ryan-ui/avatar-group/avatar-group.tsx`
  - `components/ryan-ui/avatar-group/avatar-group.module.css`
  - `components/ryan-ui/avatar/avatar.tsx`
  - `components/ryan-ui/avatar/avatar.module.css`
  - `components/ryan-ui/lib/ryan-provider.tsx`
  - `components/ryan-ui/animated-counter/animated-counter.tsx`
  - `components/ryan-ui/animated-counter/animated-counter.module.css`
  - `components/ryan-ui/lib/media.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-dropdown-menu @radix-ui/react-tabs lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/page-header.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Starting point for a project page header in an app: breadcrumb, title with status, members, actions, and section tabs with counts.
- Long screens where the title should get out of the way on scroll without disappearing: the header folds into a compact bar that takes you back to the top.

## When not to use

- Use [`site-header`](site-header.md) for a site's top navigation; this block is the header of a page inside the product.
- Use [`tabs`](tabs.md) or [`breadcrumb`](breadcrumb.md) when you only need the section switch or only the breadcrumb, not the whole set.
- If the page scrolls the window, the fold does not happen: it reads the scroll of the block's inner body, which has a fixed height of 640 px.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import PageHeader from "@/components/ryan-ui/blocks/page-header/page-header";

export default function PageHeaderDemo() {
  return <PageHeader />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `PageHeader`

No props of its own: accepts those of the element or primitive it wraps.

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | In the sections row, move focus to the neighboring tab and select it right away, wrapping around at the ends (Radix tabs). |
| `Home` or `End` | Select the first or last section. |
| `Tab` | From the active tab, moves on to the section panel, which is focusable. |
| `Enter` or `Space` or `↓` | On the three-dot button, open the actions menu (Radix). |
| `↑` or `↓` | In the actions menu, move between items and wrap around at the ends. |
| `Esc` | Closes the menu and returns focus to the three-dot button. |

## Accessibility

- The breadcrumb sits in a `<nav aria-label="Breadcrumb">` with `aria-current="page"`; when folded it becomes `inert` and a button with the title takes over, scrolling to the top and moving focus to the `<h2>`.
- The results of the actions (follow, share, create or complete an issue, copy the link) are announced by a `role="status"` region, and the visual notice is `aria-hidden`.
- When an issue is completed, focus moves to the next issue's button or to the panel when the list empties; below 460 px “New issue” becomes icon-only and keeps its `aria-label`.

## Motion

- Scrolling the body past 16 px folds the header: the intro collapses its height on a spring that does not overshoot, the title shrinks and blurs, and the breadcrumb gives way to the compact title, which only reopens at 4 px from the top.
- The active tab's underline slides between tabs, the counts roll, the panel enters sliding 12 px in the direction of the chosen tab, and issue rows open and close their own height.
- With “reduce motion” on, the fold, panels, and rows change instantly or only fade, the underline jumps, and the CSS transitions are removed.

## Responsive behavior

- When the bar gets narrow, “Follow” and “Share update” collapse into the three-dot menu (width on a spring) and only return with some slack, without flickering at the threshold.
- The frame's container queries: up to 559 px the first breadcrumb level disappears, the tabs row scrolls sideways with a faded edge, and the rows rearrange; on screens up to 560 px the frame takes almost the full height.

## Performance

- A `ResizeObserver` on the bar alone decides when to collapse the actions, and the timers for the simulated actions and the 3.2 s notice are cleared on unmount.

## Notes for AI

- `PageHeader` takes no props: project, breadcrumb, people, issues, updates, and files are constants in the file and the actions are simulated, so copy the installed file and replace the data and handlers with your own.
- The fold depends on the inner body with its own scroll (`.scroller`) inside a fixed-height frame; with `auto` height the body does not scroll and the header never folds.
- Needs `animated-counter`, `avatar`, `avatar-group`, `badge`, `button`, and `progress`, plus the Radix tabs and menu; the example photos come from `@/lib/media`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/page-header · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
