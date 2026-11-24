# Provider status

> Um cartão de status para os provedores de IA em que seu produto depende: cada linha mostra o mark real do provedor, a saúde com ícone e rótulo, a latência p50 e uma barra de uptime de 30 dias com tooltip por dia; uma linha com incidente expande para a timeline de updates (Investigating até Resolved) e o cartão reconfere num countdown visível, com estado de checking e de erro que mantém os últimos resultados na tela.

- Type: component (category Special), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/provider-status
- Original description: A status card for the AI providers your product depends on. Each row shows the provider's real mark, its health as an icon and label, p50 latency and a 30-day uptime bar with a tooltip for each day. An incident row expands into its timeline of updates, and the card checks again on a visible countdown.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/provider-status.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/provider-status.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/provider-status.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/provider-status.json`. Registry path, relative to the site address: `r/provider-status.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/provider-status/provider-status.tsx`
  - `components/ryan-ui/provider-status/provider-status.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/provider-status.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Mostrar a saúde, a latência e o uptime recente dos provedores de modelos que um produto de IA roteia.
- Explicar funcionalidades degradadas para usuários ou admins com os updates de incidente do provedor por perto.
- Páginas de roteamento ou fallback em que é preciso ver quais provedores estão saudáveis agora.

## When not to use

- Uma página pública de status completa, com componentes, assinaturas e histórico: construa uma página, não um cartão.
- O estado de um único provedor num cabeçalho de chat: use agent-status ou um badge pequeno.
- Gráficos detalhados de latência ao longo do tempo: use um componente de gráfico.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { ProviderStatus } from "@/components/ryan-ui/provider-status/provider-status";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 680 };

export default function ProviderStatusDemo() {
  return (
    <Stack gap={3} width={720}>
      <ProviderStatus
        defaultExpandedId="openai"
        footnote="Sample data on simulated checks — no requests were sent. Latency is the median over the last 5 minutes."
      />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AnthropicMark`

Anthropic — mono, draws with currentColor.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `size` | `number` | `16` | — |

### `OpenaiMark`

OpenAI — mono, segmented hex knot drawn with currentColor.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `size` | `number` | `16` | — |

### `GeminiColorMark`

Google Gemini — keeps its brand fills (four point star).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `size` | `number` | `16` | — |

### `MistralColorMark`

Mistral — keeps its brand orange (stylised M).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `size` | `number` | `16` | — |

### `XaiMark`

xAI — mono, x in a ring with currentColor.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `size` | `number` | `16` | — |

### `AwsMark`

Amazon Bedrock — mono, rounded badge with the smile arrow.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `size` | `number` | `16` | — |

### `ProviderStatus`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `providers` | `ProviderStatusItem[]` | — | Leave out to play the built in sample story. |
| `onRefresh` | `(signal: AbortSignal) => Promise<ProviderStatusItem[] \| void>` | — | — |
| `refreshInterval` | `number \| null` | — | Milliseconds between automatic checks. Null turns auto refresh off but keeps the button. |
| `loading` | `boolean` | `false` | Skeleton rows for the first load. |
| `error` | `string \| null` | — | An error to show in the header, such as a failed first load. |
| `title` | `string` | `"AI providers"` | — |
| `expandedId` | `string \| null` | — | — |
| `defaultExpandedId` | `string \| null` | `null` | — |
| `onExpandedChange` | `(id: string \| null) => void` | — | — |
| `onOpenIncident` | `(provider: ProviderStatusItem, incident: ProviderIncident) => void` | — | — |
| `footnote` | `React.ReactNode` | — | — |
| `notice` | `string` | — | One-off message for screen readers. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `ProviderHealth` | `"operational" \| "degraded" \| "outage"` |

#### `ProviderDay`

| Field | Type | Description |
| --- | --- | --- |
| `date` (required) | `string` | "YYYY-MM-DD", oldest first. |
| `uptime` (required) | `number \| null` | 0 to 100, or null for a day with no data. |
| `status` | `"operational" \| "degraded" \| "outage"` | Derived from uptime when left out: below 99.9 degraded, below 99 outage. |
| `note` | `string` | — |

#### `IncidentUpdate`

| Field | Type | Description |
| --- | --- | --- |
| `stage` (required) | `"investigating" \| "identified" \| "monitoring" \| "resolved"` | — |
| `at` (required) | `Date \| number \| string` | Date, timestamp (shown as HH:MM UTC) or preformatted string. |
| `message` (required) | `string` | — |

#### `ProviderIncident`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `title` (required) | `string` | — |
| `updates` (required) | `IncidentUpdate[]` | — |
| `url` | `string` | — |

#### `ProviderStatusItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `name` (required) | `string` | — |
| `mark` | `React.ReactNode` | The provider's mark as a 16px ReactNode. |
| `detail` | `string` | — |
| `status` (required) | `"operational" \| "degraded" \| "outage"` | — |
| `latencyMs` (required) | `number` | — |
| `days` (required) | `ProviderDay[]` | — |
| `incident` | `ProviderIncident \| null` | — |

### Other exports

- `sampleProviders` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Move o foco entre o botão de refresh, cada linha de incidente e cada barra de uptime. |
| `Enter` or `Space` | Numa linha de incidente, abre ou fecha os updates. |
| `Arrow Left` or `Arrow Right` | Numa barra de uptime, move o tooltip do dia um dia para trás ou para frente. |
| `Home` or `End` | Numa barra de uptime, pula para o dia mais antigo ou para hoje. |
| `Escape` | Numa barra de uptime, esconde o tooltip do dia. |

## Accessibility

- O cartão é uma seção rotulada; as linhas formam uma lista e a linha de incidente tem um botão de largura inteira com aria-expanded e aria-controls, nomeado com o provedor, sua saúde e o título do incidente.
- A saúde nunca é só cor: todo status mostra ícone com rótulo, e os ticks carregam a saúde no tooltip e no rótulo da barra.
- Cada barra de uptime é um único tab stop com um rótulo que resume os 30 dias; as setas percorrem os dias e uma live region polida narra cada um, então 180 ticks nunca inundam a ordem de tabulação.
- Uma live region polida anuncia checks, erros de refresh e ações simuladas ("Simulated, no requests were sent").

## Motion

- Rótulos de saúde, latência, uptime e o resumo trocam num crossfade único (saída em 100 ms, entrada em 160 ms com subida de 2 px) dentro de uma célula de grid reservada, então nada reflowa.
- O painel de incidente faz spring até a altura medida sem bounce; novos updates fazem fade-in enquanto o painel cresce.
- Ticks trocam de cor em 240 ms; o anel de countdown é um drain linear em CSS que pausa fora da tela e em abas ocultas; Checking troca o anel por um spinner curto e um rótulo pulsante.
- Com reduzir movimento ativo todos os estados finais permanecem e caem a subida, o spring de altura, o spinner e o pulso do skeleton.

## Responsive behavior

- Acima de 560 px de container cada linha é uma linha só, com colunas para status, p50, a barra de uptime e a porcentagem dos 30 dias.
- Abaixo de 560 px (container query, então segue o cartão e não a janela) as linhas ocupam duas linhas: nome e status em cima, barra de uptime em largura inteira e a porcentagem embaixo, com a latência sob o nome.
- Segura em 360 px sem scroll horizontal; nomes e detalhes longos truncam com elipse.

## Performance

- Um tooltip único para o cartão inteiro, posicionado sob demanda, em vez de um por tick.
- O countdown re-renderiza no máximo uma vez por segundo e o anel anima em CSS; ambos pausam com o cartão fora da tela e em abas ocultas.
- Refreshes são abortáveis e nunca se sobrepõem; um check mais novo aborta o anterior pelo signal.

## Notes for AI

- Use para uma visão de saúde de provedores num produto de IA: página de settings, tile de admin ou popover de status. Ligue onRefresh ao seu endpoint de agregação; não poline páginas públicas de status do browser.
- Passe marks reais a 16 px; marks mono devem usar currentColor para seguirem o tema. Gemini e Mistral mantêm os fills de marca.
- Mantenha latência e uptime como números simples; o componente formata (412 ms, 1.92 s, 99.61%). Dados amostrais ou sintéticos vão anotados no prop footnote.
- Sem props ele roda uma história de exemplo em checks simulados: um outage da OpenAI e um slowdown do Gemini se resolvem, o Mistral tem um incidente curto e um check falha para mostrar o estado de erro.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/provider-status · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
