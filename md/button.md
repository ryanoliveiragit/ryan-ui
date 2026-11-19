# Button

> Uma ação clara e responsiva, com estados secundários discretos.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/button
- Original description: A clear, responsive action with quiet secondary states.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/button.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/button.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/button.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/button.json`. Registry path, relative to the site address: `r/button.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/button.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Any single action on a page, form, or dialog: save, continue, cancel.
- Actions whose label changes in place, like “Save” becoming “Saved”: the width follows the new text with a spring, with no jump.
- Short async work where a loading indicator on the button itself is enough feedback (`loading` prop).

## When not to use

- Use [`action-button`](action-button.md) when the button needs to show the pending and done states by itself after an async action.
- Use [`split-button`](split-button.md) when the main action has close alternatives in a menu.
- Use [`hold-to-confirm`](hold-to-confirm.md) for destructive actions that need more than a click.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { ArrowRight, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack } from "./_kit";

export default function ButtonDemo() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaving(true);
    window.setTimeout(() => { setSaving(false); setSaved(true); window.setTimeout(() => setSaved(false), 1800); }, 1400);
  };

  return (
    <Stack gap={8} align="center">
      <Row justify="center">
        <Button onClick={save} loading={saving}>{saved ? "Saved" : "Save changes"}</Button>
        <Button variant="secondary"><Download size={16} aria-hidden="true" />Export</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger"><Trash2 size={16} aria-hidden="true" />Delete</Button>
      </Row>
      <Row justify="center">
        <Button size="sm" variant="secondary">Small</Button>
        <Button size="md" variant="secondary">Medium</Button>
        <Button size="lg" variant="secondary">Large<ArrowRight size={16} aria-hidden="true" /></Button>
        <Button variant="secondary" disabled>Disabled</Button>
      </Row>
      <Caption>Press “Save changes” to see the loading state and the label morph.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Button`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "danger"` | `"primary"` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | — |
| `loading` | `boolean` | `false` | — |
| `...props` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | Also accepts the props of this type, except `onDrag`, `onDragEnd`, `onDragStart` and `onAnimationStart`. |

### Exported types

| Type | Definition |
| --- | --- |
| `ButtonVariant` | `"primary" \| "secondary" \| "ghost" \| "danger"` |
| `ButtonSize` | `"sm" \| "md" \| "lg"` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | Trigger the button; with `loading`, the activation is ignored. |
| `Tab` | Moves focus to the next control; the focus ring only appears with the keyboard (`:focus-visible`, a `foundation.css` rule). |

## Accessibility

- It is a native `<button>`: role, focus, and keyboard activation come from the browser.
- During `loading` the button gets `aria-busy` and `aria-disabled`, stays focusable, and keeps the label in the DOM for screen readers.
- On an icon-only button, pass `aria-label` with the action name.

## Motion

- The press slightly reduces the button scale; anchors of menus and popovers do not scale, so the panel measures the right size.
- When the content changes, the width animates with a spring with no overshoot and the label swaps with a short fade.
- With “reduce motion”, the press scale and the width spring are turned off, the label swaps with a 0.12 s fade, and the loading indicator does not spin.

## Responsive behavior

- The label does not wrap (`white-space: nowrap`); on narrow screens prefer short labels or the `sm` size.
- Minimum heights come from the `--control-height-sm`, `-md`, and `-lg` tokens, so they follow the rest of the controls.

## Performance

- Measuring the label width uses one observer per button; it is cheap, but avoid hundreds of them in a long list.

## Notes for AI

- Default choice for a single action; for a row of actions with icons prefer `floating-button-group` or `button-group`, and with close alternatives, `split-button`.
- Pass the changing label (Save → Saved) as the child to get the width animation with no configuration; `loading` blocks `onClick` without disabling the button.
- Variants `primary` (default), `secondary`, `ghost`, and `danger`, sizes `sm`, `md`, and `lg`; the component does not set `type`, so inside a `<form>` pass `type="button"` when the action does not submit.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/button · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
