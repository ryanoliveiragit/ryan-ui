# Sign in

> Cartão de entrada que passa de e-mail para código de seis dígitos e depois para a sua conta.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/sign-in
- Original description: A sign in card that morphs from email to a six digit code to your account.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sign-in.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sign-in.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sign-in.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sign-in.json`. Registry path, relative to the site address: `r/sign-in.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Avatar](avatar.md), [Button](button.md), [Input](input.md), [OTP input](otp-input.md)
- Files, once installed:
  - `components/ryan-ui/blocks/sign-in/sign-in.tsx`
  - `components/ryan-ui/blocks/sign-in/sign-in.module.css`
  - `components/ryan-ui/lib/media.ts`
  - `components/ryan-ui/otp-input/otp-input.tsx`
  - `components/ryan-ui/otp-input/otp-input.module.css`
  - `components/ryan-ui/input/input.tsx`
  - `components/ryan-ui/input/input.module.css`
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`
  - `components/ryan-ui/avatar/avatar.tsx`
  - `components/ryan-ui/avatar/avatar.module.css`
  - `components/ryan-ui/lib/ryan-provider.tsx`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/sign-in.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Standalone sign-in card on your own page, with email plus a 6-digit code as the main path and passkey and three single sign-on providers as alternatives.
- Prototypes that need a navigable sign-in flow without a backend: submit, verification, and providers are simulated with timers.
- When it is worth fixing common domain mistakes in the email: “gmial.com” becomes the suggestion “gmail.com”, applied with one click.

## When not to use

- Use [`login-centered`](login-centered.md) when the login takes the full screen, passkey should come first, or the same card needs to switch to account creation.
- Use [`signup-form`](signup-form.md) to create an account with name, password, and terms acceptance.
- Use [`otp-input`](otp-input.md) when you already have the flow and only need the code field.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import SignIn from "@/components/ryan-ui/blocks/sign-in/sign-in";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { layout: "center", height: 720 };

export default function SignInDemo() {
  return <SignIn />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SignIn`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `demoCode` | `string` | `"123456"` | The code the simulated email contains. |
| `onSignIn` | `(account: SignInAccount, method: SignInMethod) => void` | — | Called once the simulated sign in succeeds. |

### Exported types

| Type | Definition |
| --- | --- |
| `SignInMethod` | `"Email code" \| "Passkey" \| Provider` |

#### `SignInAccount`

| Field | Type | Description |
| --- | --- | --- |
| `name` (required) | `string` | — |
| `email` (required) | `string` | — |
| `photo` | `string` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` | In the email field, moves on to the code; in a code cell, submits the verification, which also fires on its own when all 6 cells are filled. |
| `←` or `→` | On the code step, move focus between the cells (`otp-input` behavior). |
| `Backspace` | In an empty code cell, clears the previous one and moves focus back to it. |
| `Tab` | Moves through the controls of the step; the resend button stays focusable during the countdown, with `aria-disabled`. |

## Accessibility

- Each step change is announced by a hidden `role="status"` region with `aria-live="polite"`; the visible status line in the footer is `aria-hidden`.
- Focus follows the flow: first code cell, welcome heading on completion, and the email field, with its text selected, when changing email or leaving.
- The providers form a named `role="group"` with an `aria-label` per button, the resend says in its `aria-label` how many seconds remain, and the domain suggestion is a “Use …” button.

## Motion

- Steps cross sideways coming out of a slight blur, returning from the opposite side, and the card height follows the new step on a spring that does not overshoot only during the switch.
- On completion via the code, the small avatar grows into the large one (shared layout), a ring draws around it, a checkmark badge appears, and the title, details, and button rise in sequence.
- With “reduce motion” on, steps only fade, the height changes instantly, and the avatar, ring, and badge appear without animation.

## Responsive behavior

- The card uses `min(100%, 432px)`; a container query up to 380 px tightens margins, title, and provider buttons, and up to 480 px of viewport the radius shrinks.

## Performance

- A `ResizeObserver` measures the content to animate the height and the resend countdown uses a 1 s timer only on the code step; timers are cleared on unmount.

## Notes for AI

- Nothing is actually authenticated: `submitEmail`, `verify`, and `signInWith` use `setTimeout` and `onSignIn(account, method)` only signals the end of the simulation; replace these functions with the real calls.
- There are only two props, `demoCode` (default `123456`, shown as a hint in the code field) and `onSignIn`; remove the hint in production and note that the texts are hardcoded in English.
- Depends on `avatar`, `button`, `input`, and `otp-input`; the footer's “Sign up” only changes the status line, so hook it up to your signup route, for example with `signup-form`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/sign-in · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
