import type { ReactNode } from "react";
import styles from "./layout.module.scss";
import { fontInter } from "./fonts";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${styles.container} ${fontInter.variable}`}>
      {children}
    </div>
  );
}
