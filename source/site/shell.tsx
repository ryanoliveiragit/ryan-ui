import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Compass, TriangleAlert, X } from "lucide-react";
import { EmptyState } from "@/registry/components/empty-state/empty-state";
import { BrandMark } from "@/site/components/brand";
import SearchPalette from "@/site/components/search-palette";
import { SiteSidebar, useSidebarState } from "@/site/components/sidebar";
import { SiteFooter } from "@/site/components/site-footer";
import { SiteHeader } from "@/site/components/site-header";
import { findItem } from "@/site/lib/catalog";
import { href, navigate, useRoute } from "@/site/lib/router";
import { site } from "@/site/lib/site-config";
import { CatalogPage } from "@/site/pages/catalog";
import { DocsPage, type DocsPageId } from "@/site/pages/docs";
import { HomePage } from "@/site/pages/home";
import { PricingPage } from "@/site/pages/pricing";
import { SavedPage } from "@/site/pages/saved";
import styles from "./shell.module.css";

/** A página de item é a mais pesada e fica num chunk à parte: o início e as galerias não esperam por ela. */
const loadItemPage = () => import("@/site/pages/item");
const ItemPage = lazy(() => loadItemPage().then(module => ({ default: module.ItemPage })));

const docPages: Record<string, DocsPageId> = { theming: "theming", license: "license" };
/** Endereços antigos do site, em português: os links que já circulam continuam abrindo a página certa. */
const legacyPaths: Record<string, string> = { "/componentes": "/components", "/blocos": "/blocks", "/salvos": "/saved", "/docs/instalacao": "/docs", "/docs/temas": "/docs/theming", "/docs/licenca": "/docs/license" };

/** A partir desta largura o menu lateral fica na página; abaixo dela, vira gaveta. */
const WIDE = "(min-width: 64rem)";
function useMediaQuery(query: string) {
  return useSyncExternalStore(
    notify => { const list = window.matchMedia(query); list.addEventListener("change", notify); return () => list.removeEventListener("change", notify); },
    () => window.matchMedia(query).matches,
  );
}

function NotFound() {
  return (
    <div className={styles.notFound}>
      <EmptyState
        label="Page not found"
        icon={<Compass size={28} aria-hidden="true" />}
        title="Page not found"
        description="This address doesn't exist on this site. Check the link or go back home."
        action={<a className={styles.notFoundLink} href={href("/")}>Back to home</a>}
      />
    </div>
  );
}

/** Se uma página quebra ao carregar ou ao desenhar, o cabeçalho continua de pé e a pessoa pode ir para outra. */
class PageBoundary extends Component<{ resetKey: string; children: ReactNode }, { error: Error | null; resetKey: string }> {
  state = { error: null as Error | null, resetKey: this.props.resetKey };
  static getDerivedStateFromError(error: unknown) { return { error: error instanceof Error ? error : new Error(String(error)) }; }
  static getDerivedStateFromProps(props: { resetKey: string }, state: { error: Error | null; resetKey: string }) {
    return props.resetKey === state.resetKey ? null : { error: null, resetKey: props.resetKey };
  }
  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div className={styles.notFound}>
        <EmptyState
          label="This page didn't open"
          icon={<TriangleAlert size={26} aria-hidden="true" />}
          title="This page didn't open"
          description="Something broke while loading this page. Reload it or pick another page."
          action={<button type="button" className={styles.notFoundLink} onClick={() => window.location.reload()}>Reload</button>}
        />
        <pre className={styles.errorDetail}>{error.message}</pre>
      </div>
    );
  }
}

/**
 * A casca do site. Início, preços e 404 ocupam uma coluna central; catálogo, itens, docs e salvos têm o menu lateral,
 * que fica montado enquanto se navega entre essas páginas (rolagem, grupos recolhidos, filtro e busca continuam).
 */
export default function Shell() {
  const route = useRoute();
  const wide = useMediaQuery(WIDE);
  const sidebar = useSidebarState();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const railSearch = useRef<HTMLInputElement>(null);
  const drawerSearch = useRef<HTMLInputElement>(null);
  /** A gaveta foi aberta pela tecla "/": o foco vai para a busca dela. */
  const focusDrawerSearch = useRef(false);
  const [section, name] = route.segments;
  const legacy = legacyPaths[route.path];

  const item = section === "c" || section === "b" ? findItem(name) : undefined;
  let page: ReactNode = <NotFound />;
  let missing = !legacy;
  let framed = false;
  if (legacy) page = null;
  else if (section === undefined) { page = <HomePage />; missing = false; }
  else if (section === "components" && !name) { page = <CatalogPage key="component" kind="component" route={route} />; missing = false; framed = true; }
  else if (section === "blocks" && !name) { page = <CatalogPage key="block" kind="block" route={route} />; missing = false; framed = true; }
  else if (item) { page = <ItemPage item={item} route={route} />; missing = false; framed = true; }
  else if (section === "pricing" && !name) { page = <PricingPage />; missing = false; }
  else if (section === "docs" && !name) { page = <DocsPage page="installation" />; missing = false; framed = true; }
  else if (section === "docs" && name && docPages[name]) { page = <DocsPage page={docPages[name]} />; missing = false; framed = true; }
  else if (section === "saved" && !name) { page = <SavedPage />; missing = false; framed = true; }

  useEffect(() => { if (legacy) navigate(legacy, { replace: true, query: Object.fromEntries(route.query) }); }, [legacy, route.query]);
  useEffect(() => { if (missing) document.title = `Page not found · ${site.name}`; }, [missing]);

  // Troca de página: volta ao topo sem animação e fecha busca e gaveta, se abertas.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
    setSearchOpen(false);
    setMenuOpen(false);
  }, [route.path]);

  // Abrir um item mostra o grupo dele no menu lateral, mesmo que estivesse recolhido.
  const { openGroup } = sidebar;
  const itemName = item?.name, itemCategory = item?.category;
  useEffect(() => { if (itemName && itemCategory) openGroup(itemCategory); }, [itemName, itemCategory, openGroup]);

  // Com a casca no ar, a página de item já vai sendo baixada: o primeiro clique num item não espera.
  useEffect(() => { const timer = window.setTimeout(() => { loadItemPage().catch(() => { /* a falha aparece quando a página for aberta */ }); }, 1500); return () => window.clearTimeout(timer); }, []);

  // A gaveta só existe em telas estreitas.
  useEffect(() => { if (wide) setMenuOpen(false); }, [wide]);

  // ⌘K / Ctrl+K abre a busca geral; "/" (fora de campos de texto) leva o foco à busca do menu lateral.
  const state = useRef({ wide, framed, menuOpen });
  useEffect(() => { state.current = { wide, framed, menuOpen }; }, [wide, framed, menuOpen]);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setMenuOpen(false); setSearchOpen(true); return; }
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)) return;
      event.preventDefault();
      const now = state.current;
      if (now.menuOpen) drawerSearch.current?.focus();
      else if (!now.wide) { focusDrawerSearch.current = true; setMenuOpen(true); }
      else if (now.framed) railSearch.current?.focus();
      else setSearchOpen(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const content = <PageBoundary resetKey={route.path}><Suspense fallback={<div className={styles.pending} aria-busy="true" />}>{page}</Suspense></PageBoundary>;

  return (
    <div className={styles.app} data-site-chrome="1" data-framed={framed || undefined}>
      <button type="button" className={styles.skip} onClick={() => mainRef.current?.focus()}>Skip to content</button>
      <SiteHeader route={route} menuOpen={menuOpen} menuRef={menuButton} onOpenMenu={() => { focusDrawerSearch.current = false; setMenuOpen(true); }} onOpenSearch={() => setSearchOpen(true)} />
      {framed ? (
        <div className={styles.frame}>
          {wide ? <SiteSidebar route={route} state={sidebar} searchRef={railSearch} /> : null}
          <main ref={mainRef} className={styles.framedMain} tabIndex={-1}>{content}</main>
        </div>
      ) : <main ref={mainRef} className={styles.main} tabIndex={-1}>{content}</main>}
      <SiteFooter />

      {wide ? null : (
        <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className={styles.overlay} />
            <DialogPrimitive.Content
              className={styles.drawer}
              aria-describedby={undefined}
              onOpenAutoFocus={event => { if (focusDrawerSearch.current) { event.preventDefault(); focusDrawerSearch.current = false; drawerSearch.current?.focus(); } }}
              onCloseAutoFocus={event => { event.preventDefault(); menuButton.current?.focus(); }}
              onEscapeKeyDown={event => { if (sidebar.query && document.activeElement === drawerSearch.current) event.preventDefault(); }}
            >
              <div className={styles.drawerHeader}>
                <DialogPrimitive.Title className={styles.drawerTitle}><BrandMark size={22} /><span>{site.name}</span><span className={styles.visuallyHidden}>: menu</span></DialogPrimitive.Title>
                <DialogPrimitive.Close className={styles.drawerClose} aria-label="Close menu"><X size={18} strokeWidth={1.75} aria-hidden="true" /></DialogPrimitive.Close>
              </div>
              <SiteSidebar route={route} state={sidebar} variant="drawer" searchRef={drawerSearch} onNavigate={closeMenu} />
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}

      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
