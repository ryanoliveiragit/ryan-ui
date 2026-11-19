# Sign up form

> Cadastro com validação por campo, força da senha e um estado de conclusão claro.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/signup-form
- Original description: An account creation flow with field validation, password strength, and a clear completion state.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/signup-form.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/signup-form.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/signup-form.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/signup-form.json`. Registry path, relative to the site address: `r/signup-form.json`.

- npm packages: `@radix-ui/react-checkbox`, `motion`
- Uses other ryan-ui items (installed along with it): [Button](button.md), [Checkbox](checkbox.md), [Input](input.md), [Password field](password-field.md)
- Files, once installed:
  - `components/ryan-ui/blocks/signup-form/signup-form.tsx`
  - `components/ryan-ui/blocks/signup-form/signup-form.module.css`
  - `components/ryan-ui/password-field/password-field.tsx`
  - `components/ryan-ui/password-field/password-field.module.css`
  - `components/ryan-ui/input/input.tsx`
  - `components/ryan-ui/input/input.module.css`
  - `components/ryan-ui/checkbox/checkbox.tsx`
  - `components/ryan-ui/checkbox/checkbox.module.css`
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-checkbox motion`.
2. Copy the files listed above. The content of each one is in `r/signup-form.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Account-creation page or card with single sign-on (Google, Apple, GitHub) and, below it, name, work email, and a password with a strength meter.
- Flows where the error should appear on the right field: messages show up when leaving a filled field or on submit, and focus goes to the first invalid one.
- When creation needs to end in a clear completion state, showing the method used and the email preference, without changing pages.

## When not to use

- Use [`sign-in`](sign-in.md) or [`login-centered`](login-centered.md) for people who already have an account.
- Use [`newsletter-signup`](newsletter-signup.md) when you only need to collect an email.
- Use [`password-strength`](password-strength.md) when you want only the strength meter inside a form of your own.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import SignupForm from "@/components/ryan-ui/blocks/signup-form/signup-form";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { layout: "center", height: 800 };

export default function SignupFormDemo() {
  return <SignupForm />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SignupForm`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onSubmit` | `(details: SignupDetails) => void \| Promise<void>` | — | Receives the details once every field is valid. Throw to show a submit error. |
| `serverError` | `string \| null` | — | An error from your API, shown above the submit button. |
| `onProvider` | `(provider: Provider) => void` | — | Called when someone picks a single sign-on provider. The preview simulates the redirect. |

### Exported types

#### `SignupDetails`

| Field | Type | Description |
| --- | --- | --- |
| `name` (required) | `string` | — |
| `email` (required) | `string` | — |
| `password` (required) | `string` | — |
| `productUpdates` (required) | `boolean` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` | In any field, submits the form; with an error, focus goes to the first invalid field. |
| `Space` | On the “Email me product updates” box, checks or unchecks it (Radix checkbox). |

## Accessibility

- The fields come from `input` and `password-field`, with a visible label and an error message linked to each one; on submit with an error, focus goes to the first invalid field.
- The strength line is linked to the password by `aria-describedby` and becomes `role="alert"` on error; the colored meter is `aria-hidden`, so the level arrives in words, from “Weak” to “Strong”.
- The submit error, yours (`serverError`) or thrown by `onSubmit`, appears in `role="alert"`; steps are announced by `role="status"` and the welcome heading receives focus on completion.

## Motion

- Steps cross sideways coming out of a slight blur, the card height follows on a spring that does not overshoot only during the switch, and completion draws a circle and then a checkmark.
- The strength text swaps in place rising from a slight blur while the meter lights up bar by bar, with a color per level, and the submit error line opens its own height on a spring.
- With “reduce motion” on, steps only fade, the height and lines change instantly, the checkmark appears already drawn, and the meter changes color without a transition.

## Responsive behavior

- The card uses `min(100%, 432px)`; a container query up to 380 px tightens margins, title, provider buttons, and meter bars, and up to 480 px of viewport the radius shrinks.

## Notes for AI

- `onSubmit(details)` receives `name`, `email`, `password`, and `productUpdates`; throw an `Error` to show its message, and note that completion waits at least 700 ms even with a fast response.
- `serverError` shows an error from your API above the button; `onProvider(provider)` is called on click, but the block simulates the redirect and completes in 900 ms with example data.
- The rules are fixed (name with 2 or more characters, complete email, password with 8 or more) and the messages are in English; “Terms”, “Privacy policy”, and “Sign in” only change the status line.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/signup-form · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
