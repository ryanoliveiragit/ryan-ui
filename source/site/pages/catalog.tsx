import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { ChevronRight, LayoutGrid, List, Lock, Search, SearchX, X } from "lucide-react";
import { EmptyState } from "@/registry/components/empty-state/empty-state";
import { ItemCard } from "@/site/components/item-card";
import { SiteButton } from "@/site/components/site-button";
import { categories, items, searchItems, type ItemKind } from "@/site/lib/catalog";
import { PRICE } from "@/site/lib/plans";
import { href, navigate, type Route } from "@/site/lib/router";
import { site } from "@/site/lib/site-config";
import styles from "./catalog.module.css";

const copy: Record<ItemKind, { title: string; lead: string; path: string; placeholder: string; other: { path: string; one: string; many: string } }> = {
  component: { title: "Components", lead: "Interface pieces with motion built in: buttons, fields, menus, charts, AI interfaces and more.", path: "/components", placeholder: "Search: button, date, chart…", other: { path: "/blocks", one: "Pro block", many: "Pro blocks" } },
  block: { title: "Blocks", lead: "Complete sections and screens built with the components: headers, heroes, sign-in, pricing and more.", path: "/blocks", placeholder: "Search: sign-in, pricing, footer…", other: { path: "/components", one: "Pro component", many: "Pro components" } },
};
const views = [
  { value: "grade", label: "Grid", icon: <LayoutGrid size={14} strokeWidth={1.75} aria-hidden="true" /> },
  { value: "lista", label: "List", icon: <List size={14} strokeWidth={1.75} aria-hidden="true" /> },
] as const;

/**
 * A galeria de um tipo de item: busca, categorias e planos em fichas e visão em grade ou lista.
 * O estado fica na URL (?q, ?cat, ?plan, ?ver), então dá para compartilhar e voltar.
 */
export function CatalogPage({ kind, route }: { kind: ItemKind; route: Route }) {
  const { title, lead, path, placeholder, other } = copy[kind];
  const category = kind === "component" ? route.query.get("cat") ?? "" : "";
  const plan = route.query.get("plan") ?? (route.query.get("novos") === "1" ? "pro" : "");
  const view = route.query.get("ver") === "lista" ? "lista" : "grade";
  const urlQuery = route.query.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const input = useRef<HTMLInputElement>(null);
  const pool = useMemo(() => items.filter(item => item.kind === kind), [kind]);
  const groups = useMemo(() => categories.filter(entry => entry.id !== "blocks").map(entry => ({ ...entry, count: pool.filter(item => item.category === entry.id).length })).filter(entry => entry.count > 0), [pool]);
  const proCount = useMemo(() => pool.filter(item => item.isNew).length, [pool]);
  const otherPro = useMemo(() => items.filter(item => item.kind !== kind && item.isNew).length, [kind]);
  const state = (next: { q?: string; cat?: string; plan?: string; ver?: string }) => ({
    q: (next.q ?? query).trim() || undefined,
    cat: (next.cat ?? category) || undefined,
    plan: (next.plan ?? plan) || undefined,
    ver: (next.ver ?? view) === "lista" ? "lista" : undefined,
  });

  useEffect(() => { document.title = `${title} · ${site.name}`; }, [title]);

  // A URL acompanha a busca sem criar uma entrada de histórico por tecla.
  const latest = useRef(state);
  useEffect(() => { latest.current = state; });
  const first = useRef(true);
  const pushed = useRef(urlQuery);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const timer = window.setTimeout(() => { const next = latest.current({}); pushed.current = next.q ?? ""; navigate(path, { replace: true, query: next }); }, 200);
    return () => window.clearTimeout(timer);
  }, [query, path]);
  // E o campo acompanha a URL quando ela muda por fora (voltar do navegador, um link para a galeria).
  useEffect(() => {
    if (urlQuery === pushed.current) return;
    pushed.current = urlQuery;
    setQuery(urlQuery);
  }, [urlQuery]);

  const results = useMemo(() => {
    let list = pool;
    if (category) list = list.filter(item => item.category === category);
    if (plan === "pro") list = list.filter(item => item.isNew);
    if (plan === "free") list = list.filter(item => !item.isNew);
    return searchItems(query, list);
  }, [query, category, plan, pool]);
  const filtering = Boolean(query.trim() || category || plan);

  /** Fichas e visão são links de verdade (dá para copiar o endereço), mas trocam o filtro sem empilhar histórico. */
  const go = (next: Parameters<typeof state>[0]) => ({
    href: href(path, state(next)),
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      navigate(path, { replace: true, query: state(next) });
    },
  });

  return (
    <div className={styles.page}>
      <nav className={styles.crumbs} aria-label="You are here">
        <ol>
          <li><a href={href("/")}>Home</a></li>
          <li aria-hidden="true"><ChevronRight size={14} strokeWidth={1.75} /></li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>
      <header className={`${styles.header} ${styles.headerRow}`}>
        <div>
          <h1>{title}</h1>
          <p className={styles.lead}>{lead}</p>
        </div>
        <SiteButton to="/pricing" arrow>Unlock all for {PRICE}</SiteButton>
      </header>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <Search size={15} strokeWidth={1.75} aria-hidden="true" />
          <span className={styles.visuallyHidden}>Search {title.toLowerCase()}</span>
          <input ref={input} type="search" placeholder={placeholder} value={query} autoComplete="off" spellCheck={false} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Escape" && query) { event.preventDefault(); setQuery(""); } }} />
          {query ? <button type="button" className={styles.clear} aria-label="Clear search" onClick={() => { setQuery(""); input.current?.focus(); }}><X size={14} strokeWidth={2} aria-hidden="true" /></button> : null}
        </label>
        <p className={styles.summary} role="status">{results.length === pool.length ? `${pool.length} items` : `${results.length} of ${pool.length} items`}</p>
        <div className={styles.views} role="group" aria-label="View">
          {views.map(option => <a key={option.value} className={styles.view} aria-current={view === option.value ? "true" : undefined} {...go({ ver: option.value })}>{option.icon}<span>{option.label}</span></a>)}
        </div>
      </div>

      <nav className={styles.chips} aria-label="Filter by category">
        <a className={styles.chip} aria-current={!category && !plan ? "true" : undefined} {...go({ cat: "", plan: "" })}>All<span className={styles.chipCount}>{pool.length}</span></a>
        {groups.map(entry => <a key={entry.id} className={styles.chip} aria-current={category === entry.id && !plan ? "true" : undefined} {...go({ cat: entry.id, plan: "" })}>{entry.label}<span className={styles.chipCount}>{entry.count}</span></a>)}
        <a className={styles.chip} aria-current={plan === "free" ? "true" : undefined} {...go({ cat: "", plan: "free" })}>Free<span className={styles.chipCount}>{pool.length - proCount}</span></a>
        <a className={styles.chip} aria-current={plan === "pro" ? "true" : undefined} {...go({ cat: "", plan: "pro" })}><Lock size={12} strokeWidth={2} aria-hidden="true" />Pro<span className={styles.chipCount}>{proCount}</span></a>
      </nav>
      {plan === "pro" && otherPro ? <p className={styles.note}>Included with Pro. <a href={href(other.path, { plan: "pro" })}>See also {otherPro} {otherPro === 1 ? other.one : other.many}</a></p> : null}

      {results.length ? (
        <ul className={styles.grid} data-view={view}>
          {results.map((item, index) => <li key={item.name} style={{ "--i": Math.min(index, 11) } as CSSProperties}><ItemCard item={item} priority={index < 8} layout={view === "lista" ? "row" : "card"} /></li>)}
        </ul>
      ) : (
        <div className={styles.empty}>
          <EmptyState
            icon={<SearchX aria-hidden="true" />}
            title="Nothing found"
            description={query.trim() ? `No item matches “${query.trim()}”${category || plan ? " in this filter" : ""}.` : "No items in this filter."}
            action={filtering ? <button type="button" className={styles.reset} onClick={() => { setQuery(""); navigate(path, { replace: true, query: { ver: view === "lista" ? "lista" : undefined } }); }}>Clear filters</button> : undefined}
          />
        </div>
      )}
    </div>
  );
}
