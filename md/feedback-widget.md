# Feedback widget

> Botão flutuante de feedback que vira um formulário com humor e mensagem, passa pelo envio e termina num agradecimento.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/feedback-widget
- Original description: A floating feedback button that morphs into a small form with a mood picker and a message field, then walks through sending into a drawn check and a thank-you.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/feedback-widget.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/feedback-widget.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/feedback-widget.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/feedback-widget.json`. Registry path, relative to the site address: `r/feedback-widget.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/blocks/feedback-widget/feedback-widget.tsx`
  - `components/ryan-ui/blocks/feedback-widget/feedback-widget.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/feedback-widget.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Collecting quick feedback on any page (help center, article, dashboard) with a fixed button in the corner that does not take the person away from what they were doing.
- One-click satisfaction surveys, with five faces and an optional message.

## When not to use

- Use [`contact-section`](contact-section.md) when the message needs name, email, and subject in order to get a reply.
- Use [`rating`](rating.md) for a score inside a form.
- Avoid with another floating button in the same corner, such as a support chat: the widget is fixed to the bottom corner, on a high layer (`z-index: 50`), and the two would compete for the spot.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import FeedbackWidgetPreview from "@/components/ryan-ui/blocks/feedback-widget/feedback-widget";

// The preview starts with the panel open, so the moods and the note are visible; it opens without taking focus from the page.
export default function FeedbackWidgetDemo() {
  return <FeedbackWidgetPreview defaultOpen />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `FeedbackWidget`

A floating feedback button that grows into a small form, from its own corner, on a layout spring. Pick a mood (the highlight glides between faces), add a note, and the button walks through sending into a drawn check and a thank-you. Escape or a click outside closes it and returns focus to the button.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `"Feedback"` | Text on the floating button. |
| `title` | `string` | `"How is it going?"` | Heading of the form. |
| `placeholder` | `string` | `"Tell us what happened (optional)"` | Placeholder of the message field. |
| `thanksTitle` | `string` | `"Thank you"` | Heading of the thank-you state. |
| `thanksMessage` | `string` | `"Your feedback goes straight to the team."` | Line under the thank-you heading. |
| `onSubmit` | `(feedback: Feedback) => void \| Promise<void>` | — | Receives the feedback. Return a promise to hold the sending state until it settles; reject it to show an error and keep the form. |
| `open` | `boolean` | — | Whether the form is open (controlled). |
| `defaultOpen` | `boolean` | `false` | Whether the form starts open (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the form opens or closes. |
| `placement` | `"bottom-right" \| "bottom-left"` | `"bottom-right"` | Corner the widget sits in. |
| `contained` | `boolean` | `false` | Pins the widget inside the nearest positioned ancestor instead of the window, for panels and previews. |
| `className` | `string` | — | Extra class for the root. |

### `FeedbackWidgetPreview`

Ready preview: a help article with the widget in its corner. `defaultOpen` starts with the panel open.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `FeedbackMood` | `"terrible" \| "bad" \| "okay" \| "good" \| "great"` |

#### `Feedback`

| Field | Type | Description |
| --- | --- | --- |
| `mood` (required) | `"terrible" \| "bad" \| "okay" \| "good" \| "great"` | The mood that was picked. |
| `message` (required) | `string` | The optional message, trimmed. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the “Feedback” button, open the form and move focus to the first face. |
| `↑` or `↓` or `←` or `→` | In the faces group, choose the previous or next one, wrapping around; with no choice, `→` and `↓` start at the first and `←` and `↑` at the last. |
| `Ctrl + Enter` or `⌘ + Enter` | In the message field, submit the form, as long as a face has been chosen. |
| `Esc` | Closes the form and returns focus to the button, except during submission. |

## Accessibility

- The button has `aria-haspopup="dialog"`; the panel is a `role="dialog"` named by the title, but not modal: focus is not trapped, and Esc or a click outside closes it and returns focus to the button.
- The faces form a `radiogroup` with roving focus and names (from “Terrible” to “Great”), and the name of the chosen face is announced in an `aria-live` region.
- Submission exposes `aria-busy`, the failure appears in `role="alert"` and the thank-you in `role="status"`; the message field has the hidden label “Your feedback”.

## Motion

- The button itself transforms into the panel, from its corner, on a no-overshoot layout spring, and the content appears gradually right after.
- The highlight slides to the chosen face, which grows and rotates slightly; on completion, the badge appears with a bounce, the checkmark is drawn, and the panel closes by itself after 2.6 s.
- With “reduce motion” on, the panel opens and closes instantly, with no morph or rotation, and the submit indicator stays still.

## Responsive behavior

- It stays fixed to the window (`position: fixed`) in the corner chosen by `placement`; with `contained`, it attaches to the nearest positioned ancestor, as in a panel or a preview.
- The panel is 21rem wide, limited to the available space; on screens up to 30rem, the distance to the edges shrinks.

## Notes for AI

- Import `FeedbackWidget` by name (the default export is the preview with a help article) and mount it once in the page layout: it pins itself to the corner.
- `onSubmit` receives `{ mood, message }`, with the message already trimmed: return a promise to hold the submitting state and reject it to show the error and keep the form.
- The face names and the failure, submitting, and “Close” texts are hardcoded in English; `label`, `title`, `placeholder`, `thanksTitle`, and `thanksMessage` come through props.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/feedback-widget · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
