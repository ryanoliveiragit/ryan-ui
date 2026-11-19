import { BrandMark } from "@/site/components/brand";
import { href } from "@/site/lib/router";
import { site } from "@/site/lib/site-config";
import styles from "./site-footer.module.css";

/** O rodapé de todas as páginas. O crédito ao núcleo MIT é obrigatório e fica sempre visível. */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.about}>
          <a className={styles.brand} href={href("/")}><BrandMark size={22} /><span>{site.name}</span></a>
          <p>{site.counts.components} components and {site.counts.blocks} blocks for React.</p>
        </div>
        <nav className={styles.links} aria-label="Footer">
          <a href={href("/components")}>Components</a>
          <a href={href("/blocks")}>Blocks</a>
          <a href={href("/pricing")}>Pricing</a>
          <a href={href("/docs")}>Docs</a>
          <a href={href("/saved")}>Saved</a>
          <a href={href("/docs/license")}>License and credits</a>
        </nav>
      </div>
      <p className={styles.credit}>
        Based on the open source core of <a href={site.upstream.repository} target="_blank" rel="noreferrer">Arc</a> by Elia Kuratli, under the MIT license. The original copyright notice is in <a href={href("/docs/license")}>License and credits</a>.
      </p>
    </footer>
  );
}
