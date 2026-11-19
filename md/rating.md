# Rating

> Avaliação por estrelas acessível, com meias estrelas, teclado e opção de limpar.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/rating
- Original description: A simple, accessible way to capture a numeric opinion.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/rating.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/rating.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/rating.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/rating.json`. Registry path, relative to the site address: `r/rating.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/rating/rating.tsx`
  - `components/ryan-ui/rating/rating.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/rating.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Asking for a quick rating after a purchase, stay, or support interaction.
- Showing the average of reviews with half stars, in `readOnly` mode.
- Forms with several criteria, each with its own rating and a supporting line in `description`.

## When not to use

- Use [`reactions`](reactions.md) to acknowledge a post with one tap, without a rating scale.
- Use [`slider`](slider.md) when the scale has many points, such as 0 to 100.
- Use [`radio-group`](radio-group.md) when each point on the scale needs its own visible text, as in an agreement scale.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Rating } from "@/components/ryan-ui/rating/rating";
import { Caption, Stack } from "./_kit";

export default function RatingDemo() {
  const [score, setScore] = useState(4);
  return (
    <Stack gap={6} width={360}>
      <Rating label="How was your stay?" description="Tap a star, or click it again to clear." value={score} onChange={setScore} size="lg" />
      <Rating label="Cleanliness (half stars)" defaultValue={3.5} allowHalf />
      <Rating label="Average from 212 reviews" defaultValue={4.5} allowHalf readOnly size="sm" />
      <Caption>Your score: {score || "none"}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Rating`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `value` | `number` | — | — |
| `defaultValue` | `number` | `0` | — |
| `onChange` | `(value: number) => void` | — | Receives the committed value; 0 means the rating was cleared. |
| `max` | `number` | `5` | — |
| `readOnly` | `boolean` | `false` | — |
| `disabled` | `boolean` | `false` | — |
| `description` | `string` | — | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | — |
| `className` | `string` | — | — |
| `allowHalf` | `boolean` | `false` | Pointer, touch, and arrow keys move in half stars. |
| `allowClear` | `boolean` | `true` | Choosing the current value again clears it; Backspace and Delete clear from the keyboard. |
| `showValue` | `boolean` | `true` | Show the word or number for the previewed value beside the stars. |
| `valueLabels` | `readonly string[]` | — | One word per whole star. Five whole stars default to "Poor" through "Excellent"; anything else reads "4 out of 5". |
| `emptyLabel` | `string` | `"Not rated"` | Shown beside empty stars. |
| `name` | `string` | — | Submits the value with a surrounding form. |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `↑` | Raise the rating by one step (half a star with `allowHalf`) and move focus along. |
| `←` or `↓` | Lower it by one step; below the first star, the rating is cleared if `allowClear` is on. |
| `Home` or `End` | Go to the lowest or the highest rating. |
| `1–9` | Give that rating directly, up to the value of `max`. |
| `Backspace` or `Delete` | Clear the rating when `allowClear` is on, which is the default. |
| `Space` or `Enter` | Choose the focused star. |

## Accessibility

- The stars form a `radiogroup` tied to the label, with one `role="radio"` button per value (two per star with `allowHalf`) read as “Great, 4 of 5 stars”, and only the current value is in the Tab order.
- With `readOnly`, the group becomes `role="img"` with the rating in its name (“… 4.5 out of 5”) and nothing receives focus.
- Pointer choices and a cleared rating are announced in an `aria-live` region; the default words (“Poor” to “Excellent”, “Not rated”) are in English, change them with `valueLabels` and `emptyLabel`.

## Motion

- On choosing, the fill sweeps the stars from left to right and each one gives a little wave-like hop; quick successive choices, such as a held arrow key, make only the chosen star hop.
- Hovering shows a preview over the saved rating, which stays as a faint mark, and the value word rolls in the direction of the change.
- With “reduce motion” on, fill, hop, and words change instantly.

## Responsive behavior

- The `sm`, `md`, and `lg` cells measure 28, 36, and 44px; on touch screens prefer `lg`, and a finger can slide across the stars, with the rating taking effect on release.
- When width runs short, the value word drops to the line below; it reserves the space of the longest word and pushes nothing when it changes.

## Notes for AI

- `onChange` receives the confirmed rating and 0 means cleared; clicking the current rating again also clears it, unless `allowClear={false}`.
- For an average of reviews, use `readOnly` with `allowHalf` and a value like 4.5; values are rounded to the step, half star or whole.
- The default words only appear with `max={5}` without half stars, and in other cases the text is “4 out of 5”, so for Portuguese pass `valueLabels` or `showValue={false}`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/rating · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
