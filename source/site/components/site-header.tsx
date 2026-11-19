import type { Ref } from "react";
import { Bookmark, Menu, Moon, Search, Sun } from "lucide-react";
import { Tooltip } from "@/registry/components/tooltip/tooltip";
import { BrandMark } from "@/site/components/brand";
import { SiteButton } from "@/site/components/site-button";
import { href, type Route } from "@/site/lib/router";
import { isMac, site } from "@/site/lib/site-config";
import { useTheme } from "@/site/lib/theme";
import { switchTheme } from "@/site/lib/theme-transition";
import styles from "./site-header.module.css";

/** Links do cabeçalho. `match` diz em que rotas o link fica marcado. */
const links = [
  { path: "/components", label: "Components", match: ["components", "c"] },
  { path: "/blocks", label: "Blocks", match: ["blocks", "b"] },
  { path: "/pricing", label: "Pricing", match: ["pricing"] },
  { path: "/docs", label: "Docs", match: ["docs"] },
];

/** Alterna entre tema claro e escuro. */
function ThemeToggle() {
  const { theme } = useTheme();
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <Tooltip content={label} side="bottom">
      <button type="button" className={styles.icon} aria-label={label} onClick={event => switchTheme(theme === "dark" ? "light" : "dark", event.currentTarget, "reveal")}>
        {theme === "dark" ? <Sun size={17} strokeWidth={1.75} aria-hidden="true" /> : <Moon size={17} strokeWidth={1.75} aria-hidden="true" />}
      </button>
    </Tooltip>
  );
}

/** A barra do topo. Em telas estreitas o botão de menu abre a gaveta com o catálogo. */
export function SiteHeader({ route, menuOpen, menuRef, onOpenMenu, onOpenSearch }: { route: Route; menuOpen: boolean; menuRef?: Ref<HTMLButtonElement>; onOpenMenu: () => void; onOpenSearch: () => void }) {
  const shortcut = isMac() ? "⌘ K" : "Ctrl K";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href={href("/")} aria-label={`${site.name}, home`}><BrandMark size={24} /><span>{site.name}</span></a>
        <nav className={styles.nav} aria-label="Main">
          {links.map(link => <a key={link.path} href={href(link.path)} aria-current={link.match.includes(route.segments[0] ?? "") ? "page" : undefined}>{link.label}</a>)}
        </nav>
        <div className={styles.actions}>
          <button type="button" className={styles.search} aria-keyshortcuts="Control+K Meta+K" onClick={onOpenSearch}>
            <Search size={15} strokeWidth={1.75} aria-hidden="true" /><span>Search</span><kbd>{shortcut}</kbd>
          </button>
          <a className={styles.icon} href={href("/saved")} aria-label="Saved items"><Bookmark size={17} strokeWidth={1.75} aria-hidden="true" /></a>
          <ThemeToggle />
          <SiteButton to="/pricing">Get Pro</SiteButton>
          <button ref={menuRef} type="button" className={`${styles.icon} ${styles.menu}`} aria-label="Open menu" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={onOpenMenu}>
            <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
