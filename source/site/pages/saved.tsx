import { useEffect } from "react";
import { Bookmark, X } from "lucide-react";
import { ItemCard } from "@/site/components/item-card";
import { findItem, type CatalogItem } from "@/site/lib/catalog";
import { href } from "@/site/lib/router";
import { toggleSaved, useSaved } from "@/site/lib/saved";
import { site } from "@/site/lib/site-config";
import gallery from "./catalog.module.css";
import styles from "./saved.module.css";

/** Os itens que a pessoa salvou com o botão "Salvar" da página de item. Ficam só neste navegador (ver site/lib/saved.ts). */
export function SavedPage() {
  const saved = useSaved();
  const list = saved.map(findItem).filter((item): item is CatalogItem => Boolean(item));
  useEffect(() => { document.title = `Saved · ${site.name}`; }, []);

  return (
    <div className={gallery.page}>
      <header className={gallery.header}>
        <h1>Saved</h1>
        <p className={gallery.lead}>Items you saved for later. This list stays in this browser.</p>
      </header>

      {list.length ? (
        <>
          <div className={styles.bar}>
            <p className={styles.summary} role="status">{list.length} saved {list.length === 1 ? "item" : "items"}</p>
          </div>
          <ul className={`${gallery.grid} ${styles.grid}`}>
            {list.map((item, index) => (
              <li key={item.name} className={styles.entry}>
                <ItemCard item={item} priority={index < 8} />
                <button type="button" className={styles.remove} aria-label={`Remove ${item.title} from saved`} title="Remove from saved" onClick={() => toggleSaved(item.name)}>
                  <X size={14} strokeWidth={2} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <section className={styles.empty} aria-labelledby="saved-empty">
          <span className={styles.emptyIcon} aria-hidden="true"><Bookmark size={20} strokeWidth={1.75} /></span>
          <h2 id="saved-empty">Nothing saved yet</h2>
          <p>Open any component or block and press <span className={styles.sample}><Bookmark size={13} strokeWidth={1.75} aria-hidden="true" />Save</span> to keep it here.</p>
          <div className={styles.emptyActions}>
            <a className={styles.primary} href={href("/components")}>Browse components</a>
            <a className={styles.secondary} href={href("/blocks")}>Browse blocks</a>
          </div>
        </section>
      )}

    </div>
  );
}
