import { Lock } from "lucide-react";
import styles from "./plan-badge.module.css";

/** A etiqueta do plano de um item. */
export function PlanBadge({ pro }: { pro: boolean }) {
  return pro
    ? <span className={styles.badge} data-plan="pro"><Lock size={11} aria-hidden="true" />Pro</span>
    : <span className={styles.badge}>Free</span>;
}
