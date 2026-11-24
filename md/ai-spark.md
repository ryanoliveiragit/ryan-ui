# AI spark

> Marca viva de status de IA em três variantes — mark, pill e avatar — com cinco estados: idle respira com um cintilar por raio, thinking ondula ao redor do anel, generating bate num ritmo de coração com duas partículas orbitando, done reúne os raios num ângulo fixo e error sacode uma vez com raios mais curtos. As trocas se fundem em 420–560 ms a partir da pose atual, o loop pausa fora da tela e desliga quando assenta, a marca vira pontos abaixo de 18 px e as mudanças de estado são anunciadas para leitores de tela.

- Type: component (category Special), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/ai-spark
- Original description: An animated four-ray brand mark that shows what your AI is doing: it breathes while idle, ripples while thinking, pulses like a heartbeat while writing, gathers when done and dims on error — every status change blends from the pose the mark already occupies. Ships in three variants (bare mark, bordered pill with a live crossfading label, avatar tile), self-plays with no status for demos, respects prefers-reduced-motion and announces state changes through a polite live region.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-spark.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-spark.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-spark.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-spark.json`. Registry path, relative to the site address: `r/ai-spark.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/ai-spark/ai-spark.tsx`
  - `components/ryan-ui/ai-spark/ai-spark.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/ai-spark.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Mostrar o que um agente de IA está fazendo agora — pronto, pensando, escrevendo, terminou ou falhou — em chats, cabeçalhos, avatares e pills de status.
- Substituir um spinner genérico quando o estado da IA importa: cada estado tem uma pose própria (respiração, ondulação, batida de coração, recolhimento, sacudida).
- Um único símbolo animado reutilizável de 12 px para cima, com o mesmo comportamento como marca avulsa, pílula com rótulo ou avatar.

## When not to use

- Progresso quantitativo com percentual ou etapas numeradas: use um componente de progresso ou de status de agente.
- Muitas instâncias animadas na mesma tela: cada marca roda um requestAnimationFrame próprio; prefira uma por contexto de status.
- Decoração sem estado real: passe twinkle={false} para um idle imóvel — uma marca viva sem dado por trás é só ruído.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { AiSpark } from "@/components/ryan-ui/ai-spark/ai-spark";
import type { AiSparkStatus } from "@/components/ryan-ui/ai-spark/ai-spark";
import { Row, Stack } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./ai-spark.module.css";

export const stage: DemoStage = { height: 540 };

const OPTIONS: Array<{ value: AiSparkStatus; label: string }> = [
  { value: "idle", label: "Idle" },
  { value: "thinking", label: "Thinking" },
  { value: "generating", label: "Writing" },
  { value: "done", label: "Done" },
  { value: "error", label: "Error" },
];

const SIZES = [12, 16, 20, 24, 32, 48];

function StatusSelector({ value, onChange }: { value: AiSparkStatus; onChange: (next: AiSparkStatus) => void }) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const idx = OPTIONS.findIndex((option) => option.value === value);
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (idx + 1) % OPTIONS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (idx - 1 + OPTIONS.length) % OPTIONS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = OPTIONS.length - 1;
    if (next < 0) return;
    const option = OPTIONS[next];
    if (!option) return;
    event.preventDefault();
    onChange(option.value);
    refs.current[next]?.focus();
  };
  return (
    <div role="radiogroup" aria-label="Estado da IA" className={styles.segmented} onKeyDown={onKeyDown}>
      {OPTIONS.map((option, i) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          ref={(el) => { refs.current[i] = el; }}
          tabIndex={value === option.value ? 0 : -1}
          onClick={() => onChange(option.value)}
          className={value === option.value ? `${styles.seg} ${styles.segActive}` : styles.seg}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function AiSparkDemo() {
  const [status, setStatus] = useState<AiSparkStatus>("thinking");
  const [paused, setPaused] = useState(false);

  return (
    <Stack width={560} gap={1}>
      <div className={styles.card}>
        <div className={styles.panel}>
          <div className={styles.hero}>
            <AiSpark status={status} size={64} tone="inherit" paused={paused} />
          </div>
          <div className={styles.controls}>
            <StatusSelector value={status} onChange={setStatus} />
            <button type="button" className={styles.textButton} aria-pressed={paused} onClick={() => setPaused((current) => !current)}>
              {paused ? "Resume" : "Pause"}
            </button>
          </div>
        </div>
        <div className={styles.divider} role="separator" />
        <Row gap={2} wrap={false} className={styles.pillRow}>
          <AiSpark variant="avatar" size={28} status={status} tone="inherit" paused={paused} announce={false} />
          <AiSpark variant="pill" status={status} tone="inherit" paused={paused} announce={false} />
          <span className={styles.pushRight}>
            <AiSpark variant="pill" status={status} tone="inherit" paused={paused} announce={false} />
          </span>
        </Row>
        <div className={styles.divider} role="separator" />
        <div className={styles.ladder}>
          {SIZES.map((px) => (
            <div key={px} className={styles.rung}>
              <span className={styles.rungMark}>
                <AiSpark size={px} status="idle" twinkle={false} tone="inherit" announce={false} />
              </span>
              <span className={styles.sizeLabel}>{px}</span>
            </div>
          ))}
        </div>
      </div>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AiSpark`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `"idle" \| "thinking" \| "generating" \| "done" \| "error"` | — | What the AI is doing. Leave unset and the spark self-plays idle → thinking → generating → done (demos only). |
| `size` | `number \| string` | — | Size in px, or any CSS length such as "1em" to match surrounding text. Defaults: 24 (32 for the avatar tile, 16 for the mark inside the pill). |
| `tone` | `"accent" \| "foreground" \| "muted" \| "inherit"` | `"accent"` | — |
| `color` | `string` | — | Any CSS color, overriding tone. |
| `variant` | `"mark" \| "pill" \| "avatar"` | `"mark"` | — |
| `label` | `string` | — | Pill text, overriding the built-in label for the current status, e.g. "Reading 12 files". |
| `speed` | `number` | `1` | Multiplies every loop and spin speed. |
| `twinkle` | `boolean` | `true` | A slow breathing twinkle while idle. Off = a fully still idle mark. |
| `paused` | `boolean` | `false` | Freezes the animation in place; resuming continues from the same phase. |
| `announce` | `boolean` | `true` | Announce status changes through a polite live region. Off for decorative copies so only one spark speaks (role="img" instead). |
| `aria-label` | `string` | — | — |
| `className` | `string` | — | — |
| `style` | `CSSProperties` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `AiSparkStatus` | `"idle" \| "thinking" \| "generating" \| "done" \| "error"` |
| `AiSparkTone` | `"accent" \| "foreground" \| "muted" \| "inherit"` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | A própria marca não recebe foco (role=img ou role=status); o foco percorre os controles vizinhos, como o seletor de estado do demo. |

## Accessibility

- Cada instância anuncia o estado por uma live region polida (role=status); nas cópias decorativas, desligue announce para que só uma marca fale.
- O rótulo nomeia o estado em linguagem simples (AI is thinking, Couldn't finish) e pode ser substituído com aria-label.
- Enquanto trabalha o nó ganha aria-busy=true; o erro não depende só de cor: raios mais curtos, diagonais esmaecidas e o tom danger.

## Motion

- Toda troca de estado parte da pose atual e se funde para a nova em 420–560 ms (200 ms com reduzir movimento): nenhum corte brusco entre estados.
- Thinking ondula o anel girando a 26°/s; generating bate num ritmo de coração a 46°/s com duas partículas orbitando acima de 40 px; done recolhe os raios em 170 ms, assenta em 510 ms e desliza para um ângulo múltiplo de 90°.
- Error sacode uma vez em 460 ms com amortecimento exponencial, encurta os raios e esmaece as diagonais.
- Com reduzir movimento a marca assenta numa pose estática por estado, sem loop; fora da viewport ou aba oculta o rAF pausa, e num estado em repouso ele desliga por completo — zero CPU quieta.

## Responsive behavior

- Aceita size em pixels ou em CSS length ("1em" segue o texto); a pílula mantém 28 px de altura e só a largura do rótulo anima.
- Abaixo de 18 px as diagonais viram pontos e abaixo de 24 px os traços engrossam, então a marca continua legível do ladder de 12 px para cima.

## Performance

- Um único requestAnimationFrame por marca escreve atributos SVG via ref; React nunca re-renderiza por frame.
- O loop desliga sozinho em estados de repouso, com paused ou twinkle={false}; IntersectionObserver e visibilitychange param a escrita fora da tela ou da aba ativa.

## Notes for AI

- Sem status o componente se auto-represent idle → thinking → generating → done em loop: use só em demos e marketing; em produto passe o status real.
- speed multiplica todos os ritmos; paused congela no meio da fase e retoma de onde parou; twinkle={false} deixa um idle totalmente imóvel.
- tone="inherit" segue a cor do texto (bom em temas neutros); color aceita qualquer cor CSS. O rótulo da pílula aceita label para textos próprios ("Lendo 12 arquivos").

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/ai-spark · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
