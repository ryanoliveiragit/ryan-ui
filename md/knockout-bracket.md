# Knockout bracket

> Chave de mata-mata em colunas: escolha o vencedor e ele avança pela linha de conexão até a próxima fase.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/knockout-bracket
- Original description: Single-elimination bracket with rounds in columns and measured connector lines; picking a winner draws its line and slides the team into the next round.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/knockout-bracket.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/knockout-bracket.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/knockout-bracket.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/knockout-bracket.json`. Registry path, relative to the site address: `r/knockout-bracket.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/blocks/knockout-bracket/knockout-bracket.tsx`
  - `components/ryan-ui/blocks/knockout-bracket/knockout-bracket.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/knockout-bracket.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Knockout brackets for tournaments, internal championships, or prediction pools, where the person picks the winner of each match until reaching the champion.
- “Who advances” simulators with 4, 8, or 16 participants, with automatic filling by the best seed and a button to start over.

## When not to use

- Use [`sortable-data-table`](sortable-data-table.md) for a standings table with points and goal difference, such as round-robin or group-stage tables.
- Avoid for double elimination or brackets whose number of participants is not a power of two: the block only builds single elimination and does not handle byes.
- Avoid with 32 or more participants: the rounds share the width, with no horizontal scroll, and the first column gets very tall.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import KnockoutBracket from "@/components/ryan-ui/blocks/knockout-bracket/knockout-bracket";

export default function KnockoutBracketDemo() {
  return <KnockoutBracket defaultValue={{ "0-0": "harbor", "0-1": "lakeside" }} />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `KnockoutBracket`

Single-elimination bracket: pick a winner and it travels along its connector into the next round.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `teams` | `BracketTeam[]` | `sampleTeams` | Teams in bracket order: the first two meet in the first match, and so on. The count must be a power of two. Defaults to eight sample clubs. |
| `value` | `Record<string, string>` | — | Picked winners. Pass it with `onValueChange` to control the bracket. |
| `defaultValue` | `Record<string, string>` | `{}` | Starting picks when uncontrolled. |
| `onValueChange` | `(picks: BracketPicks) => void` | — | Called with all picks after one changes. Picks that no longer follow from earlier rounds are already removed. |
| `title` | `string` | `"Harbor Cup playoffs"` | Heading above the bracket. |
| `className` | `string` | — | Extra class for the section. |

### Exported types

| Type | Definition |
| --- | --- |
| `BracketPicks`: Winner of each decided match: match id (`round-index`, both from zero) to team id. | `Record<string, string>` |

#### `BracketTeam`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique id, used in the picks. |
| `name` (required) | `string` | Full team name. |
| `code` (required) | `string` | Three-letter code, shown instead of the name when the bracket is narrow. |
| `seed` (required) | `number` | Seed number shown before the name. Auto-fill favours the lower seed. |

### Other exports

- `sampleTeams` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On a team, mark it as the match winner or unmark it, if it already is; on the buttons, fill everything in (“Auto-fill”) or start over (“Reset”). |

## Accessibility

- Each round is a `group` with the phase name, and each team is a button with `aria-pressed` and a full name, such as “Harbor City, seed 1. Pick to win quarterfinal 1”.
- The champion is announced in a `role="status"` region; the connector lines are `aria-hidden`, and the fixed texts are in English.

## Motion

- Choosing a winner draws its line to the next round, slides the highlight between the match's two slots, and makes the team enter the next slot coming from the left, from a slight blur.
- “Auto-fill” decides one match at a time, every 0.32 s, so that each advance can be seen; the champion appears with a slightly bouncy spring.
- With “reduce motion” on, lines and highlights change instantly, the teams only fade, and auto-fill does not wait between matches.

## Responsive behavior

- The lines are measured from the real boxes and redrawn by `ResizeObserver` when the bracket changes size; below 44rem of container width, the names become three-letter codes and the phases get short names.

## Notes for AI

- Import `KnockoutBracket` and pass `teams` in bracket order (the first two face each other in the first match); the count must be a power of two.
- Picks are `{ "rodada-partida": idDoTime }`, both counted from zero (`"0-0"` is the first match); use `value` with `onValueChange`, which already receives the picks without those that lost their meaning.
- `seed` decides the “Auto-fill” (the lower number wins) and `code` appears in place of the name when the bracket gets narrow.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/knockout-bracket · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
