# CTA buttons

> Três botões de chamada: seta que se expande e preenche o botão, deslize para confirmar e botão magnético que segue o cursor.

- Type: component (category Actions), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/cta-buttons
- Original description: Three call-to-action buttons: an arrow disc that expands to fill the button on hover, a slide-to-confirm thumb, and a magnetic button that leans toward the cursor.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cta-buttons.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cta-buttons.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cta-buttons.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cta-buttons.json`. Registry path, relative to the site address: `r/cta-buttons.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/cta-buttons/cta-buttons.tsx`
  - `components/ryan-ui/cta-buttons/cta-buttons.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/cta-buttons.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- The main call to action of a marketing page or the end of a section, with `ArrowButton` (“Start free trial”) or `MagneticButton` (“Schedule a demo”).
- Confirming something that should not happen from an accidental tap, like a payment, with `SlideToConfirm`.

## When not to use

- Use [`button`](button.md) for common interface actions, like forms, dialogs, and toolbars; these three are showcase buttons.
- Use [`hold-to-confirm`](hold-to-confirm.md) or [`confirm-morph`](confirm-morph.md) when the confirmation needs to fit in a button-sized control: `SlideToConfirm` is a 52 px tall track that takes the parent's width.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { ArrowButton, MagneticButton, SlideToConfirm } from "@/components/ryan-ui/cta-buttons/cta-buttons";
import { Caption, Row, Stack } from "./_kit";

export default function CtaButtonsDemo() {
  const [trials, setTrials] = useState(0);
  const [paid, setPaid] = useState(false);

  return (
    <Stack gap={8} align="center" width={520}>
      <Stack gap={3} align="center">
        <Row gap={3} justify="center">
          <ArrowButton onClick={() => setTrials(count => count + 1)}>Start free trial</ArrowButton>
          <ArrowButton size="md">See pricing</ArrowButton>
        </Row>
        <Caption>{trials === 0 ? "Hover or focus: the arrow disc grows to fill the button." : `Trial started ${trials} ${trials === 1 ? "time" : "times"}. No card needed.`}</Caption>
      </Stack>

      <Stack gap={3} align="center">
        <Row gap={4} justify="center">
          <MagneticButton>Book a demo</MagneticButton>
          <MagneticButton variant="outline" strength={0.22}>Talk to sales</MagneticButton>
        </Row>
        <Caption>Bring the cursor close: the buttons lean toward it.</Caption>
      </Stack>

      <Stack gap={3} align="center" style={{ width: "100%" }}>
        <SlideToConfirm label="Slide to pay $48.00" confirmedLabel="Payment sent" confirmed={paid} onConfirmedChange={setPaid} resetAfter={2600} />
        <Caption>{paid ? "Paid to Fernway Studio. Resetting for the demo." : "Drag the thumb to the end, or focus it and press Enter."}</Caption>
      </Stack>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ArrowButton`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` | — | The label. |
| `href` | `string` | — | Renders a link instead of a button. |
| `target` | `string` | — | Link target, used with `href`. |
| `rel` | `string` | — | Link relationship, used with `href`. |
| `onClick` | `(event: MouseEvent<HTMLElement>) => void` | — | Runs when the button is pressed. |
| `icon` | `ReactNode` | — | Replaces the arrow. |
| `size` | `"md" \| "lg"` | `"lg"` | Height: 44 or 50 px. |
| `type` | `"button" \| "submit"` | `"button"` | Button type, used without `href`. |
| `disabled` | `boolean` | `false` | Turns the control off: it is dimmed and ignores pointer and keyboard input. |
| `className` | `string` | — | Extra class names for the root element. |

### `MagneticButton`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` | — | The label. |
| `href` | `string` | — | Renders a link instead of a button. |
| `onClick` | `(event: MouseEvent<HTMLElement>) => void` | — | Runs when the button is pressed. |
| `strength` | `number` | `0.32` | How far the button follows the cursor, as a share of the cursor's distance from its center. 0 turns the pull off. |
| `reach` | `number` | `36` | How far outside its edges, in px, the button starts to feel the cursor. |
| `variant` | `"accent" \| "outline"` | `"accent"` | `accent` is the filled call to action; `outline` is the quiet one beside it. |
| `type` | `"button" \| "submit"` | `"button"` | Button type, used without `href`. |
| `disabled` | `boolean` | `false` | Turns the control off: it is dimmed and ignores pointer and keyboard input. |
| `className` | `string` | — | Extra class names for the root element. |

### `SlideToConfirm`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `"Slide to confirm"` | The prompt on the track, and the thumb's accessible name. |
| `confirmedLabel` | `string` | `"Confirmed"` | Shown once the action is confirmed. |
| `onConfirm` | `() => void` | — | Runs once, when the thumb is released at the end of the track or confirmed from the keyboard. |
| `confirmed` | `boolean` | — | Confirmed state (controlled). Set it back to false to return the thumb to the start. |
| `defaultConfirmed` | `boolean` | `false` | Confirmed at first (uncontrolled). |
| `onConfirmedChange` | `(confirmed: boolean) => void` | — | Runs when the confirmed state changes. |
| `resetAfter` | `number` | — | Milliseconds after which a confirmed slider resets itself. Leave out to stay confirmed. |
| `threshold` | `number` | `0.9` | Share of the track, from 0 to 1, the thumb must cover for a release to count. |
| `disabled` | `boolean` | `false` | Turns the control off: it is dimmed and ignores pointer and keyboard input. |
| `className` | `string` | — | Extra class names for the root element. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On `ArrowButton` and `MagneticButton`, trigger the button; with `href` they are links and respond only to `Enter`. |
| `Enter` or `Space` | On `SlideToConfirm`, with focus on the thumb, confirm directly, without dragging. |

## Accessibility

- `ArrowButton` and `MagneticButton` are native `<button>`, or `<a>` when they get `href`; on `ArrowButton`, the colored copy of the label is `aria-hidden`, and the name is the children's text.
- On `SlideToConfirm`, the thumb is a button with an `aria-label` equal to `label` (afterward, `confirmedLabel`); keyboard activation confirms without dragging, and a `role="status"` announces the confirmation.
- The track text is `aria-hidden` and the defaults are in English (“Slide to confirm”, “Confirmed”): write the whole action in `label`, like “Slide to pay R$ 48”.

## Motion

- `ArrowButton`: on hover, keyboard focus, or press, the arrow disc grows to cover the button (0.48 s), the label changes color at the fill edge, and a new arrow enters from the left.
- `MagneticButton`: with the mouse within `reach` px, the button follows the cursor on a loose spring, with a slight sway on return, and the label moves a bit further; touch and pen move nothing.
- `SlideToConfirm`: the thumb arrows nudge every 1.8 s and releasing before `threshold` (90%) returns it on a spring; with “reduce motion”, none of this animates, the magnet stops, and `ArrowButton` fills with no transition.

## Responsive behavior

- `SlideToConfirm` takes the parent's width up to `20rem` and measures the track with an observer, so the thumb travel adjusts; with `touch-action: pan-y`, vertical scrolling still works over it.
- On `ArrowButton`, the label does not wrap and ends in an ellipsis when space runs out.

## Performance

- Each `MagneticButton` listens to `pointermove` on the whole window and measures its own position on every mouse move; use few per page.

## Notes for AI

- They are three exports from the same file: `import ArrowButton, { MagneticButton, SlideToConfirm } from "@/components/ryan-ui/cta-buttons/cta-buttons"` (the default is `ArrowButton`).
- On `SlideToConfirm`, the action goes in `onConfirm`, which runs once (a simple tap only wiggles the thumb); to control it, use `confirmed` with `onConfirmedChange`, and `resetAfter` to return to the start on its own.
- `ArrowButton` and `MagneticButton` become links with `href`; `ArrowButton` accepts `icon` in place of the arrow and `size` `md` or `lg`, and `MagneticButton` accepts `strength` (0 turns off the magnet) and `reach`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/cta-buttons · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
