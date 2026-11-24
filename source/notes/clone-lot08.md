# Clone Lote 08 — notas de entrega

Copía de trabalho: `/tmp/opencode/clone-08` (node_modules é symlink para `$AG/ryan-ui/node_modules`).
Nada do que é artefato foi publicado; o orquestrador coleta o que está no `MANIFEST.txt` na raiz da cópia.

## Itens (6)

| Item | Status | Onde |
|---|---|---|
| training-run | Feito e **já commitado na árvore principal** (`ryan-ui`, commit `8656637`) — fora do MANIFEST de propósito | main tree |
| ai-command | Feito nesta cópia | registry + demo + 3 JSONs |
| ai-spark | Adotado do estado anterior + null-safety + centralização; tsc limpo | registry + demo + 3 JSONs |
| starter-prompts | Feito nesta cópia (grid 2×2, shuffle, composer, abas, roving tabindex) | registry + demo + 3 JSONs |
| ai-mascot | Feito nesta cópia (SVG puro + rAF, 6 estados, PHRASES por status) | registry + demo + 3 JSONs |
| image-reveal | Feito nesta cópia (canvas 2D, sampler simulado, decode em tiles, sheen) | registry + demo + 3 JSONs |

## Estado integrado (após merge/build no fim do lote)

- `registry.json`: 238 itens (94 novos de `registry/_new`)
- catálogo: 194 componentes + 42 blocos; demos 236/236
- `npx tsc --noEmit` na cópia: **0 erros**
- Shots em `/tmp/opencode/c08/`: `ir-dark.png`, `ir-light.png` (+ `-late`), `am-*`, `sp-*`, `ai-command-*`, `ai-spark-*` — **todos com zero erros de console**
- Vite 5208 parado ao final.

## Decisões de implementação importantes

### image-reveal
- Canvas 2D único; motor em refs + rAF que **para sozinho** quando não há quadro a produzir (fila sem imagem, erro, done sem sheen/loop) e pausa fora da viewport (IntersectionObserver) / aba oculta.
- Corrente de previsões 6→96 px com crossfade entre links + blur decrescente; ruído latente semeado por step (mulberry32 + hash da seed) construído sobre a paleta real da imagem (48×48), trocado a cada step com blend de 35 ms, alpha `(1-u)^1.6`.
- Decode: snapshot do último quadro de generating (`decodeBase`) fica sob os tiles (até 10×10) que resolvem com janelas escalonadas; sheen soft-light de 1,1 s; wipe de 220 ms no "Generate again" (`runKey`).
- Modo automático cicla 4 fotos locais de `public/media/specials/` (mesma origem → funciona offline); cada tile usa `seed` própria (48213+i).
- Modo controlado reage a **transições** de `status` (guarda o último status emitido); ir direto `generating → done` ainda toca o decode; `progress` controla o passo do sampler quando dado.
- Pílula: fundo neutro escuro (neutral-11 74%) com blur — legível nos dois temas sobre qualquer imagem; numerais tabulares com largura reservada (7ch) para o contador não balançar a pílula.

### Fixes aplicados no fim (após o rascunho)
- `draw()`: branch de erro antes do wipe; wipe antes do check de fila (senão o fade-out nunca aparecia); decode usa `decodeBase` em vez do link máximo da corrente.
- Progressão automática só anda com imagem pronta (evita o run terminar enquanto a foto ainda carrega e ficar preso em grain).
- Fila em modo auto precisa de frames (timer de queueDuration); sem imagem ela estaciona e acorda no load.
- `aspectRatio` como string "a / b" agora divide corretamente (o `parseFloat` lia só o "a").
- Wake explícito em mudanças de props controladas (o loop podia estar estacionado).
- Demo: `runKey` do componente em vez de remount React (blur-back + rerun, não troca de DOM).

### Demais itens
- House accent lime `#DDFC74`; as refs incluem chrome dos docs do uiarc — recriei só o painel interno, standalone.
- starter-prompts: bug de flex corrigido com `flex:1; min-width:0` nas células (descrições nowrap faziam overflow); ordem/txt dos 4 starters confirmados exatos contra a ref via probe de DOM (`c08-sp-cards.mjs`, depois descartado).
- ai-mascot: `tone="ink"` nos dois temas (ref light confirma corpo escuro + olhos claros), name Atlas 140, mini 20, status default "listening", segmented radiogroup + Pause/Resume, stack 520, stage 480.
- tsconfig tem `noUncheckedIndexedAccess`: todo acesso indexado foi guardado.

## Deltas aceitos (notados, não bloqueantes)

1. **ai-mascot**: frases de caption dos estados não-idle inventadas (a ref só mostra legível "I'm ready when you are", em mid-crossfade o resto era ilegível). Estrutura/idêntico, texto divergente.
2. **ai-mascot**: card do demo 520 px vs ~668 px da ref em 1440 (estrutura igual; largura menor por escolha de stage).
3. **image-reveal**: ref pegada em 28/30 quase nítida; minhas shots oficiais (2500 ms de espera do script) pegam o meio do sampling (steps 1–20/30) — arco completo conferido em shots `-late` (4300 ms): mesmo look, blur+noise caindo até o decode em tiles.
4. **image-reveal**: lote de 4 tiles mostra 4 fotos diferentes (ciclo de samples com seeds distintas) vs a ref com 4 variações da mesma cena — comportamento "simulado" previsto pela spec (seed diferencia o ruído).

## Como integrar (para o orquestrador)

1. Copiar os caminhos do `MANIFEST.txt` de `/tmp/opencode/clone-08/` para `$AG/ryan-ui/` (paths relativos; sobrescrever os existentes das demos/registros).
2. Na árvore principal: `node scripts/merge-new-items.mjs && node scripts/build-catalog.mjs`.
3. Conferir: `npx tsc --noEmit` (esperado 0) + abrir `/preview/<slug>?theme=dark|light` dos 5 slugs da cópia (training-run já estava ok na main).
4. Não mexer em `vite.config.ts` da cópia (tinha `server.fs.strict:false` só para servir do /tmp — não está no MANIFEST).

## Resíduos fora do MANIFEST (inofensivos, na cópia)

- `site/demos/json-viewer.module.css`, `json-viewer-data.json`, `package.json.antes-whisper`, `package-lock.json.antes-whisper`
- `heretic/`, `heretic-home/` (do outro lote, não tocar)
- probes descartadas `c08-*.mjs` na raiz
- diff pré-existente da main tree (deixado como está)
