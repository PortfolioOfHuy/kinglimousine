"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  FolderTree,
  LayoutDashboard,
  Package2,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import styles from "./admin-sidebar.module.scss";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  const isProductGroupActive =
    pathname.startsWith("/admin/product-categories") ||
    pathname.startsWith("/admin/products");

  const [productOpen, setProductOpen] = useState(isProductGroupActive);

  useEffect(() => {
    if (isProductGroupActive) {
      setProductOpen(true);
    }
  }, [isProductGroupActive]);

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayShow : ""}`}
        onClick={onClose}
      />

      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>ADMIN PANEL</div>
        </div>

        <nav className={styles.nav}>
          <Link
            href="/admin"
            className={`${styles.navItem} ${
              pathname === "/admin" ? styles.active : ""
            }`}
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            <span>Bảng điều khiển</span>
          </Link>

          <div className={styles.navGroup}>
            <button
              type="button"
              className={`${styles.navGroupTrigger} ${
                isProductGroupActive ? styles.navGroupTriggerActive : ""
              }`}
              onClick={() => setProductOpen((prev) => !prev)}
            >
              <span className={styles.navGroupLeft}>
                <Package2 size={18} />
                <span>Quản lý sản phẩm</span>
              </span>

              <ChevronDown
                size={18}
                className={`${styles.navGroupArrow} ${
                  productOpen ? styles.navGroupArrowOpen : ""
                }`}
              />
            </button>

            <div
              className={`${styles.subNav} ${productOpen ? styles.subNavOpen : ""}`}
            >
              <div className={styles.subNavInner}>
                <Link
                  href="/admin/product-categories"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/product-categories")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <FolderTree size={16} />
                  <span>Danh mục cấp 1</span>
                </Link>

                <Link
                  href="/admin/products"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/products")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <ShoppingBag size={16} />
                  <span>Sản phẩm</span>
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/admin/users"
            className={`${styles.navItem} ${
              pathname.startsWith("/admin/users") ? styles.active : ""
            }`}
            onClick={onClose}
          >
            <Users size={18} />
            <span>Người dùng</span>
          </Link>

          <Link
            href="/admin/settings"
            className={`${styles.navItem} ${
              pathname.startsWith("/admin/settings") ? styles.active : ""
            }`}
            onClick={onClose}
          >
            <Settings size={18} />
            <span>Cài đặt</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
