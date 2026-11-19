# Password strength

> Mostra a força de uma nova senha enquanto ela é digitada, com requisitos em tempo real.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/password-strength
- Original description: Show how strong a new password is while it is typed.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/password-strength.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/password-strength.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/password-strength.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/password-strength.json`. Registry path, relative to the site address: `r/password-strength.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/password-strength/password-strength.tsx`
  - `components/ryan-ui/password-strength/password-strength.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/password-strength.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Sign-up or password change, when people need to see the rules being met as they type.
- Custom password policies: rules, labels, minimum length, and texts are all configurable through props.
- Flows that react to strength in code, since `onValueChange` delivers the level and the rules met along with the value.

## When not to use

- Use [`password-field`](password-field.md) on login, where measuring strength only gets in the way of people who already have a password.
- Use [`signup-form`](signup-form.md) when you need the whole sign-up, with field validation and a completion state.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import PasswordStrength from "@/components/ryan-ui/password-strength/password-strength";
import { Caption, Stack } from "./_kit";

export default function PasswordStrengthDemo() {
  const [label, setLabel] = useState("Too short");
  return (
    <Stack gap={3} width={380}>
      <PasswordStrength label="New password" defaultValue="sunrise" autoComplete="new-password" onValueChange={(_, s) => setLabel(s.label)} />
      <Caption>Strength: {label}. Try adding capitals, numbers and symbols.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `PasswordStrength`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `value` | `string` | — | — |
| `defaultValue` | `string` | `""` | — |
| `onValueChange` | `(value: string, strength: PasswordStrengthResult) => void` | — | — |
| `rules` | `PasswordRule[]` | `defaultPasswordRules` | Rules to check. Strength is the share of rules met, spread over four steps. |
| `error` | `string` | — | Error copy tied to the field. The field shakes once each time a new error appears. |
| `revealed` | `boolean` | — | — |
| `onRevealedChange` | `(revealed: boolean) => void` | — | — |
| `messages` | `Partial<Omit<PasswordStrengthMessages, "levels">> & { levels?: Partial<PasswordStrengthLevels> }` | — | Translated or reworded copy. Every string has an English default; see PasswordStrengthMessages. |
| `shortLength` | `number` | — | Below this many characters the meter holds at its first step and reads "Too short". Defaults to 8. |
| `countCharacters` | `(password: string) => number` | — | How characters are counted for shortLength. Defaults to code points, so an emoji counts once; pass `password => password.length` to count UTF-16 units like a server might. |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | — | Also accepts the props of this type, except `type`, `value`, `defaultValue` and `children`. |

### Exported types

| Type | Definition |
| --- | --- |
| `PasswordStrengthMessagesInput`: Partial messages, with partial strength words, for the `messages` prop. | `Partial<Omit<PasswordStrengthMessages, "levels">> & { levels?: Partial<PasswordStrengthLevels> }` |

#### `PasswordRule`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `test` (required) | `(password: string) => boolean` | — |
| `remaining` | `(password: string) => number` | Characters still missing. Shown as a rolling count beside the rule while it is unmet. |

#### `PasswordStrengthResult`

| Field | Type | Description |
| --- | --- | --- |
| `level` (required) | `0 \| 1 \| 2 \| 3 \| 4` | — |
| `label` (required) | `string` | — |
| `met` (required) | `string[]` | — |
| `short` | `boolean` | True while the password is shorter than the short length, so the meter holds at its first step. |

#### `PasswordStrengthLevels`

The strength words, one per meter step. Override them to translate the meter.

| Field | Type | Description |
| --- | --- | --- |
| `tooShort` (required) | `string` | — |
| `weak` (required) | `string` | — |
| `fair` (required) | `string` | — |
| `good` (required) | `string` | — |
| `strong` (required) | `string` | — |

#### `PasswordStrengthMessages`

Every user-facing string in PasswordStrength. All have English defaults; pass only the ones you change.

| Field | Type | Description |
| --- | --- | --- |
| `levels` (required) | `PasswordStrengthLevels` | — |
| `showPassword` (required) | `string` | Name of the show password toggle. It is a pressed toggle (aria-pressed), so the name stays the same in both states. |
| `meterLabel` (required) | `string` | Accessible name of the strength meter. |
| `noPassword` (required) | `string` | Meter value text while the field is empty. |
| `rulesLabel` (required) | `string` | Accessible name of the requirements list. |
| `ruleMet` (required) | `string` | Read after a rule's label for screen readers, including any leading punctuation. |
| `ruleNotMet` (required) | `string` | — |
| `remainingPrefix` (required) | `string` | Words around the rolling count beside an unmet rule, as in "4 more". |
| `remainingSuffix` (required) | `string` | — |
| `summary` (required) | `(result: { label: string; met: number; total: number }) => string` | The polite live-region summary read after each change. |

#### `PasswordRuleLabels`

Labels for the built-in rules. `length` receives the minimum length.

| Field | Type | Description |
| --- | --- | --- |
| `length` (required) | `(minLength: number) => string` | — |
| `case` (required) | `string` | — |
| `number` (required) | `string` | — |
| `symbol` (required) | `string` | — |

#### `PasswordRuleOptions`

| Field | Type | Description |
| --- | --- | --- |
| `minLength` | `number` | Characters the length rule asks for. Defaults to 12. |
| `labels` | `Partial<PasswordRuleLabels>` | Translated or reworded rule labels. |
| `countCharacters` | `(password: string) => number` | How the length rule counts characters. Defaults to code points. |

#### `EstimateStrengthOptions`

| Field | Type | Description |
| --- | --- | --- |
| `shortLength` | `number` | Below this many characters a password stays at the first step, however varied it is. Defaults to 8. |
| `levels` | `Partial<PasswordStrengthLevels>` | Strength words for the result's label. |
| `countCharacters` | `(password: string) => number` | How characters are counted for shortLength. Defaults to code points. |

### Other exports

- `defaultPasswordStrengthMessages` (value)
- `countCodePoints` (function)
- `createPasswordRules` (function)
- `defaultPasswordRules` (value)
- `estimateStrength` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the eye button, which comes right after the field in tab order, show or hide the password. |

## Accessibility

- The meter has `role="meter"` with `aria-valuenow` from 0 to 4 and `aria-valuetext` with the strength word, and each rule carries a visually hidden “, met” or “, not met” for screen readers.
- A `role="status"` region reads a summary after each change (“Strength: Good. 3 of 4 requirements met.”), and the field points to the rule list and the error with `aria-describedby`.
- The eye button has a fixed name and reports its state with `aria-pressed`; all texts come in English, so translate them with `messages`, including `levels` and `summary`.

## Motion

- The four segments enter from the left on a no-overshoot spring, in a wave: a pasted password fills left to right and, when cleared, they empty in the opposite direction.
- The strength word moves up when it improves and down when it worsens, each rule met draws a checkmark, the remaining count rolls its digits, and a new error shakes the field once.
- With “reduce motion” on, the changes become short or instant fades and the field does not shake.

## Responsive behavior

- On touch screens (`pointer: coarse`) the field text goes up to 16px, so the phone keyboard does not zoom in on focus.

## Notes for AI

- The default rules require 12 characters, uppercase and lowercase letters, a number, and a symbol; change them with `createPasswordRules({ minLength, labels })` or pass your own `rules` with `test` and, for the count, `remaining`.
- Below `shortLength` (8) the meter stays on the first step, with “Too short”, even if the other rules pass; the tests run on every keystroke, so keep `test` cheap.
- `onValueChange(valor, força)` brings `level` from 0 to 4 and the ids of the rules met, but scoring runs on the device and only guides the person typing, so also validate the policy on the server.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/password-strength · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
