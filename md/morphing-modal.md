# Morphing modal

> O botão se transforma no modal a partir do próprio lugar e volta a ser botão ao fechar.

- Type: component (category Disclosure), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/morphing-modal
- Original description: A trigger button that morphs into the modal panel from its own position, size and color, and back on close, with a focus trap, Escape and a scrim.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morphing-modal.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morphing-modal.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morphing-modal.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morphing-modal.json`. Registry path, relative to the site address: `r/morphing-modal.json`.

- npm packages: `@radix-ui/react-dialog`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/morphing-modal/morphing-modal.tsx`
  - `components/ryan-ui/morphing-modal/morphing-modal.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-dialog lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/morphing-modal.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A create button, such as “New project”, that opens a short form coming out of the button itself.
- Sharing or inviting from a toolbar button, with the list of people in the modal body.
- Primary actions where the origin of the modal must be clear: the panel is born from the position, size, and color of the button.

## When not to use

- Use [`dialog`](dialog.md) when the modal is opened by code, by a menu item, or by more than one trigger; here the trigger is always the component's own button.
- Use [`center-morph-modal`](center-morph-modal.md) when the modals originate from cards in a grid.
- Use [`popover`](popover.md) for small content that does not need to block the page.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { MorphingModal } from "@/components/ryan-ui/morphing-modal/morphing-modal";
import { Button } from "@/components/ryan-ui/button/button";
import { Input } from "@/components/ryan-ui/input/input";
import Switch from "@/components/ryan-ui/switch/switch";
import { Avatar } from "@/components/ryan-ui/avatar/avatar";
import { avatar } from "@/components/ryan-ui/lib/media";
import { Caption, Row, Stack, demoStage } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./morphing-modal.module.css";

const members = [
  { id: "jasmine-brooks", name: "Jasmine Brooks", role: "Owner" },
  { id: "daniel-kim", name: "Daniel Kim", role: "Can edit" },
  { id: "hannah-walsh", name: "Hannah Walsh", role: "Can view" },
] as const;

export const stage: DemoStage = { height: 520 };

export default function MorphingModalDemo() {
  // On the docs page each modal grows inside the preview, so it opens whole and the page around it keeps scrolling.
  const [container] = useState(demoStage);
  const [name, setName] = useState("");
  const [isPrivate, setPrivate] = useState(true);
  const [created, setCreated] = useState<string | null>(null);

  return (
    <Stack gap={5} align="center">
      <Row justify="center" gap={4}>
        <MorphingModal
          container={container}
          trigger={<><Plus size={16} aria-hidden="true" />New project</>}
          title="New project"
          description="Projects keep tasks, files and people in one place."
          footer={({ close }) => (
            <>
              <Button variant="ghost" onClick={close}>Cancel</Button>
              <Button onClick={() => { setCreated(name.trim() || "Untitled project"); setName(""); close(); }}>Create project</Button>
            </>
          )}
        >
          <Stack gap={4}>
            <Input label="Project name" placeholder="Spring campaign" value={name} onChange={event => setName(event.target.value)} />
            <Switch label="Private: only invited people can see it" checked={isPrivate} onCheckedChange={setPrivate} />
          </Stack>
        </MorphingModal>

        <MorphingModal container={container} variant="neutral" width={380} trigger={<><UserPlus size={16} aria-hidden="true" />Share</>} title="Share “Q3 roadmap”" description="3 people have access.">
          <ul className={styles.members}>
            {members.map(member => (
              <li key={member.id} className={styles.member}>
                <Avatar name={member.name} src={avatar(member.id)} size="sm" />
                <span className={styles.memberName}>{member.name}</span>
                <span className={styles.memberRole}>{member.role}</span>
              </li>
            ))}
          </ul>
        </MorphingModal>
      </Row>
      <Caption>{created ? `Created “${created}”. ` : ""}Each button grows into its own modal and takes it back on close.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `MorphingModal`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` (required) | `ReactNode` | — | Content of the trigger button: a label, optionally with an icon. |
| `title` (required) | `string` | — | Title of the modal, also its accessible name. |
| `description` | `string` | — | Supporting line under the title. |
| `children` (required) | `Slot` | — | The body. Pass a function to receive `close`. |
| `footer` | `Slot` | — | Actions pinned under the body. Pass a function to receive `close`. |
| `open` | `boolean` | — | Whether the modal is open (controlled). |
| `defaultOpen` | `boolean` | `false` | Initial state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called with the next state when the trigger, Escape, the scrim or the close button is used. |
| `variant` | `"accent" \| "neutral"` | `"accent"` | Look of the trigger. The panel starts in the same color and settles into the surface color. |
| `width` | `number` | `420` | Maximum width of the panel in px. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `className` | `string` | — | Extra class for the panel. |
| `triggerClassName` | `string` | — | Extra class for the trigger button. |
| `container` | `HTMLElement \| null` | — | Renders the modal inside this element instead of the page body: the scrim covers only the element and the panel centers in it. The element needs position: relative and overflow: hidden. The page around it stays usable while the modal is open: nothing is scroll-locked or hidden from assistive technology, and Escape, the scrim and the close button still close it. |

### Exported types

#### `MorphingModalApi`

What the body and the footer receive when they are written as functions.

| Field | Type | Description |
| --- | --- | --- |
| `close` (required) | `() => void` | Closes the modal; it morphs back into the trigger. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the button, opens the modal. |
| `Tab` or `Shift + Tab` | Move through the modal controls without leaving it; on open, focus goes to the first form field or, with no fields, to the close button. |
| `Esc` | Closes the modal, which turns back into the button, and returns focus to it. |

## Accessibility

- The button gets `aria-haspopup="dialog"` and `aria-expanded`; the panel is a Radix modal dialog with `title` as its name and `description` as its description.
- To choose the initial focus, mark the element with `data-autofocus`; the close button is named “Close”, fixed in English in the code.

## Motion

- The panel grows from the button's box on a spring with a slight bounce and returns to it on an exact spring, without oscillating; it starts at the button color and lightens to the surface color.
- Title, body, and footer arrive one after another, rising 10 px out of a slight blur, and leave all at once so they do not follow the shrinking.
- With “reduce motion” on, there is no transformation: the panel only fades on open and close.

## Responsive behavior

- The panel takes the screen width minus 2rem up to `width` (default 420 px), with a maximum height of `100dvh` minus 2rem and inner scrolling.

## Notes for AI

- `trigger` is the button's content (label and icon), not a button: the component draws its own `<button>`; style it with `variant` and `triggerClassName`.
- `children` and `footer` accept a function that receives `{ close }`, useful for closing after saving.
- Control it with `open` and `onOpenChange` when needed; import `MorphingModal` from `@/components/ryan-ui/morphing-modal/morphing-modal`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/morphing-modal · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
