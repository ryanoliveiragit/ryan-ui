# CTA section

> Chamada para ação como fecho centralizado, dividida ao lado de um cartão de configuração ou em faixa dispensável.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/cta-section
- Original description: A call to action as a centered closing section, a split beside a setup card that completes itself, or a dismissible banner.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cta-section.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cta-section.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cta-section.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cta-section.json`. Registry path, relative to the site address: `r/cta-section.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Button](button.md), [Segmented control](segmented-control.md)
- Files, once installed:
  - `components/ryan-ui/blocks/cta-section/cta-section.tsx`
  - `components/ryan-ui/blocks/cta-section/cta-section-data.ts`
  - `components/ryan-ui/lib/media.ts`
  - `components/ryan-ui/blocks/cta-section/cta-section.module.css`
  - `components/ryan-ui/segmented-control/segmented-control.tsx`
  - `components/ryan-ui/segmented-control/segmented-control.module.css`
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/cta-section.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- The closing of a landing page with a title, text, and two actions, in the `centered` variant, with faces and a short note as social proof.
- A call-to-action beside a product demo, in the `split` variant, with a benefits list and a setup card that completes itself on entering the screen (or your own `visual`).
- A single-line launch notice, in the `banner` variant, which can be dismissed and closes the space it occupied.

## When not to use

- Use [`announcement-bar`](announcement-bar.md) for a strip at the top that alternates messages or runs a countdown.
- Use [`newsletter-signup`](newsletter-signup.md) when the action is leaving an email.
- Use [`hero-section`](hero-section.md) for the page opening; this section is meant for the middle or end of the page.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import CtaSectionBlock from "@/components/ryan-ui/blocks/cta-section/cta-section";

export default function CtaSectionDemo() {
  return <CtaSectionBlock />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CtaSection`

A call to action in three shapes: a centered closing section, a split layout beside a setup card that completes itself in view, and a compact banner that closes its gap when dismissed.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"centered" \| "split" \| "banner"` | `"centered"` | `centered` is a closing section, `split` sits beside a product visual, `banner` is one dismissible line. |
| `title` | `string` | — | — |
| `description` | `string` | — | — |
| `primaryAction` | `CtaAction` | — | — |
| `secondaryAction` | `CtaAction \| null` | — | Not shown in the banner variant. Pass null to hide it. |
| `note` | `string` | — | Small print under the actions in the centered variant, such as "No credit card required". |
| `faces` | `string[]` | `ctaFaces` | Faces beside the note in the centered variant. Pass an empty array to hide them. |
| `points` | `string[]` | — | Short benefit lines in the split variant. |
| `visual` | `ReactNode` | — | Replaces the split variant's setup card. |
| `onDismiss` | `() => void` | — | Banner only: shows a dismiss button and calls this after it closes. |
| `className` | `string` | — | — |

### `CtaSectionBlock`

Preview: all three shapes. Buttons confirm in place; nothing is sent.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `CtaVariant` | `"centered" \| "split" \| "banner"` |

#### `CtaAction`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `href` | `string` | Renders a link. |
| `onClick` | `() => void` | — |
| `confirmedLabel` | `string` | With no href or onClick, the button confirms in place with this label, which suits previews. |

### Other exports

- `ctaCopy` (value)
- `ctaFaces` (function)
- `ctaSetup` (value)

## Accessibility

- Each variant is a `section` named by the title (`h2` in `centered` and `split`, bold text in `banner`); the dismiss button is called “Dismiss” and appears only with `onDismiss`.
- The setup card and the faces are decorative (`aria-hidden`); actions with neither `href` nor `onClick` swap the label in an `aria-live` region when clicked.

## Motion

- In `split`, the stage rises on entering the screen and the card checks off the steps one by one, every 0.6 s, filling the progress bar up to “Ready”.
- In `banner`, dismissing closes the height with a no-overshoot spring and only then calls `onDismiss`; the actions' arrow advances slightly on hover.
- With “reduce motion” on, the card already appears complete, the stage does not rise, the banner disappears without gradually closing its height, and CSS transitions are turned off.

## Responsive behavior

- Container query: below 860px the `split` stacks the text above the stage; below 560px the actions take the full width, one above the other, and the `banner` becomes a block with the actions underneath.

## Notes for AI

- Import `CtaSection` by name (the default export is the preview with a variant selector); all texts have example defaults, so always pass `title`, `description`, and `primaryAction`.
- Each action is `{ label, href?, onClick?, confirmedLabel? }`: with `href` it becomes a link, with `onClick` it calls the function, and with neither it only toggles the label, which suits previews and not production.
- In `banner`, the close button exists only if you pass `onDismiss`; `secondaryAction={null}` hides the second action and `faces={[]}` removes the faces from `centered`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/cta-section · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
