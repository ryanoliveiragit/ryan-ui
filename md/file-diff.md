# File diff

> Diff unificado de um arquivo, com números de linha, contagem de mudanças e trechos iguais que se abrem com um clique.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/file-diff
- Original description: A unified diff of one file with line numbers, tinted added and removed lines, header stats, and unchanged ranges that fold into a row and spring open.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-diff.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-diff.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-diff.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-diff.json`. Registry path, relative to the site address: `r/file-diff.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/file-diff/file-diff.tsx`
  - `components/ryan-ui/file-diff/file-diff.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/file-diff.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Show the change an agent made or proposes to a file, from the before and after text.
- Reviews where it matters to see the exact span that changed within the line and how many lines were added and removed.
- New, deleted or renamed files: the header gets the “New file”, “Deleted” or “Renamed” label and, in the last case, the previous path.

## When not to use

- Use [`code-block`](code-block.md) to show code without a comparison, with a copy button.
- Use [`image-compare`](image-compare.md) when the difference is visual, between two images.
- For side-by-side diffs, with syntax colors or for huge files, look for another solution: here the diff is unified, without syntax highlighting and computed in the browser.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { FileDiff } from "@/components/ryan-ui/file-diff/file-diff";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 600 };

const rateLimitBefore = `import { redis } from "./redis";
import { logger } from "./logger";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 100;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

function keyFor(userId: string) {
  return \`rate:\${userId}\`;
}

/** Usage is tracked per user, in fixed one minute windows. */
export async function currentUsage(userId: string) {
  const raw = await redis.get(keyFor(userId));
  return raw ? Number(raw) : 0;
}

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const key = keyFor(userId);
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }
  if (count > MAX_REQUESTS) {
    logger.warn("rate limit hit", { userId });
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: MAX_REQUESTS - count };
}

export async function resetRateLimit(userId: string) {
  await redis.del(keyFor(userId));
}

export async function resetMany(userIds: string[]) {
  if (userIds.length === 0) return;
  await redis.del(...userIds.map(keyFor));
  logger.info("rate limits cleared", { count: userIds.length });
}
`;

const rateLimitAfter = `import { redis } from "./redis";
import { logger } from "./logger";
import type { Plan } from "./billing";

const WINDOW_SECONDS = 60;
const LIMITS: Record<Plan, number> = { free: 60, pro: 600, team: 3000 };

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
}

function keyFor(userId: string) {
  return \`rate:\${userId}\`;
}

/** Usage is tracked per user, in fixed one minute windows. */
export async function currentUsage(userId: string) {
  const raw = await redis.get(keyFor(userId));
  return raw ? Number(raw) : 0;
}

export async function checkRateLimit(userId: string, plan: Plan = "free"): Promise<RateLimitResult> {
  const key = keyFor(userId);
  const limit = LIMITS[plan];
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }
  if (count > limit) {
    const retryAfter = await redis.ttl(key);
    logger.warn("rate limit hit", { userId, plan });
    return { allowed: false, remaining: 0, retryAfter };
  }
  return { allowed: true, remaining: limit - count };
}

export async function resetRateLimit(userId: string) {
  await redis.del(keyFor(userId));
}

export async function resetMany(userIds: string[]) {
  if (userIds.length === 0) return;
  await redis.del(...userIds.map(keyFor));
  logger.info("rate limits cleared", { count: userIds.length });
}
`;

const testAfter = `import { describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("uses the limit of the plan", async () => {
    await resetRateLimit("user_1");
    const result = await checkRateLimit("user_1", "pro");
    expect(result.remaining).toBe(599);
  });
});
`;

const files = {
  modified: { filename: "src/server/rate-limit.ts", before: rateLimitBefore, after: rateLimitAfter },
  added: { filename: "src/server/rate-limit.test.ts", before: "", after: testAfter },
} as const;

type FileKey = keyof typeof files;

export default function FileDiffDemo() {
  const [file, setFile] = useState<FileKey>("modified");
  return (
    <Stack width={680} gap={3}>
      <div style={{ alignSelf: "flex-start" }}>
        <SegmentedControl
          label="File"
          value={file}
          onValueChange={value => setFile(value as FileKey)}
          options={[{ value: "modified", label: "Modified file" }, { value: "added", label: "New file" }]}
        />
      </div>
      <FileDiff key={file} {...files[file]} maxHeight={428} />
      <Caption>Open a folded range to read the unchanged lines around a change. The header button shows or folds them all.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `FileDiff`

A unified diff of one file, computed from the text before and after. Changed lines carry line numbers, a sign and a tint; the part of a line that actually changed is marked. Long unchanged runs fold into one row that springs open, and the header counts additions and removals.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `filename` (required) | `string` | — | Path of the file, shown in the header. The last segment is emphasized. |
| `previousFilename` | `string` | — | Earlier path, when the change also renamed the file. |
| `before` (required) | `string` | — | Text of the file before the change. Empty for a new file. |
| `after` (required) | `string` | — | Text of the file after the change. Empty for a deleted file. |
| `context` | `number` | `3` | Unchanged lines kept visible around every change. Longer unchanged runs fold into one expandable row. |
| `maxHeight` | `number \| string` | — | Tallest the diff body grows before it scrolls, as a CSS length or a number of pixels. |
| `open` | `boolean` | — | Whether the diff body is open (controlled). |
| `defaultOpen` | `boolean` | `true` | Whether the diff body starts open (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the header toggle opens or closes the diff body. |
| `className` | `string` | — | Class name added to the root element. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Moves through the header buttons, the diff area (which is focusable) and the folded ranges. |
| `Enter` or `Space` | Activates the focused button: collapse the file, show or fold all unchanged lines, or open a folded range. |
| `↑` or `↓` or `←` or `→` | With focus on the diff area, scroll the content; this is the native scrolling of a region with `tabIndex={0}`. |

## Accessibility

- The diff area is a focusable `role="group"`, labeled with the file name and the counts; numbers and signs are `aria-hidden`, and each changed line starts with “Added:” or “Removed:” for screen readers only.
- The header buttons have `aria-label`, `aria-expanded` or `aria-pressed`; when a folded range is opened, focus moves to the revealed lines, because the button stops existing.
- With the file collapsed, the body is `inert`; all labels are fixed in English.

## Motion

- Lines enter in sequence, with a short delay between them (the same from the 25th on), and the five header blocks appear one after another.
- The body opens and closes with a height spring; a folded range grows from the 32 px of its own row, without a jump.
- With “reduce motion” on, the lines appear all at once and heights change instantly.

## Responsive behavior

- Long lines do not wrap: the body scrolls horizontally with the number column pinned to the left, and `maxHeight` limits the height and turns on vertical scrolling.
- Below 26rem of the component's own width (container query), the five blocks disappear; in the path, the directory truncates with an ellipsis before the file name.

## Performance

- The diff is computed in the browser by LCS: after trimming the equal start and end, the table has the size of (middle lines before) × (middle lines after); the result is memoized by `before` and `after`.
- There is no virtualization: each visible line is a DOM node; folded unchanged ranges are not rendered, so keep `context` low on large files.

## Notes for AI

- Pass `filename`, `before` and `after` with the full text: an empty `before` indicates a new file and an empty `after`, a deleted file; the component does not read a ready-made patch.
- `context` (default 3) defines how many equal lines stay around each change; larger spans fold into a clickable line, and a new diff starts folded again.
- For several files, render one `FileDiff` per file and use `defaultOpen={false}` or the `open` and `onOpenChange` pair to leave only some open.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/file-diff · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
