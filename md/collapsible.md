# Collapsible

> Uma região que abre e fecha no lugar, com altura em mola, conteúdo que entra em foco e seta que gira.

- Type: component (category Disclosure), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/collapsible
- Original description: One region that opens in place: the height follows on a spring, the content fades in from a small blur and the chevron turns; controlled or uncontrolled.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/collapsible.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/collapsible.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/collapsible.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/collapsible.json`. Registry path, relative to the site address: `r/collapsible.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/collapsible/collapsible.tsx`
  - `components/ryan-ui/collapsible/collapsible.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/collapsible.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Advanced settings beside a title, such as build options, with a summary in `hint` that changes with the state.
- “Show more” below a short list, with the `plain` variant and the trigger placed after the content.
- Forms with an optional block: the content stays mounted when closed, so the fields keep their value.

## When not to use

- Use [`accordion`](accordion.md) for a set of related sections where only one is open at a time.
- Use [`expandable-text`](expandable-text.md) for a long paragraph clipped to a few lines.
- Use [`popover`](popover.md) when the detail should float over the page instead of pushing the content below.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ryan-ui/collapsible/collapsible";
import Switch from "@/components/ryan-ui/switch/switch";
import { Caption, Stack } from "./_kit";
import styles from "./collapsible.module.css";

const settings = [
  { name: "Framework", value: "Vite 8" },
  { name: "Node version", value: "22.x" },
  { name: "Build command", value: "pnpm build" },
  { name: "Output folder", value: "dist" },
];

const earlier = ["Fix avatar upload on slow networks", "Raise the export limit to 50,000 rows", "Remember the last used workspace"];

export default function CollapsibleDemo() {
  const [open, setOpen] = useState(true);
  const [cache, setCache] = useState(true);
  const [more, setMore] = useState(false);

  return (
    <Stack gap={5} width={440}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger icon={<SlidersHorizontal size={16} />} hint={open ? "Applies to every new deployment" : "Vite 8, Node 22, cache " + (cache ? "on" : "off")}>Build settings</CollapsibleTrigger>
        <CollapsibleContent>
          <dl className={styles.settings}>
            {settings.map(row => <div key={row.name} className={styles.row}><dt>{row.name}</dt><dd>{row.value}</dd></div>)}
          </dl>
          <Switch label="Reuse the dependency cache" checked={cache} onCheckedChange={setCache} />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible variant="plain" open={more} onOpenChange={setMore}>
        <div className={styles.release}>
          <span className={styles.version}>v4.2</span>
          <span>Add scheduled exports for reports</span>
        </div>
        <CollapsibleContent className={styles.more}>
          <ul className={styles.changes}>{earlier.map(change => <li key={change}>{change}</li>)}</ul>
        </CollapsibleContent>
        <CollapsibleTrigger>{more ? "Hide earlier changes" : "Show 3 more changes"}</CollapsibleTrigger>
      </Collapsible>
      <Caption>Both are controlled: the hint and the label follow the open state.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Collapsible`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Whether the region is open. Pass it together with `onOpenChange` to control the state yourself. |
| `defaultOpen` | `boolean` | `false` | Initial state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called with the next state whenever the trigger is used. |
| `disabled` | `boolean` | `false` | Keeps the current state and ignores the trigger. |
| `variant` | `"card" \| "plain"` | `"card"` | "card" draws one bordered surface around the trigger and the content; "plain" leaves both bare for your own layout. |
| `className` | `string` | — | Extra class for the root element. |
| `children` (required) | `ReactNode` | — | A `CollapsibleTrigger`, a `CollapsibleContent`, and anything that should stay visible between them. |

### `CollapsibleTrigger`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hint` | `ReactNode` | — | Short supporting text shown under the label, such as a summary of what is inside. |
| `icon` | `ReactNode` | — | Leading icon or avatar. |
| `hideChevron` | `boolean` | `false` | Removes the chevron, for triggers that carry their own affordance. |
| `className` | `string` | — | Extra class for the button. |
| `children` (required) | `ReactNode` | — | The label. |
| `...props` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | Also accepts the props of this type, except `type`. |

### `CollapsibleContent`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | — | Extra class for the padded inner element that holds the content. |
| `children` (required) | `ReactNode` | — | The content that opens and closes. It stays mounted, so fields inside keep their values. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the trigger, opens or closes the region. |

## Accessibility

- The trigger is a `<button>` with `aria-expanded` and `aria-controls`; the content is a `region` named by the trigger.
- After closing, the region gets `visibility: hidden` and leaves the Tab order and the accessibility tree, although it stays mounted.
- With `disabled` on the `Collapsible`, the trigger is disabled and the current state is kept; icon and arrow are hidden from the screen reader.

## Motion

- The height follows the content on a no-overshoot spring, and the content rises 8 px out of a 4 px blur as it appears.
- The arrow rotates 180° on a short spring; a new click mid-animation reverses the motion from where it is.
- With “reduce motion” on, the region opens and closes instantly and the color and border transitions are turned off.

## Performance

- The content stays mounted even when closed, so it is rendered from the start; on a page with many `Collapsible`s with heavy content, all of that content exists at the same time.

## Notes for AI

- Assemble the three parts: `Collapsible` on the outside, `CollapsibleTrigger` and `CollapsibleContent` inside; outside a `Collapsible`, the parts throw an error.
- To control it, pass `open` with `onOpenChange`; an `onClick` on the trigger that calls `preventDefault()` cancels the toggle.
- `variant="card"` (default) draws a bordered surface; `plain` leaves trigger and content without a frame. Import from `@/components/ryan-ui/collapsible/collapsible`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/collapsible · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
