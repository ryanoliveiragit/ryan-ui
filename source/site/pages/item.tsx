import { useEffect, useId, useMemo, useRef, useState, type MouseEvent } from "react";
import { ChevronRight, Code, Eye } from "lucide-react";
import { Alert } from "@/registry/components/alert/alert";
import { Skeleton } from "@/registry/components/skeleton/skeleton";
import { StagePanel, StageTools, useDemoStage } from "@/site/components/demo-stage";
import { CopyPageButton, SaveButton } from "@/site/components/item-actions";
import { ApiSection, type ApiData } from "@/site/components/item-api";
import { MoreSection, Pager, RelatedSection, VersionsSection, versionHref, versionKey } from "@/site/components/item-cards";
import { CodeCard, languageOf } from "@/site/components/item-code-card";
import { AiNotesSection, KeyboardSection, ListSection, markdownHref } from "@/site/components/item-guide";
import { InstallChip, InstallSection, installedPath } from "@/site/components/item-install";
import { PlanBadge } from "@/site/components/plan-badge";
import { SiteButton } from "@/site/components/site-button";
import { InlineCode, Section, SegmentedLinks, TabList, panelId, tabId } from "@/site/components/item-ui";
import { Toc, useToc } from "@/site/components/toc";
import { describe, findItem, items, relatedItems, versionsOf, type CatalogItem } from "@/site/lib/catalog";
import type { Guide } from "@/site/lib/guide";
import { PRICE, proItems } from "@/site/lib/plans";
import { href, itemPath, navigate, type Route } from "@/site/lib/router";
import { asset } from "@/site/lib/site-config";
import { useJson, useText } from "@/site/lib/use-json";
import styles from "./item.module.css";

/**
 * A página de um componente ou bloco, como um documento só: cabeçalho, demo (ou código) e as seções em sequência, com o
 * índice "Nesta página" à direita. Ela renderiza apenas o que vai dentro da coluna principal da casca do site.
 *
 * Endereço: /c/<nome> ou /b/<nome>; `?v=<variante>` escolhe a versão de um item que tem mais de uma; `?secao=<id>` rola até
 * a seção (as rotas usam o hash, então a seção não pode ser o hash). `?secao=codigo` abre a aba "Código".
 */

interface RegistryFile { path: string; target: string; type: string; content: string }
interface RegistryItem { name: string; dependencies?: string[]; registryDependencies?: string[]; files: RegistryFile[] }
type Loaded<T> = { status: "loading" } | { status: "ready"; data: T } | { status: "error"; error: Error };
type View = "preview" | "code";

const demoSources = import.meta.glob<string>("/site/demos/*.tsx", { query: "?raw", import: "default" });
const baseName = (file: string) => file.split("/").pop() ?? file;
/** Nome curto de um arquivo de outro item: pasta e arquivo (`button/button.tsx`). */
const shortPath = (file: string) => file.split("/").slice(-2).join("/");
/** As abas da página antiga (`?aba=`) e a seção que tomou o lugar de cada uma. */
const legacyTab: Record<string, string> = { codigo: "codigo", api: "api", instalar: "instalacao" };
/** Clique simples, sem tecla de modificação: o que a página pode tratar sem atrapalhar "abrir em nova aba". */
const plainClick = (event: MouseEvent) => !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

/** Nomes de itens citados entre crases no guia (`split-button`): são os vizinhos que o próprio texto do item recomenda. */
function citedIn(guide: Guide | null): string[] {
  if (!guide) return [];
  const texts = [...(guide.quandoEvitar ?? []), ...(guide.quandoUsar ?? []), ...(guide.notasIA ?? [])];
  return [...new Set(texts.flatMap(text => [...text.matchAll(/`([a-z0-9]+(?:-[a-z0-9]+)*)`/g)].map(match => match[1]!)))];
}

/**
 * Os cartões do fim da página. "Relacionados": os itens que o guia cita, os que o item usa, os da mesma categoria com tags em
 * comum e só depois o resto da ordem de `relatedItems` (que inclui quem usa o item: para uma peça de base como o botão são
 * dezenas de blocos, que tomariam todas as vagas dos irmãos). "Mais como este" faz o papel da vitrine da referência: itens da
 * mesma categoria que ainda não apareceram, os novos primeiro. Nas duas listas entra só um item de cada grupo de versões.
 */
function pickCards(item: CatalogItem, guide: Guide | null) {
  const groupOf = (entry: CatalogItem) => versionsOf(entry)[0]!.item.name;
  const shared = (entry: CatalogItem) => entry.tags.filter(tag => item.tags.includes(tag)).length;
  const seenGroups = new Set([groupOf(item)]);
  const take = (pool: (CatalogItem | undefined)[], limit: number) => {
    const out: CatalogItem[] = [];
    for (const entry of pool) {
      if (out.length >= limit) break;
      if (!entry || seenGroups.has(groupOf(entry))) continue;
      seenGroups.add(groupOf(entry));
      out.push(entry);
    }
    return out;
  };
  const sameCategory = items.filter(entry => entry.category === item.category);
  const related = take([
    ...citedIn(guide).map(findItem),
    ...item.requires.map(findItem),
    ...sameCategory.filter(entry => shared(entry) > 0).sort((a, b) => shared(b) - shared(a) || a.title.localeCompare(b.title)),
    ...relatedItems(item, items.length),
  ], 6);
  const more = take([...sameCategory].sort((a, b) => Number(b.isNew) - Number(a.isNew) || shared(b) - shared(a) || a.title.localeCompare(b.title)), 3);
  return { related, more };
}

/** A aba "Código": o código-fonte de cada arquivo do item, primeiro os dele, depois os que vêm junto de outros itens. */
function SourcePanel({ item, registry }: { item: CatalogItem; registry: Loaded<RegistryItem> }) {
  const base = useId();
  const [selected, setSelected] = useState<string | null>(null);
  if (registry.status === "loading") return <div className={styles.sourceState}><Skeleton label="Loading the code" lines={4} /></div>;
  if (registry.status === "error") return <div className={styles.sourceState}><Alert tone="danger" title="The code didn't load">{registry.error.message}</Alert></div>;
  const own = registry.data.files.filter(file => item.ownFiles.includes(file.path));
  const files = [...own, ...registry.data.files.filter(file => !own.includes(file))];
  const file = files.find(entry => entry.path === selected) ?? files[0];
  if (!file) return <div className={styles.sourceState}><p className={styles.sourceNote}>This item has no files in the registry.</p></div>;
  const panel = `${base}-codigo`;
  return (
    <>
      <CodeCard
        label={`Code for ${baseName(file.path)}`}
        code={file.content.trimEnd()}
        language={languageOf(file.path)}
        maxLines={22}
        header={<TabList variant="pill" base={base} label="Item files" items={files.map(entry => ({ value: entry.path, label: own.includes(entry) ? baseName(entry.path) : shortPath(entry.path) }))} value={file.path} onChange={setSelected} panel={panel} />}
        body={{ id: panel, role: "tabpanel", "aria-labelledby": tabId(base, file.path) }}
      />
      <p className={styles.sourceNote}>
        {files.length === 1 ? "1 file" : `${files.length} files`}{files.length > own.length && own.length ? `, ${own.length} from this item and ${files.length - own.length} included with it` : ""}. It's yours to copy and change. Once installed, this file lives at <InlineCode>{installedPath(file.target)}</InlineCode>.
      </p>
    </>
  );
}

/** "Uso": o código do demo, com os imports como ficam num projeto que instalou o item pela CLI. */
function UsageSection({ item }: { item: CatalogItem }) {
  const source = useText(demoSources[`/site/demos/${item.name}.tsx`], item.name);
  if (source.status !== "ready") return null;
  const usesKit = /from "\.\/_kit"/.test(source.data);
  const code = source.data
    .replace(/from "@\/registry\/(?:components|blocks)\//g, match => (match.includes("/blocks/") ? 'from "@/components/ryan-ui/blocks/' : 'from "@/components/ryan-ui/'))
    .replace(/from "@\/lib\//g, 'from "@/components/ryan-ui/lib/');
  const filename = `${item.name}-demo.tsx`;
  return (
    <Section id="uso" title="Usage" intro={<>The demo on this page, with imports as they look after installing with the CLI.{usesKit ? <> <InlineCode>Stack</InlineCode>, <InlineCode>Row</InlineCode>, <InlineCode>Caption</InlineCode>, <InlineCode>Field</InlineCode> and <InlineCode>Surface</InlineCode> are layout helpers from this site: replace them with your project's layout.</> : null}</>}>
      <CodeCard label={`Code for ${filename}`} code={code.trimEnd()} language="tsx" filename={filename} maxLines={24} />
    </Section>
  );
}

function ItemDocument({ item, route }: { item: CatalogItem; route: Route }) {
  const doc = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const viewBase = useId();
  const [view, setView] = useState<View>("preview");

  const versions = versionsOf(item);
  const own = versions.filter(version => version.item.name === item.name);
  const active = own.find(version => version.variant && version.variant === route.query.get("v")) ?? own[0] ?? versions[0]!;
  const block = item.kind === "block";

  const pro = item.isNew;
  const registry = useJson<RegistryItem>(pro ? null : asset(`r/${item.name}.json`));
  const api = useJson<ApiData>(asset(`api/${item.name}.json`));
  const guideFile = useJson<Guide>(item.hasGuide ? asset(`docs/${item.name}.json`) : null);
  const guide = item.hasGuide && guideFile.status === "ready" ? guideFile.data : null;

  const stage = useDemoStage(item, active.variant);
  const toc = useToc(doc);

  const { related, more } = useMemo(() => pickCards(item, guide), [item, guide]);

  useEffect(() => { document.title = `${item.title} · ryan-ui`; }, [item.title]);

  const sectionHref = (id: string) => href(itemPath(item), { v: active.variant, secao: id === "preview" ? undefined : id });

  // `?secao=<id>` rola até a seção. Ela pode ainda não existir (os dados chegam depois): o efeito espera a lista de seções mudar.
  // Links antigos usavam `?aba=` (as abas viraram seções): eles caem na seção equivalente.
  const requested = route.query.get("secao") ?? legacyTab[route.query.get("aba") ?? ""] ?? null;
  /** Último valor de `?secao=` já atendido ou descartado, e o valor que a própria página escreveu na URL. */
  const consumed = useRef<string | null>(null);
  const written = useRef<string | null>(null);
  const { entries, goTo, toTop } = toc;
  useEffect(() => {
    if (!requested) { consumed.current = null; return; }
    if (requested === consumed.current) return;
    if (requested === written.current) { consumed.current = requested; return; }
    const target = requested === "codigo" ? "preview" : requested;
    if (!entries.some(entry => entry.id === target)) return;
    consumed.current = requested;
    if (requested === "codigo" && !pro) setView("code");
    // No próximo quadro: a casca volta a página ao topo quando a rota muda, e este pedido vem depois disso.
    requestAnimationFrame(() => { goTo(target, { pin: true }); });
  }, [requested, entries, goTo, pro]);

  /** A pessoa escolheu uma seção no índice: a URL passa a apontar para ela, sem novo evento de rota. */
  function onSection(id: string) {
    consumed.current = requested;
    written.current = id === "preview" ? null : id;
    window.history.replaceState(null, "", sectionHref(id));
  }

  function backToTop() {
    toTop();
    onSection("preview");
    title.current?.focus({ preventScroll: true });
  }

  function openCode() {
    setView("code");
    goTo("preview", { smooth: true, focus: true });
  }

  const pageUrl = `${window.location.origin}${window.location.pathname}${window.location.search}${href(itemPath(item), { v: active.variant })}`;

  return (
    <div className={styles.page}>
      <article ref={doc} className={styles.doc} aria-labelledby={`${viewBase}-titulo`}>
        <nav className={styles.crumbs} aria-label="You are here">
          <ol>
            <li><a href={href(block ? "/blocks" : "/components")}>{block ? "Blocks" : "Components"}</a></li>
            <li aria-hidden="true"><ChevronRight size={14} strokeWidth={1.75} /></li>
            <li aria-current="page">{item.title}</li>
          </ol>
        </nav>

        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h1 ref={title} id={`${viewBase}-titulo`} tabIndex={-1}>{item.title}</h1>
            <PlanBadge pro={pro} />
          </div>
          <p className={styles.lead}>{describe(item)}</p>
          <div className={styles.actionRow}>
            {pro ? <SiteButton to="/pricing" arrow>Unlock with Pro</SiteButton> : <InstallChip item={item} />}
            <div className={styles.actions}>
              <SaveButton item={item} />
              {pro ? null : <CopyPageButton item={item} pageUrl={pageUrl} previewHref={stage.previewHref} />}
            </div>
          </div>
        </header>

        {versions.length > 1 ? (
          <div className={styles.versionRow}>
            <span className={styles.versionLabel}>Version</span>
            <SegmentedLinks
              label="Version"
              className={styles.versionPicker}
              options={versions.map(version => ({
                key: versionKey(version),
                label: version.label,
                href: versionHref(version),
                current: versionKey(version) === versionKey(active),
                // Variante do mesmo item: troca no lugar, sem criar uma entrada nova no histórico.
                onClick: version.item.name === item.name ? (event: MouseEvent<HTMLAnchorElement>) => { if (!plainClick(event)) return; event.preventDefault(); navigate(itemPath(item), { replace: true, query: { v: version.variant } }); } : undefined,
              }))}
            />
            <span className={styles.versionCount}>{versions.length} versions</span>
          </div>
        ) : null}

        <section id="preview" className={styles.preview} data-toc="Preview" aria-label={`Demo and code for ${item.title}`} tabIndex={-1}>
          <div className={styles.viewBar}>
            <TabList
              base={viewBase}
              label={`View ${item.title}`}
              items={[
                { value: "preview", label: "Preview", icon: <Eye size={14} strokeWidth={1.75} aria-hidden="true" /> },
                ...(pro ? [] : [{ value: "code" as const, label: "Code", icon: <Code size={14} strokeWidth={1.75} aria-hidden="true" /> }]),
              ]}
              value={view}
              onChange={setView}
            />
            {view === "preview" ? <StageTools stage={stage} /> : null}
          </div>
          <div role="tabpanel" id={panelId(viewBase, view)} aria-labelledby={tabId(viewBase, view)} className={styles.viewPanel}>
            {view === "preview" ? <StagePanel stage={stage} /> : <SourcePanel item={item} registry={registry} />}
          </div>
        </section>

        <VersionsSection versions={versions} active={active} />
        <ListSection id="quando-usar" title="When to use" items={guide?.quandoUsar} />
        <ListSection id="quando-evitar" title="When not to use" items={guide?.quandoEvitar} linkItems current={item.name} />
        {pro ? (
          <Section id="instalacao" title="Get the source code">
            <div className={styles.locked}>
              <h3>This item is part of Pro</h3>
              <p>Unlock the source code of {item.title} and {proItems.length - 1} other Pro items for one payment of {PRICE}.</p>
              <SiteButton to="/pricing" size="lg" arrow>Unlock with Pro</SiteButton>
            </div>
          </Section>
        ) : (
          <>
            <InstallSection item={item} targets={registry.status === "ready" ? registry.data.files.map(file => file.target) : registry.status === "error" ? "error" : null} onOpenCode={openCode} />
            <UsageSection item={item} />
          </>
        )}
        {api.status === "ready" ? <ApiSection api={api.data} /> : null}
        <KeyboardSection rows={guide?.teclado} />
        <ListSection id="acessibilidade" title="Accessibility" items={guide?.acessibilidade} />
        <ListSection id="movimento" title="Motion" items={guide?.movimento} />
        <ListSection id="responsivo" title="Responsive behavior" items={guide?.responsivo} />
        <ListSection id="desempenho" title="Performance" items={guide?.desempenho} />
        {pro ? null : <AiNotesSection name={item.name} notes={guide?.notasIA} />}
        <RelatedSection items={related} />
        <MoreSection items={more} />

        <Pager item={item} />
        <footer className={styles.footline}>
          <span>ryan-ui · {items.length} items</span>
          <a href={asset("llms.txt")} target="_blank" rel="noreferrer">llms.txt</a>
        </footer>
      </article>

      <Toc className={styles.rail} toc={toc} hrefFor={sectionHref} onNavigate={onSection} markdownHref={pro ? undefined : markdownHref(item.name)} onTop={backToTop} />
    </div>
  );
}

/** Cada item é um documento novo: a chave zera a aba escolhida, o palco e o índice ao trocar de item. */
export function ItemPage({ item, route }: { item: CatalogItem; route: Route }) {
  return <ItemDocument key={item.name} item={item} route={route} />;
}
