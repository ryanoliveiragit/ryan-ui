# Avatar group

> Grupo de avatares sobrepostos que resume uma equipe e mostra quantos membros a mais existem.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/avatar-group
- Original description: Show a team or set of contributors in a small space.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/avatar-group.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/avatar-group.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/avatar-group.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/avatar-group.json`. Registry path, relative to the site address: `r/avatar-group.json`.

- npm packages: `motion`
- Uses other ryan-ui items (installed along with it): [Avatar](avatar.md)
- Files, once installed:
  - `components/ryan-ui/avatar-group/avatar-group.tsx`
  - `components/ryan-ui/avatar-group/avatar-group.module.css`
  - `components/ryan-ui/avatar/avatar.tsx`
  - `components/ryan-ui/avatar/avatar.module.css`
  - `components/ryan-ui/lib/ryan-provider.tsx`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/avatar-group.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Show who takes part in a project, document, or team in little space: header, card, or table cell.
- Lists that change live: whoever joins or leaves opens or closes their own space and the rest of the stack slides.
- Groups larger than the space: `max` limits the visible avatars and the remainder becomes a `+N` counter.

## When not to use

- Use [`avatar`](avatar.md) for a single person.
- When each person needs to be clickable or the full list must be in view, use a list with names: here nothing receives focus and anyone beyond `max` is not shown.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { AvatarGroup } from "@/components/ryan-ui/avatar-group/avatar-group";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack } from "./_kit";
import { people } from "@/components/ryan-ui/lib/media";

export default function AvatarGroupDemo() {
  const [count, setCount] = useState(6);
  const members = people.slice(0, count).map((p, i) => ({ name: p.name, src: p.src, status: i % 3 === 0 ? ("online" as const) : undefined }));
  return (
    <Stack gap={6} align="center">
      <AvatarGroup members={members} max={4} size="lg" label="Design team" />
      <Row>
        <Button size="sm" variant="secondary" onClick={() => setCount(c => Math.min(people.length, c + 1))}>Add a member</Button>
        <Button size="sm" variant="ghost" onClick={() => setCount(c => Math.max(1, c - 1))}>Remove one</Button>
      </Row>
      <AvatarGroup members={people.slice(0, 3).map(p => ({ name: p.name, src: p.src }))} size="sm" />
      <Caption>{count} people on the project.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AvatarGroup`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `members` (required) | `AvatarGroupMember[]` | — | — |
| `max` | `number` | `4` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | — |
| `label` | `string` | `"Team members"` | — |

### Exported types

#### `AvatarGroupMember`

| Field | Type | Description |
| --- | --- | --- |
| `name` (required) | `string` | — |
| `src` | `string` | — |
| `status` | `"online" \| "offline"` | — |

## Accessibility

- The container is a `role="group"` named by `label` (the default is English, “Team members”); each avatar announces the name, and the counter announces “N more” followed by the label.
- The name bubble is visual only: it appears on mouse hover and is `aria-hidden`; on touch it does not appear, and the names beyond `max` are not available anywhere.

## Motion

- A new member opens its own width with a no-overshoot spring and the others slide; whoever leaves closes the space the same way.
- The `+N` counter rolls in the direction of the change: the new number rises when there are more people and drops when there are fewer.
- With “reduce motion”, entries, exits, and the counter swap immediately and the name bubble appears without rising.

## Notes for AI

- `members` is a list of `{ name, src?, status? }` and `name` serves as the `key`: two members with the same name cause a React warning and break the animation.
- To see animated entry and exit, change the `members` list while the component is mounted; `max` (default 4) decides how many appear before the `+N`.
- It depends on `avatar` and only accepts `size` `sm`, `md`, or `lg`; pass `label` in your language, because the default is English.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/avatar-group · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
