import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { href } from "@/site/lib/router";
import styles from "./site-button.module.css";

interface SiteButtonProps { to: string; query?: Record<string, string | undefined>; variant?: "primary" | "line"; size?: "md" | "lg"; arrow?: boolean; children: ReactNode }

/** O botão-link do site: pílula cheia na cor de destaque ou contornada. */
export function SiteButton({ to, query, variant = "primary", size = "md", arrow = false, children }: SiteButtonProps) {
  return <a className={styles.button} data-variant={variant} data-size={size} href={href(to, query)}>{children}{arrow ? <ArrowRight size={16} aria-hidden="true" /> : null}</a>;
}
export { styles as siteButtonStyles };
