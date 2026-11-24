# AI mascot

> Um mascote SVG vivo que mostra o que seu assistente está fazendo agora: idle respira, flutua e pisca de vez em quando; listening se inclina para dentro com os olhos mais abertos; thinking inclina a cabeça enquanto um ponto companheiro orbita ao redor do corpo, passando por trás e por frente; writing olha para baixo enquanto o ponto desenha uma linha debaixo dele; done faz um estreitar de olhos feliz e o ponto vira um brilho no lugar; error sacode uma vez com sobrancelhas preocupadas. Os olhos seguem o ponteiro, cada troca de estado se funde em 420 ms a partir da pose atual, com reduzir movimento ele congela em poses estáticas limpas e muda de estado na mesma posição.

- Type: component (category Special), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/ai-mascot
- Original description: A live SVG mascot that shows what your assistant is doing: idle breathes, floats and blinks; listening leans in with wide eyes; thinking tilts its head while a companion dot orbits around it, passing behind and in front of the body; writing looks down as the dot draws a line under it; done squints happily and the dot becomes a sparkle; error shakes once with worried brows. The eyes follow the pointer on a damped spring, every status change blends from the pose currently on screen over 420 ms, it self-plays through all states when status is unset, freezes into clean static poses under prefers-reduced-motion and can announce state changes through a polite live region.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-mascot.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-mascot.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-mascot.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-mascot.json`. Registry path, relative to the site address: `r/ai-mascot.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/ai-mascot/ai-mascot.tsx`
  - `components/ryan-ui/ai-mascot/ai-mascot.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/ai-mascot.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Mostrar, com personalidade, o que um agente de IA está fazendo agora — esperando, ouvindo, pensando, escrevendo, terminou ou falhou — no lugar de uma pílula genérica de status.
- Preencher estados vazios de chat, painel ou tela de loading com um personagem que fica vivo e acompanha o ponteiro, dando presença a produtos de assistente.
- Quando a mudança de estado precisa chegar também a leitores de tela: o mascote anuncia frases curtas numa live region opcional (prop announce).

## When not to use

- Progresso quantitativo com percentual, tempo restante ou etapas numeradas: use um componente de progresso — o mascote não mede nada.
- Densidade alta: tabelas, dashboards ou listas longas onde um personagem por linha pesa mais do que ajuda.
- Produtos que já têm outro personagem ou marca forte: dois mascotes no mesmo fluxo competem e nenhum ganha.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AiMascot, type MascotStatus } from "@/components/ryan-ui/ai-mascot/ai-mascot";
import { motionTokens } from "@/components/ryan-ui/lib/motion-tokens";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./ai-mascot.module.css";

export const stage: DemoStage = { height: 480 };

const OPTIONS: Array<{ value: MascotStatus; label: string }> = [
  { value: "idle", label: "Idle" },
  { value: "listening", label: "Listening" },
  { value: "thinking", label: "Thinking" },
  { value: "writing", label: "Writing" },
  { value: "done", label: "Done" },
  { value: "error", label: "Error" },
];

/* Friendly captions under the mascot, crossfading between states. Only the idle line was legible in the
   reference shots; the rest follow the same voice. */
const PHRASES: Record<MascotStatus, string> = {
  idle: "I'm ready when you are",
  listening: "Listening to you",
  thinking: "Thinking things through",
  writing: "Writing as I go",
  done: "All wrapped up",
  error: "Something went wrong",
};

function StatusSelector({ value, onChange }: { value: MascotStatus; onChange: (next: MascotStatus) => void }) {
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
    <div role="radiogroup" aria-label="Mascot status" className={styles.segmented} onKeyDown={onKeyDown}>
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

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <rect x="2.5" y="1.5" width="3.2" height="11" rx="1.1" fill="currentColor" />
      <rect x="8.3" y="1.5" width="3.2" height="11" rx="1.1" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <path d="M4.2 2.4a1 1 0 0 1 1.5-.86l7.2 4.6a1 1 0 0 1 0 1.72l-7.2 4.6a1 1 0 0 1-1.5-.86V2.4Z" fill="currentColor" />
    </svg>
  );
}

export default function AiMascotDemo() {
  const [status, setStatus] = useState<MascotStatus>("listening");
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion() ?? false;

  return (
    <Stack width={520} gap={1}>
      <div className={styles.card}>
        <div className={styles.zone}>
          <AiMascot status={status} size={140} tone="ink" name="Atlas" paused={paused} announce />
        </div>
        <div className={styles.captionRow}>
          <AiMascot status={status} size={20} color="var(--neutral-9)" eyeColor="var(--neutral-1)" followPointer={false} paused={paused} />
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={status}
              className={styles.captionWord}
              initial={{ opacity: 0, y: 5, color: "var(--foreground)" }}
              animate={{ opacity: 1, y: 0, color: "var(--text-secondary)" }}
              exit={{ opacity: 0, y: -5, color: "var(--text-muted)" }}
              transition={{ duration: reduced ? 0 : motionTokens.duration.fast, ease: motionTokens.ease.enter }}
            >
              {PHRASES[status]}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className={styles.bar}>
          <StatusSelector value={status} onChange={setStatus} />
          <button type="button" className={styles.pauseButton} aria-pressed={paused} onClick={() => setPaused((current) => !current)}>
            {paused ? <PlayIcon /> : <PauseIcon />}
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AiMascot`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `"idle" \| "listening" \| "thinking" \| "writing" \| "done" \| "error"` | — | What the assistant is doing. Leave unset to play through every state on a loop (the docs demo). |
| `size` | `number` | `96` | Width and height in px, 24 (inline) to 160 (empty state). Below 56 a compact drawing takes over. Default: 96. |
| `tone` | `"accent" \| "ink" \| "soft"` | `"accent"` | Body color from the theme: accent with accent-foreground eyes, foreground ink with background eyes, or a muted surface with a 1px border and foreground eyes. |
| `color` | `string` | — | Any CSS color for the body. Overrides tone; the eyes become a dark mix of it unless eyeColor is set. |
| `eyeColor` | `string` | — | Any CSS color for the eyes and brows. |
| `followPointer` | `boolean \| "page"` | `true` | Eyes follow the pointer while it is over the mascot (true), anywhere on the page ("page", good for empty states) or never (false). Touch is ignored. |
| `companion` | `boolean` | `true` | Show the companion dot that floats, pulses, orbits, writes and becomes the done sparkle. Default: true. |
| `ground` | `boolean` | `true` | The soft contact shadow and the writing line under the mascot. Drawn only at 56px and up. Default: true. |
| `paused` | `boolean` | `false` | Freeze on the current frame. The mascot also pauses by itself off screen and in background tabs, and resumes without a jump. |
| `name` | `string` | `"Assistant"` | Used in the accessible label, for example "Atlas, thinking". Default: "Assistant". |
| `label` | `string` | — | Overrides the whole accessible label. |
| `announce` | `boolean` | `false` | Announce status changes in a polite live region. Turn it on for the one mascot that carries status, not for decorative copies. |
| `onStatusChange` | `(status: MascotStatus) => void` | — | Called when the self-playing loop (status unset) moves to the next state. |
| `className` | `string` | — | Set --mascot-body, --mascot-eye, --mascot-dot, --mascot-shade or --mascot-ground here to restyle. |
| `style` | `CSSProperties` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `MascotStatus` | `"idle" \| "listening" \| "thinking" \| "writing" \| "done" \| "error"` |
| `MascotTone` | `"accent" \| "ink" \| "soft"` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | O próprio mascote não recebe foco (role=img); o foco percorre os controles ao redor dele, como um seletor de estado montado como radiogroup com setas, Home e End. |

## Accessibility

- Cada instância é role=img com rótulo próprio e estado, ex.: "Atlas, thinking"; cópias decorativas passam label para esvaziar o rótulo.
- Com announce ativo, uma live region polida (sr-only) lê frases curtas a cada mudança de estado; use só no mascote que carrega o estado da página.
- Estados em andamento marcam aria-busy; a informação nunca depende só de cor: pose, sobrancelhas e movimento diferenciam error de done.

## Motion

- Toda troca de estado parte da pose que está na tela e se funde para a nova em 420 ms; com reduzir movimento, cada estado congela numa pose estática legível e a troca leva 200 ms.
- Respiração, flutuação, piscadas (2,4–5,2 s, às vezes duplas), órbita do ponto e o ciclo de escrita são funções contínuas de um relógio virtual: pause congela exatamente o quadro atual e o retoma cai no mesmo frame.
- Fora da tela visível ou em aba oculta o requestAnimationFrame para sozinho e volta sem salto.

## Responsive behavior

- Aceita size em pixels (24 a 160, padrão 96); abaixo de 56 px troca para um desenho compacto com corpo e olhos maiores que continua legível a 20 px.
- A sombra de contato e a linha de escrita só desenham a partir de 56 px, onde cabem.

## Performance

- Um único requestAnimationFrame por mascote escreve atributos SVG via ref; React não re-renderiza por frame.
- O loop some quando não há motivo para rodar (estado assentado, reduzir movimento, pause, fora da tela), então um mascote parado custa zero CPU.

## Notes for AI

- Sem status o mascote se auto-representa em loop — idle → listening → thinking → writing → done → error — e chama onStatusChange a cada transição: use só em demos; em produto, passe status.
- Os olhos seguem o ponteiro por mola criticamente amortecida (followPointer true ou "page"), mas cedem para o olhar próprio em thinking, writing, done e error e desligam com reduzir movimento.
- Os tons accent, ink e soft trocam só variáveis CSS (--mascot-body, --mascot-eye, --mascot-dot, --mascot-shade, --mascot-ground); color e eyeColor pintam direto no elemento sem novo arquivo de estilo.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/ai-mascot · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
