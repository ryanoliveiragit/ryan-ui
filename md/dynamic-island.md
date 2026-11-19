# Dynamic island

> Pílula no topo da tela que se transforma com mola entre repouso, atividade compacta e visões expandidas de chamada, timer e música.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/dynamic-island
- Original description: A pill at the top of the screen that morphs on one spring between a resting dot, a compact live activity and expanded call, timer and music views.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dynamic-island.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dynamic-island.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dynamic-island.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dynamic-island.json`. Registry path, relative to the site address: `r/dynamic-island.json`.

- npm packages: `motion`, `lucide-react`
- Uses other ryan-ui items (installed along with it): [Segmented control](segmented-control.md)
- Files, once installed:
  - `components/ryan-ui/blocks/dynamic-island/dynamic-island.tsx`
  - `components/ryan-ui/blocks/dynamic-island/dynamic-island.module.css`
  - `components/ryan-ui/lib/media.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/dynamic-island.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Showing an ongoing activity at the top of a mobile interface, or of an app that imitates a phone: call, timer, or music, compact and expandable.
- Demos and prototypes where the pill's shape change between states is the highlight.

## When not to use

- Use [`toast`](toast.md) or [`toast-progress`](toast-progress.md) to report the progress or result of a task without taking up a fixed place on the screen.
- Use [`announcement-bar`](announcement-bar.md) for a full-width message at the top of the page.
- Avoid for other activities: the call, timer, and music views are hardcoded, and the time, the track, and the mute state live inside the component.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import DynamicIslandPreview from "@/components/ryan-ui/blocks/dynamic-island/dynamic-island";

export default function DynamicIslandDemo() {
  return <DynamicIslandPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `DynamicIsland`

A pill that grows from a resting dot into a compact live activity and on into a full view (call, timer or music), with one spring for every change of shape.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `activity` | `"idle" \| "call" \| "timer" \| "music"` | — | What the island is showing. Pass it with `onActivityChange` to control it. |
| `defaultActivity` | `"idle" \| "call" \| "timer" \| "music"` | `"idle"` | Activity at the start when uncontrolled. |
| `onActivityChange` | `(activity: IslandActivity) => void` | — | Called when the island changes activity by itself: a call is declined or ended, or a timer is cancelled. |
| `expanded` | `boolean` | — | Whether the island shows the large view of its activity. Pass it with `onExpandedChange` to control it. |
| `defaultExpanded` | `boolean` | `false` | Whether the island starts expanded when uncontrolled. |
| `onExpandedChange` | `(expanded: boolean) => void` | — | Called when a tap, Escape or a click outside expands or collapses the island. |
| `caller` | `IslandCaller` | `sampleCaller` | Who is calling in the call activity. |
| `tracks` | `IslandTrack[]` | `sampleTracks` | Queue for the music activity. |
| `timerSeconds` | `number` | `300` | Length of the timer activity in seconds. |
| `className` | `string` | — | Extra class for the pill. |

### `DynamicIslandPreview`

Ready preview: the island at the top of a phone screen, with a switch for the activity it shows.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `IslandActivity` | `"idle" \| "call" \| "timer" \| "music"` |

#### `IslandCaller`

| Field | Type | Description |
| --- | --- | --- |
| `name` (required) | `string` | Caller's name. |
| `avatar` (required) | `string` | Avatar image. |

#### `IslandTrack`

| Field | Type | Description |
| --- | --- | --- |
| `title` (required) | `string` | Track title. |
| `artist` (required) | `string` | Who plays it. |
| `cover` (required) | `string` | Cover image. |
| `duration` (required) | `number` | Length in seconds. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the compact pill, expand the activity; on the round buttons, accept, decline, mute, pause, restart, or switch tracks. |
| `Esc` | With the island expanded, collapses it and, if focus was inside it, returns focus to the compact pill. |

## Accessibility

- The island is a `role="group"` called “Live activity”; when compact, it is a button whose name describes the activity, such as “Jasmine Brooks is calling. Expand” or “Timer, 4:12 left. Expand”.
- The icon-only buttons have names (“Accept”, “Decline”, “Mute” with `aria-pressed`), the timer uses `role="timer"`, and the music has a `progressbar` with text such as “0:48 of 3:34”.
- There is no collapse button in the expanded view: Esc and clicking outside the island are the only ways back to the compact form.

## Motion

- The pill changes width, height, and radius on a single spring with a slight bounce, and each view's content enters from a blur and a slightly smaller scale, already at its final size.
- The sound bars pulse at different rhythms while there is audio, the phone in the compact form wobbles while the call rings, and the progress bars advance at a steady pace every second.
- With “reduce motion” on, the pill changes size instantly, the content only fades, the sound bars stay still at fixed heights, and the phone does not wobble.

## Responsive behavior

- The expanded pill has a fixed width of 344px, capped at `100vw - 1.5rem`; the content is drawn at that size and does not reflow, so on narrower screens the edges are clipped.

## Performance

- Outside the idle state, a single 1-second interval updates the call, timer, or music, even in the compact form; the sound bars and the ring are CSS animations.

## Notes for AI

- Import `DynamicIsland` by name (the default export is the preview with a phone and selector); the component does not position itself, so center it at the top from the parent.
- Control `activity` and `expanded` with `onActivityChange` and `onExpandedChange`: declining or ending the call and canceling the timer return the island to `"idle"` on their own.
- `caller`, `tracks`, and `timerSeconds` replace the example data; the island is nearly black in both themes because it uses the fixed neutral scale, not the theme surfaces.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/dynamic-island · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
