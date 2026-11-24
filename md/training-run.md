# Training run

> Cartão de job de fine-tuning: as curvas de loss de treino e validação desenham ao vivo sobre um eixo de passos fixo que também é a barra de progresso por epoch; mostra learning rate, tempo decorrido e ETA, os últimos evals e checkpoints, tem Pause e Cancel durante o run e termina em resultados com botão de Deploy.

- Type: component (category Special), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/training-run
- Original description: A fine-tuning job card where a live train and validation loss curve draws across a fixed step axis that doubles as the epoch progress bar. It shows the learning rate, elapsed time and ETA, the latest evals and checkpoints, has Pause and Cancel while it runs, and ends in results with a Deploy button.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/training-run.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/training-run.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/training-run.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/training-run.json`. Registry path, relative to the site address: `r/training-run.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/training-run/training-run.tsx`
  - `components/ryan-ui/training-run/training-run.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/training-run.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Acompanhar um único job de fine-tuning ou destilação rodando na plataforma: loss, learning rate, tempo decorrido, ETA e eventos recentes sem sair da página.
- Onboarding de produto em que o modelo treina sobre os dados do cliente e termina o run num deploy.
- Monitoramento somente leitura: sem nenhum callback a vira um cartão sem botões, só dados.

## When not to use

- Gráfico multi-série genérico sem ciclo de vida de job: use line-chart.
- Tarefas de agente com passos em vez de curva de loss: use agent-status.
- Lista de muitos jobs: renderize uma linha compacta por job e abra este cartão apenas para o selecionado.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { TrainingRun } from "@/components/ryan-ui/training-run/training-run";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 640 };

export default function TrainingRunDemo() {
  return (
    <Stack gap={3} width={640}>
      <TrainingRun />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `QwenColorMark`

Marca do Qwen (Qwen3.8 Max): losango hexagonal em facetas índigo. O fill é marca, não decoração.

No props of its own: accepts those of the element or primitive it wraps.

### `HuggingFaceMark`

Marca do Hugging Face: silhueta de raposa no amarelo da marca.

No props of its own: accepts those of the element or primitive it wraps.

### `TrainingRun`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `"queued" \| "running" \| "paused" \| "completed" \| "failed" \| "cancelled"` | — | Onde o job está. Rodando sem amostras de loss lê como "subindo". Sem ele, roda a simulação embutida. |
| `name` | `string` | `"Fine-tuning job"` | — |
| `model` | `{ name: string; mark?: ReactNode }` | — | — |
| `details` | `string[]` | `[]` | — |
| `dataset` | `{ name: string; examples?: number; mark?: ReactNode }` | — | — |
| `step` | `number` | — | — |
| `totalSteps` | `number` | — | — |
| `epochs` | `number` | — | — |
| `loss` | `LossSample[]` | — | — |
| `learningRate` | `number` | — | — |
| `elapsed` | `number` | — | — |
| `eta` | `number` | — | — |
| `events` | `TrainingEvent[]` | — | — |
| `metrics` | `{ label: string; value: string; hint?: string }[]` | — | — |
| `activity` | `string` | — | Linha sobre o gráfico vazio enquanto o job está na fila ou subindo. |
| `error` | `string` | — | Motivo da falha; aparece no rodapé no lugar do dataset. |
| `onPause` | `() => void` | — | — |
| `onResume` | `() => void` | — | — |
| `onCancel` | `() => void` | — | Chamado num segundo toque em "Confirm cancel" (janela de 3s). |
| `onRetry` | `() => void` | — | — |
| `onRestart` | `() => void` | — | — |
| `onDeploy` | `(signal: AbortSignal) => Promise<{ endpoint?: string } \| void>` | — | — |
| `notice` | `string` | — | Mensagem de uso único para leitores de tela (resultado de uma ação). |
| `scenario` | `"healthy" \| "oom"` | `"healthy"` | Só o demo, quando status fica de fora: "oom" falha no passo 940 para mostrar o retry. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `TrainingStatus` | `"queued" \| "running" \| "paused" \| "completed" \| "failed" \| "cancelled"` |
| `TrainingEventKind` | `"start" \| "checkpoint" \| "eval" \| "epoch" \| "info" \| "warning" \| "error" \| "done"` |

#### `TrainingEvent`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `kind` (required) | `"start" \| "checkpoint" \| "eval" \| "epoch" \| "info" \| "warning" \| "error" \| "done"` | — |
| `label` (required) | `string` | — |
| `step` | `number` | — |

#### `LossSample`

| Field | Type | Description |
| --- | --- | --- |
| `step` (required) | `number` | — |
| `train` | `number` | — |
| `val` | `number` | — |

#### `TrainingRunSimulation`

| Field | Type | Description |
| --- | --- | --- |
| `error` | `string` | — |
| `notice` | `string` | — |
| `scenario` (required) | `"healthy" \| "oom"` | — |
| `...props` | `Required<Omit<TrainingRunProps, "className" \| "scenario" \| "error" \| "notice">>` | Also accepts the props of this type. |

### Other exports

- `useTrainingRunSimulation` (hook)

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Percorre o gráfico de loss e as ações do rodapé. |
| `Esquerda` or `Direita` | No gráfico focado, percorre as amostras; a legenda mostra a train e a validation loss do passo inspecionado. |
| `Shift + Esquerda` or `Shift + Direita` | Avança dez amostras de cada vez. |
| `Home` or `End` | Salta para a primeira ou para a última amostra. |
| `Esc` | Limpa o passo inspecionado. |
| `Enter` or `Espaço` | Ativa a ação focada; o Cancel pede um segundo toque em Confirm cancel dentro de uma janela de 3s. |

## Accessibility

- Região aria-live polida anuncia mudanças de status (Queued, Training, Paused, Completed, Failed) e qualquer notice passado via notice; nunca anuncia passo a passo.
- O status é ícone mais rótulo, nunca só cor; o motivo da falha fica como texto no rodapé (no lugar do dataset) e no log de eventos.
- O gráfico é um grupo com rótulo cujo aria-label carrega o passo atual e as duas losses; as setas inspecionam amostras e uma nota flutuante mostra os valores do passo inspecionado.
- As métricas são uma lista de descrição (dl) e todos os números usam tabular numerals; o Cancel é ação em duas etapas, para um toque perdido nunca parar um run longo.

## Motion

- As curvas de treino e validação crescem amostra a amostra conforme o run avança; o eixo Y se fixa a partir das primeiras amostras e o eixo X cobre o run inteiro, então nada reescala no meio do treino.
- O playhead e a trilha de progresso por epoch avançam junto com o passo atual; eventos novos deslizam para o log em 240 ms com o ease standard, e status, métricas e textos do rodapé trocam em crossfade com subida de 2 px.
- Com movimento reduzido o spinner para, as transições viram instantâneas e a curva salta direto entre amostras.
- Na simulação embutida o relógio congela quando o cartão sai da tela (IntersectionObserver) e, só no modo demo sem status externo, o run reinicia sozinho após a pausa do estado completado, a menos que alguém interaja.

## Responsive behavior

- Ocupa o container até 640 px de largura.
- Container queries: abaixo de 480 px o padding do cartão cai para 14/16 px, as quatro métricas viram duas colunas, a legenda encurta Validation para Val e o rodapé empilha contexto acima das ações.

## Performance

- O SVG é medido e redesenhado em pixels reais (ResizeObserver), nítido em qualquer largura; o filtro das amostras do demo roda a cada tick de 90 ms e aguenta alguns milhares de pontos — para runs maiores, subamostrai loss para uns 500 antes de passar.

## Notes for AI

- Passe totalSteps e epochs vindo da configuração do job para o eixo estar certo desde a primeira amostra; envie loss conforme ele chega, mais antigo primeiro.
- Cada controle só aparece quando seu callback é passado: um monitor somente leitura usa apenas props de dados. Sem status, o cartão toca a simulação LoRA embutida do Qwen3.8 Max.
- Importe QwenColorMark e HuggingFaceMark do próprio componente ou passe seus SVGs em model.mark / dataset.mark; ações primárias (Resume, Retry, Deploy) usam o accent e só o Confirm cancel usa danger.
- onDeploy recebe um AbortSignal; faça abort no unmount e o cartão já mostra o endpoint retornado com botão de copiar.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/training-run · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
