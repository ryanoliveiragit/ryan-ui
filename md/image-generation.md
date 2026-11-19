# Image generation

> Cartão de pedido de imagem: um campo de células cintila com o progresso e a imagem surge do desfoque até ficar nítida.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/image-generation
- Original description: An image request card: a shimmering field of cells with progress and phase labels, then the image resolves from blurred to sharp and the footer becomes the actions row.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-generation.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-generation.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-generation.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-generation.json`. Registry path, relative to the site address: `r/image-generation.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/image-generation/image-generation.tsx`
  - `components/ryan-ui/image-generation/image-generation.module.css`
  - `components/ryan-ui/lib/use-copy-feedback.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/image-generation.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- An image request in a conversation or editor, with prompt, progress and result in the same card.
- Generations that take a few seconds and have known progress: the card shows the phase and percentage instead of a spinner.
- When the result calls for immediate actions: generate again, download the image and copy the prompt.

## When not to use

- Use [`skeleton`](skeleton.md) to reserve the place of an ordinary image that is just loading.
- Use [`image-viewer`](image-viewer.md) for a gallery of finished images, with zoom and navigation.
- Use [`progress`](progress.md) or [`toast-progress`](toast-progress.md) for long tasks that do not end in an image.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { ImageGeneration } from "@/components/ryan-ui/image-generation/image-generation";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { photo } from "@/components/ryan-ui/lib/media";
import type { PhotoId } from "@/components/ryan-ui/lib/media";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 640 };

const requests = {
  lake: { label: "Lake", prompt: "A quiet alpine lake at dawn, layered ridges fading into mist, flat paper-cut style", results: ["alpine-lake", "mountain-ridges", "coastline"] },
  city: { label: "City", prompt: "Lisbon rooftops in late afternoon light, terracotta and cream, minimal shapes", results: ["lisbon-rooftops", "lisbon-bridge", "lisbon-tram"] },
  arches: { label: "Arches", prompt: "A row of arches beside a pool, soft shadows, sea blue and sand palette", results: ["pool-house", "curved-facade", "sunroom"] },
} as const satisfies Record<string, { label: string; prompt: string; results: readonly PhotoId[] }>;

type RequestKey = keyof typeof requests;

export default function ImageGenerationDemo() {
  const [request, setRequest] = useState<RequestKey>("lake");
  const [variant, setVariant] = useState(0);
  const { prompt, results } = requests[request];
  const result = photo(results[variant % results.length]!);
  return (
    <Stack width={440} gap={3}>
      <ImageGeneration
        key={request}
        prompt={prompt}
        model="Studio v3 · 3:2"
        aspectRatio="3 / 2"
        src={result.src}
        alt={result.alt}
        duration={3600}
        onRegenerate={() => setVariant(current => current + 1)}
      />
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
        <SegmentedControl
          label="Prompt"
          value={request}
          onValueChange={value => { setRequest(value as RequestKey); setVariant(0); }}
          options={(Object.keys(requests) as RequestKey[]).map(key => ({ value: key, label: requests[key].label }))}
        />
        <Caption>Pick a prompt, or regenerate for another take.</Caption>
      </div>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ImageGeneration`

A card for one image request. While the image is being made, a field of cells shimmers behind a progress line and a phase label; when it is ready the image resolves from blurred to sharp and the footer turns into the actions: regenerate, download, copy prompt.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prompt` (required) | `string` | — | The prompt the image was requested with. |
| `src` | `string` | — | Address of the finished image. It is shown when the status is "done". |
| `alt` | `string` | — | Alternative text of the finished image. Defaults to the prompt. |
| `status` | `"idle" \| "generating" \| "done" \| "error"` | — | Where the request is (controlled). Leave it out and the card runs a timed preview: `duration` of progress on mount and on every regenerate. |
| `progress` | `number` | — | Progress from 0 to 1 while generating (controlled, used together with `status`). |
| `duration` | `number` | `4200` | Length of the built-in timed preview in milliseconds, when `status` is not controlled. |
| `model` | `string` | — | Name of the model or style, shown next to the prompt. |
| `aspectRatio` | `string` | `"4 / 3"` | Aspect ratio of the image frame, as a CSS `aspect-ratio` value. |
| `error` | `string` | `"The image could not be generated."` | Message shown when the status is "error". |
| `onRegenerate` | `() => void` | — | Called by Generate, Regenerate and Try again. Swap `src` here to show a new result. |
| `onComplete` | `() => void` | — | Called when the built-in timed preview reaches the end. |
| `className` | `string` | — | Class name added to the root element. |

### Exported types

| Type | Definition |
| --- | --- |
| `ImageGenerationStatus` | `"idle" \| "generating" \| "done" \| "error"` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | Activates the focused button: “Regenerate”, “Copy prompt”, “Generate” or “Try again”. |
| `Enter` | Activates the “Download” link, which points to `src` with the `download` attribute. |

## Accessibility

- While generating, the frame is a `role="progressbar"` with `aria-valuenow` and `aria-valuetext` (phase and percentage); at the end, a `role="status"` region announces “Image ready”.
- The error appears in a `role="alert"`; the image uses `alt`, which by default repeats the `prompt`, so pass an `alt` that describes the result.
- Phases, buttons and announcements are fixed in English; only `prompt`, `model`, `alt` and `error` are yours.

## Motion

- During generation, a diagonal opacity wave sweeps a grid of 8 × 6 cells, the progress line fills and the phase label swaps, leaving through a blur.
- When the image finishes loading, it goes from blurred and slightly enlarged to sharp in under a second, and the actions enter in sequence in the footer.
- With “reduce motion” on, the wave stops and the cells stay fixed, the image appears without blur or zoom and swaps are immediate.

## Responsive behavior

- Fills 100% of the parent and the frame keeps `aspectRatio` (default `4 / 3`); the prompt truncates at two lines and the actions wrap to the line below.

## Performance

- Without `status`, a 70 ms `setInterval` moves the progress; each generating card animates 48 cells, and the 28 px blur in the reveal is expensive: avoid several generating at the same time.

## Notes for AI

- Without `status`, the card generates nothing: it runs a timed preview of `duration` ms on mount and on each “Regenerate”; in real use, control `status` (`idle`, `generating`, `done`, `error`) and `progress` from 0 to 1.
- `onRegenerate` is called by “Generate”, “Regenerate” and “Try again”: trigger the new generation there and swap `src` when it finishes.
- The image only appears with `status` at `done` and `src` loaded; “Download” is a link with `download` to the same `src`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/image-generation · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
