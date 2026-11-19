# Shortcut recorder

> Grave atalhos de teclado em teclas visuais, com aviso de conflito e uma lista de atalhos pesquisável.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/shortcut-recorder
- Original description: Record key combinations into key caps, with conflict warnings, Kbd, and a searchable cheatsheet.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/shortcut-recorder.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/shortcut-recorder.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/shortcut-recorder.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/shortcut-recorder.json`. Registry path, relative to the site address: `r/shortcut-recorder.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/shortcut-recorder/shortcut-recorder.tsx`
  - `components/ryan-ui/shortcut-recorder/shortcut-recorder.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/shortcut-recorder.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Preferences screens where people redefine the product's keyboard shortcuts.
- Apps with many shortcuts that need a searchable reference sheet, via `ShortcutList`.
- Showing shortcuts in menus and texts with drawn keys, via `ShortcutKeys` and `ShortcutKbd`.

## When not to use

- Use [`command-palette`](command-palette.md) when the goal is to run actions from the keyboard, not to configure them.
- To only display a fixed shortcut, use `ShortcutKeys` from this same file, without the recorder.
- In apps used almost only by touch, keyboard shortcuts get little use and the settings screen can be left out.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import ShortcutRecorder, { ShortcutList } from "@/components/ryan-ui/shortcut-recorder/shortcut-recorder";
import { Caption, Stack } from "./_kit";

export default function ShortcutRecorderDemo() {
  const [value, setValue] = useState<string | null>("Mod+K");
  return (
    <Stack width={480} gap={6}>
      <Stack gap={2}>
        <ShortcutRecorder
          label="Open command palette"
          description="Press the field, then the new combination."
          value={value}
          onValueChange={(v) => setValue(v)}
          resetValue="Mod+K"
          bindings={[{ shortcut: "Mod+P", label: "Quick open" }, { shortcut: "Mod+Shift+F", label: "Search in files" }]}
        />
        <Caption>Stored as: {value ?? "unset"}. Try Mod+P to see a conflict warning.</Caption>
      </Stack>
      <ShortcutList
        groups={[
          { label: "Navigation", items: [{ label: "Command palette", shortcut: "Mod+K" }, { label: "Quick open", shortcut: "Mod+P" }, { label: "Go to line", shortcut: "Ctrl+G" }] },
          { label: "Editing", items: [{ label: "Duplicate line", shortcut: "Mod+Shift+D" }, { label: "Toggle comment", shortcut: "Mod+/" }] },
        ]}
      />
    </Stack>
  );
}
export const stage = { height: 560 };
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ShortcutKbd`

A key cap. Use it inline in copy, in menus, or through `ShortcutKeys` for a whole combination.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` | — | — |
| `pressed` | `boolean` | `false` | Draws the key pushed down and lit, such as while it is held. |
| `size` | `"sm" \| "md"` | `"md"` | — |
| `...props` | `HTMLAttributes<HTMLElement>` | — | Also accepts the props of this type. |

### `ShortcutKeys`

A shortcut as key caps, with a spoken label for assistive technology.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `shortcut` (required) | `string` | — | — |
| `platform` | `"mac" \| "other"` | — | — |
| `pressed` | `ReadonlySet<string>` | — | Held key ids from `usePressedKeys`; matching caps light up. |
| `size` | `"sm" \| "md"` | `"md"` | — |
| `className` | `string` | — | — |

### `ShortcutRecorder`

A field that records a keyboard shortcut. Press it, then press the combination: held modifiers light up as caps while you build the chord, the finished shortcut settles into place, and a combination that is already taken asks before it is used. Escape cancels, Backspace clears, and the reset button restores the default. Caps follow the platform: ⌘ on a Mac, Ctrl elsewhere.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `hideLabel` | `boolean` | `false` | — |
| `value` | `string \| null` | — | — |
| `defaultValue` | `string \| null` | `null` | — |
| `onValueChange` | `(value: string \| null, details: { replaced?: ShortcutBinding }) => void` | — | `replaced` is the binding the new shortcut was taken from after "Use anyway", so the caller can unbind it. |
| `resetValue` | `string \| null` | — | What the reset button restores. Defaults to `defaultValue`. |
| `bindings` | `ShortcutBinding[]` | `[]` | Shortcuts already in use. Recording one of them asks before taking it. |
| `warnReserved` | `boolean` | `true` | Also warn about combinations the browser or system keeps, such as ⌘W and ⌘C. On by default. |
| `requireModifier` | `boolean` | `true` | Require ⌘, Ctrl, or ⌥ (function keys are always allowed). On by default. |
| `platform` | `"mac" \| "other"` | — | — |
| `placeholder` | `string` | `"Record shortcut"` | — |
| `description` | `string` | — | — |
| `disabled` | `boolean` | `false` | — |
| `id` | `string` | — | — |
| `className` | `string` | — | — |

### `ShortcutList`

A searchable, grouped cheatsheet. Holding a modifier lights that cap in every row and fades rows that do not use it, so people can explore by holding keys; a row whose whole combination is down lights up. Search matches names, groups, and key names such as "cmd k".

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `groups` (required) | `ShortcutListGroup[]` | — | — |
| `label` | `string` | `"Keyboard shortcuts"` | Accessible name of the list. |
| `searchable` | `boolean` | `true` | — |
| `searchPlaceholder` | `string` | `"Search shortcuts"` | — |
| `highlightPressed` | `boolean` | `true` | Light up caps as keys are held, and fade rows that do not use the held modifiers. On by default. |
| `platform` | `"mac" \| "other"` | — | — |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `Platform` | `"mac" \| "other"` |
| `KbdProps`: @deprecated Renamed to `ShortcutKbdProps`. | `ShortcutKbdProps` |

#### `ShortcutToken`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `id` (required) | `string` | — |
| `spoken` (required) | `string` | — |

#### `ShortcutBinding`

| Field | Type | Description |
| --- | --- | --- |
| `shortcut` (required) | `string` | — |
| `label` (required) | `string` | — |

#### `ShortcutListItem`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `shortcut` (required) | `string` | — |
| `keywords` | `string` | — |

#### `ShortcutListGroup`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `items` (required) | `ShortcutListItem[]` | — |

### Other exports

- `keyId` (function)
- `normalizeShortcut` (function)
- `shortcutFromEvent` (function)
- `matchesShortcut` (function)
- `shortcutTokens` (function)
- `formatShortcut` (function)
- `usePlatform` (hook)
- `usePressedKeys` (hook)
- `Kbd` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the field, start recording; the next combination with a modifier becomes the shortcut. |
| `Esc` | Cancels recording and keeps the previous shortcut. |
| `Backspace` or `Delete` | Clear the shortcut, during recording or outside it. |
| `Tab` | During recording, stops recording and moves on to the next control. |
| `Ctrl` or `Alt` or `Shift` or `⌘` | Held with the `ShortcutList` on screen, light up that key in every row and fade the rows that do not use it. |
| `Esc` | In the `ShortcutList` search, clears the typed text. |

## Accessibility

- The field is a button with `aria-pressed` during recording, named by the label plus the spoken shortcut (“Control Shift L”) and described by the message below.
- A `role="status"` region narrates each step: recording start, shortcut set, conflict, clearing, and cancellation; the texts are in English and fixed.
- `ShortcutKeys` has `role="img"` with the spoken name of the combination, and the restore and clear buttons have their own `aria-label`.

## Motion

- The keys enter one after another with a short spring and sink one pixel when held, and a dot pulses slowly while recording.
- The message line opens its height on a spring measuring the text, and the restore and clear buttons grow in place.
- With “reduce motion” on, the keys only fade, the dot stays still, and nothing sinks.

## Responsive behavior

- `ShortcutList` uses a container query: from 520px wide, the groups go into two columns.

## Performance

- With `highlightPressed` on (the default), `ShortcutList` listens to `keydown` and `keyup` on the whole window in the capture phase; turn it off if you do not use the lit rows.

## Notes for AI

- Store the value as text (`"mod+shift+k"`), where `mod` is ⌘ on Mac and Ctrl elsewhere; to trigger the action, use `matchesShortcut(evento, atalho, plataforma)` with `usePlatform()`.
- Pass the shortcuts already in use in `bindings` to warn about conflicts; on “Use anyway”, `onValueChange` brings `details.replaced` so you can turn off the old shortcut.
- `requireModifier` (default) requires ⌘, Ctrl, or ⌥, except on F keys, and `warnReserved` warns about browser shortcuts such as ⌘W and ⌘C.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/shortcut-recorder · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
