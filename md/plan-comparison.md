# Plan comparison

> Comparação de planos com troca de cobrança mensal ou anual e foco nas diferenças reais.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/plan-comparison
- Original description: Compare meaningful differences between plans and billing periods.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/plan-comparison.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/plan-comparison.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/plan-comparison.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/plan-comparison.json`. Registry path, relative to the site address: `r/plan-comparison.json`.

- npm packages: `@radix-ui/react-switch`, `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Button](button.md), [Segmented control](segmented-control.md), [Switch](switch.md)
- Files, once installed:
  - `components/ryan-ui/blocks/plan-comparison/plan-comparison.tsx`
  - `components/ryan-ui/blocks/plan-comparison/plan-comparison.module.css`
  - `components/ryan-ui/switch/switch.tsx`
  - `components/ryan-ui/switch/switch.module.css`
  - `components/ryan-ui/segmented-control/segmented-control.tsx`
  - `components/ryan-ui/segmented-control/segmented-control.module.css`
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-switch lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/plan-comparison.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Pricing section that compares two plans row by row, with a switch between monthly and annual billing and a filter to show only the differences.
- Starting point for editing: plans, prices, and features are constants at the top of the file, ready to be replaced with your own.

## When not to use

- Use [`comparison-table`](comparison-table.md) to compare your product with competitors, with a sticky header and a highlighted column.
- Use [`billing-toggle`](billing-toggle.md) when you only need the period switch with rolling prices, in plan cards.
- For three or more plans the block does not work as is: the grid and the `Feature` type have exactly two columns, Team and Studio.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import PlanComparison from "@/components/ryan-ui/blocks/plan-comparison/plan-comparison";

export default function PlanComparisonDemo() {
  return <PlanComparison />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `PlanComparison`

No props of its own: accepts those of the element or primitive it wraps.

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | In the period selector, switch between monthly and annual and move focus along (`segmented-control`). |
| `Space` or `Enter` | On the “Show differences only” switch, turn the filter on or off; on a plan button, select or clear the selection. |

## Accessibility

- The matrix uses ARIA table roles (`table`, `row`, `columnheader`, `rowheader`, `cell`), and each value carries the plan name in hidden text, so it makes sense read on its own.
- The plan buttons expose `aria-pressed` and a `role="status"` region announces the chosen plan; each plan's price sits in an `aria-live="polite"` region with `aria-atomic`.
- The filter is the `switch` labeled “Show differences only” and the period is the `segmented-control` named “Billing period”.

## Motion

- Switching the period makes each price count up to the new value in 0.24 s, and the “N of 8 features” count follows the filter.
- Turning on the filter collapses the height of the identical feature rows on a spring that does not overshoot and reopens them with a fade; choosing a plan tints the column and a 2 px rail slides to it.
- With “reduce motion” on, the numbers change instantly, rows enter and leave without animation, and the rail jumps.

## Responsive behavior

- The layout follows the block's width, measured by a `ResizeObserver`: up to 720 px the intro stacks and the margins shrink; up to 540 px the feature name moves above the two values and the “What changes” column disappears.

## Notes for AI

- `PlanComparison` takes no props: edit `features` (with `shared: true` on what the filter hides) and `pricing` at the top of the file, and the hardcoded texts in the JSX.
- The “Select …” buttons only mark the plan with `aria-pressed`, with no callback; hook up your checkout by replacing their `onClick`.
- The “Included” and “Not included” values are compared as exact text to get the checkmark and the muted tone; the block depends on `button`, `segmented-control`, and `switch`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/plan-comparison · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
