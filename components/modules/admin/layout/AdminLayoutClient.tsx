"use client";

import { useState } from "react";
import AdminSidebar from "../sidebar/AdminSidebar";
import AdminTopbar from "../topbar/AdminTopbar";
import styles from "./admin-layout.module.scss";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={styles.main}>
        <AdminTopbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className={styles.content}>
          <div className={styles.contentInner}>{children}</div>
        </main>
      </div>
    </div>
  );
}
