# Empty states

> Quatro estados vazios numa única ilustração, cujas formas se transformam ao trocar de aba.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/empty-states
- Original description: Four empty states in one illustration whose shapes morph between scenes as you switch tabs.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/empty-states.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/empty-states.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/empty-states.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/empty-states.json`. Registry path, relative to the site address: `r/empty-states.json`.

- npm packages: `motion`
- Uses other ryan-ui items (installed along with it): [Button](button.md)
- Files, once installed:
  - `components/ryan-ui/blocks/empty-states/empty-states.tsx`
  - `components/ryan-ui/blocks/empty-states/empty-states.module.css`
  - `components/ryan-ui/blocks/empty-states/empty-states-art.ts`
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/empty-states.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A showcase or demo page of illustrated empty states (no results, offline, inbox zero, page not found), where switching tabs transforms the illustration.
- A starting point for your own empty states with shapes that morph, adapting texts, actions, and scenes in the code.

## When not to use

- Use [`empty-state`](empty-state.md) for a real empty state inside a screen, with title, text, and action through props.
- Use [`not-found`](not-found.md) for a complete 404 page, with search and links back.
- Avoid when texts and actions must come from props: the block takes none, and the actions only simulate the result on the screen itself.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import EmptyStates from "@/components/ryan-ui/blocks/empty-states/empty-states";

export default function EmptyStatesDemo() {
  // The card is a panel inside a page: give it a page margin and center it in the frame instead of gluing it to the top edge.
  return (
    <div style={{ display: "grid", minHeight: "100dvh", alignContent: "center", justifyItems: "center", padding: "var(--space-6)" }}>
      <div style={{ width: "min(100%, 40rem)" }}><EmptyStates /></div>
    </div>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `EmptyStates`

No props of its own: accepts those of the element or primitive it wraps.

### `FRAMES`

Every frame is computed once at load, so the server and the first client render draw the same thing.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `SceneId`: Geometry for the empty states illustration. Every scene is drawn from the same ten primitives, in the same paint order: two back tiles, one morphing body, four front tiles, two line accents and one two-stroke mark. A scene only moves them. Tiles are rounded rectangles described by center, size, radius, rotation and skew, so a circle can become a panel. The body, lines and mark are equal-count point lists, sampled clockwise from the top left, so any outline can become any other. | `"search" \| "offline" \| "inbox" \| "map"` |
| `Phase` | `"idle" \| "loading" \| "done"` |
| `Kind` | `"tile" \| "body" \| "stroke" \| "mark"` |

#### `Prim`

`geo` springs as one vector; `fx` holds opacity and how much of a stroke is drawn.

| Field | Type | Description |
| --- | --- | --- |
| `kind` (required) | `"tile" \| "body" \| "stroke" \| "mark"` | — |
| `geo` (required) | `number[]` | — |
| `fx` (required) | `[number, number]` | — |
| `tone` (required) | `string` | — |
| `redraw` (required) | `boolean` | — |

#### `Frame`

| Field | Type | Description |
| --- | --- | --- |
| `prims` (required) | `Prim[]` | — |
| `label` (required) | `string` | — |

### Other exports

- `KINDS` (value)
- `VIEW` (value)
- `shapePath` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | Select the previous or next tab, wrapping around, and move focus along with it. |
| `Home` or `End` | Select the first or last tab. |
| `Enter` or `Space` | On the button, run the scene's action: clear filters, try again, check the email, or find the page. |

## Accessibility

- The scenes follow the tabs pattern (`tablist`, `tab` with `aria-selected`, `tabpanel`) with roving focus, and the illustration is a `role="img"` with its own description for each scene.
- The result of each action is announced in a hidden `aria-live="polite"` region, and the button stays in a loading state while the simulated action waits.

## Motion

- When switching tabs, each of the illustration's ten shapes travels to a new position, size, radius, and color on its own spring, and the lines redraw a moment later.
- With a mouse, the illustration layers shift slightly following the pointer; title and text swap rising from a slight blur, and the text height follows with a spring.
- With “reduce motion” on, the illustration switches by crossfade, with no shape travel, the parallax is turned off, and the texts only fade.

## Responsive behavior

- The illustration has a fixed aspect ratio and a maximum width of 360px, so switching scenes does not change the layout; in containers up to 420px the tabs get smaller and scroll if space runs out.

## Performance

- A single `requestAnimationFrame` loop moves all shapes by writing directly to the SVG attributes, without rendering React on every frame, and sleeps when everything settles.

## Notes for AI

- The block has no props: texts and actions are in `COPY`, inside the component, and the scenes in `empty-states-art.ts`; for a configurable empty state, use `empty-state`.
- The actions are local and simulated (clear filters, reconnect, check the email, find the page); to connect them to real data, replace the `act()` function in the installed file.
- Depends on `button`, installed along with it; the card takes the parent's width, and the content is limited to 480px in the center.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/empty-states · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
