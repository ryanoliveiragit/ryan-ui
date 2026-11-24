# Image reveal

> Tela de geração de imagem em que um preview embaçado construído a partir das próprias cores da imagem (corrente de previsões de 6 a 96 px) afia passo a passo sob um ruído latente semeado por step, seguido de um decodificado em tiles estilo VAE por cima do último quadro congelado e um brilho suave final; pílula de progresso translúcida (spinner + Denoising + n / 30 com numerais tabulares), estado de fila calmo com shimmer de 2,6 s sem costura, estado de erro com Retry opcional, ruído semeado por step para tiles do mesmo lote saírem diferentes, fallback de movimento reduzido e modo simulado automático com fila escalonada, pausa e loop para grades.

- Type: component (category Special), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/image-reveal
- Original description: An image generation canvas where a soft, blurred preview built from the image's own downsampled colors sharpens behind a fine latent-noise layer as the sampler steps, then a tiled VAE-style decode snaps the crisp image in over the frozen last frame, finished by one soft light sheen. Ships a translucent progress pill (spinner + Denoising + n / 30 with tabular numerals), a calm queued state with a 2.6s seam-free shimmer, an error state with optional Retry, seeded per-step noise so batch tiles differ, reduced-motion fallbacks, and auto-simulation mode with staggered queue, hold and loop for grids.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-reveal.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-reveal.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-reveal.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-reveal.json`. Registry path, relative to the site address: `r/image-reveal.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/image-reveal/image-reveal.tsx`
  - `components/ryan-ui/image-reveal/image-reveal.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/image-reveal.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Mostrar o progresso de um modelo de imagens num canvas ou numa resposta de chat, no estilo ChatGPT/Midjourney/Gemini.
- Um lote de variações sendo amostradas lado a lado (a mesma seed diferencia o ruído por tile).
- Um trabalho de imagem na fila que precisa parecer vivo antes de começar.

## When not to use

- Imagem estática sem estado de carregamento: um <img> comum basta.
- Progresso determinístico e longo (minutos): prefira uma barra linear — aqui o ritmo é o de um sampler de segundos.
- GIFs ou vídeos em loop: o reveal é único por imagem, não contínuo.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { ImageReveal } from "@/components/ryan-ui/image-reveal/image-reveal";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./image-reveal.module.css";

export const stage: DemoStage = { height: 720 };

const TILES = [0, 1, 2, 3];

export default function ImageRevealDemo() {
  const [runKey, setRunKey] = useState(1);

  return (
    <Stack gap={3} width={564}>
      <div className={styles.card}>
        <div className={styles.head}>
          <div>
            <h3 className={styles.title}>Quiet landscapes at golden hour</h3>
            <p className={styles.sub}>Seed 48213, 30 steps, batch of 4. Simulated.</p>
          </div>
          <button type="button" className={styles.again} onClick={() => setRunKey((k) => k + 1)}>
            <RotateCcw size={13} aria-hidden />
            Generate again
          </button>
        </div>
        <div className={styles.grid}>
          {TILES.map((i) => (
            <ImageReveal
              key={i}
              seed={48213 + i}
              steps={30}
              aspectRatio="9 / 10"
              size="sm"
              runKey={runKey}
              loop={false}
              startDelay={i * 350}
              queueDuration={900}
              duration={4200}
              style={{ maxInlineSize: "none" }}
              alt={`Golden-hour landscape, variation ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ImageReveal`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | — | Final image URL. Cross-origin images work (pixels are never read back). Omit to cycle through sample photos. |
| `alt` | `string` | `"Generated image"` | Alt text for the final image, used as the canvas label once done. Default: "Generated image". |
| `status` | `"queued" \| "generating" \| "decoding" \| "done" \| "error"` | — | Controlled state. Omit for auto mode, which runs queued, sampling over `duration`, decoding over `decodeDuration`, then done. Going straight from generating to done still plays the decode. Every change transitions smoothly. |
| `progress` | `number` | — | Controlled progress from 0 to 1 while generating, usually step / total. The canvas moves one denoising step at a time, like the real sampler. Omit to step at a constant rate over `duration`. |
| `duration` | `number` | `4600` | Milliseconds the sampling steps take when `progress` is not controlled. Default: 4600. |
| `decodeDuration` | `number` | `560` | Milliseconds the tiled decode takes after the last step. Default: 560. |
| `steps` | `number` | `30` | Sampling steps. Each is one visible denoising step, and the pill shows it as 18 / 30. Default: 30. |
| `aspectRatio` | `number \| string` | `1` | Width over height, as a number (1.5) or a CSS ratio ("4 / 5"). The image is cover-cropped to it. Default: 1. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Overlay scale and corner radius. "sm" (grids, thumbnails) shows only the ring and 18 / 30; "md" and "lg" add the Denoising label. Default: "md". |
| `color` | `string` | — | Any CSS color for the progress ring. Defaults to the accent. |
| `showProgress` | `boolean` | `true` | Shows the translucent progress pill. It fades out shortly after the image resolves. Default: true. |
| `sheen` | `boolean` | `true` | Plays one soft light sheen across the image when it resolves. Skipped with reduced motion. Default: true. |
| `queueLabel` | `string` | `"Queued"` | Chip label while queued, such as "Queued, 2 ahead". Default: "Queued". |
| `errorMessage` | `string` | `"Generation failed"` | Message in the error state. Default: "Generation failed". |
| `onRetry` | `() => void` | — | Shows a Retry button in the error state. |
| `onStatusChange` | `(status: ImageRevealStatus) => void` | — | Called when the displayed status changes, including auto mode transitions. |
| `onComplete` | `() => void` | — | Called once per run when the final image is fully resolved and crisp. |
| `autoPlay` | `boolean` | `true` | Auto mode only: starts generating on mount. Default: true. |
| `loop` | `boolean` | `true` | Auto mode only: after `holdDuration` the image blurs back out and generates again. Default: true. |
| `startDelay` | `number` | `0` | Auto mode only: extra queue time in milliseconds before a run, for staggered grids. Default: 0. |
| `queueDuration` | `number` | `900` | Auto mode only: milliseconds in the queue before each run. Default: 900. |
| `holdDuration` | `number` | `2600` | Auto mode only: milliseconds the finished image holds before a loop restarts. Default: 2600. |
| `runKey` | `string \| number` | — | Auto mode only: change it to blur back out and run again (a Generate again button). |
| `seed` | `number` | `1` | Seeds the latent noise, so tiles in a batch differ and a replay of the same seed shows the same noise. Default: 1. |
| `className` | `string` | — | — |
| `style` | `CSSProperties` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `ImageRevealStatus` | `"queued" \| "generating" \| "decoding" \| "done" \| "error"` |
| `ImageRevealSize` | `"sm" \| "md" \| "lg"` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | No estado de erro, foca o botão Retry (o único controle focusável do componente). |
| `Enter` or `Space` | No Retry focado, dispara onRetry e volta a simulação/estado controlado. |

## Accessibility

- A raiz é role=img com aria-label que muda por estado (rótulo da fila, "Generating image", "Decoding image", alt no fim) e aria-busy durante sampling e decode.
- A pílula vira role=progressbar com aria-valuemin/max/now/text enquanto gera; os ícones são aria-hidden.
- Uma live region polida (role=status) anuncia transições: fila, geração, pronto e erro.
- O estado de erro não depende só de cor: TriangleAlert + mensagem + botão visível.
- Com movimento reduzido: shimmer e spinner param, o decode vira um crossfade simples de 240 ms e o sheen some.

## Motion

- Durante o sampling, a corrente de previsões (6/9/13/19/28/42/63/96 px) faz crossfade entre links com blur que diminui conforme o progresso, sob ruído latente que troca a cada step com blend de 35 ms e esmaece com (1-u)^1.6.
- O decode é um tile (até 10×10) que resolve por cima do último quadro congelado com janelas escalonadas de 240 ms; ao fim, um sheen de luz cruza a imagem em 1,1 s (soft-light).
- Voltar a gerar (runKey) faz um wipe de 220 ms do quadro atual de volta à superfície antes da nova simulação.
- A pílula entra/sai com spring (stiffness 480, damping 34) e o contador troca por crossfade de 160 ms; a fila tem shimmer CSS de 2,6 s sem costura.
- O loop rAF para sozinho: fila sem imagem, erro e imagem pronta sem sheen/loop rodam zero frames.

## Responsive behavior

- A raiz toma 100% da largura disponível e mantém a aspectRatio dada (default 1); o canvas acompanha via ResizeObserver com DPR limitado a 2.
- size="sm" aperta raio e pílula para grades e miniaturas (só spinner + n / 30); "md" e "lg" ganham o rótulo Denoising e pílula maior.
- Nada transborda: overlays (pílula, erro) são absolutos dentro da raiz com overflow hidden.

## Performance

- Uma única canvas 2D desenha tudo; a imagem decodifica fora do thread principal (im.decode) antes de entrar no loop.
- O ruído latente é um canvas pequeno (~w/6) desenhado escalado com smoothing off — barato a cada frame.
- Grain de filme é um tile de 160 px criado uma vez e repetido via pattern com alpha variável por estado.
- O rAF só roda quando há quadro para produzir (sampling, decode, sheen, wipe, espera de fila com imagem) e pausa fora da viewport (IntersectionObserver) e com aba oculta.

## Notes for AI

- Sem src, o modo automático cicla quatro fotos locais do site (mesma origem, funciona offline) — cada tile de um lote parte de seed própria e mostra uma foto diferente.
- Controle por status/progress se necessário; ir direto de generating para done ainda toca o decode antes de fechar.
- runKey (string ou número) é o botão "Generate again": muda e o tile faz blur-back e roda de novo.
- startDelay + queueDuration escalonam grades; holdDuration + loop mantêm a vitrine viva.
- steps alimenta o contador da pílula (n / 30) e o ritmo dos trocos de ruído; duration é o tempo total do sampling no modo não controlado (4,6 s).
- color pinta o spinner (default: accent da casa); showProgress oculta a pílula; sheen desliga o brilho final.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/image-reveal · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
