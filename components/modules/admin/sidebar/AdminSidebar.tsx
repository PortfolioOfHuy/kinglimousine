"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  FileText,
  FolderTree,
  LayoutDashboard,
  Package2,
  Settings,
  ShoppingBag,
  Tags,
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
    pathname.startsWith("/admin/tags") ||
    pathname.startsWith("/admin/products");

  const isImageGroupActive =
    pathname.startsWith("/admin/logo") ||
    pathname.startsWith("/admin/favicon") ||
    pathname.startsWith("/admin/slideshow");

  const isPostGroupActive =
    pathname.startsWith("/admin/services") ||
    pathname.startsWith("/admin/fleet") ||
    pathname.startsWith("/admin/how-to-book") ||
    pathname.startsWith("/admin/why-choose-us") ||
    pathname.startsWith("/admin/cta");

  const isPageGroupActive =
    pathname.startsWith("/admin/news") ||
    pathname.startsWith("/admin/posts") ||
    pathname.startsWith("/admin/about-us");

  const [productOpen, setProductOpen] = useState(isProductGroupActive);
  const [imageOpen, setImageOpen] = useState(isImageGroupActive);
  const [postOpen, setPostOpen] = useState(isPostGroupActive);
  const [pageOpen, setPageOpen] = useState(isPageGroupActive);

  useEffect(() => {
    setProductOpen(isProductGroupActive);
  }, [isProductGroupActive]);

  useEffect(() => {
    setImageOpen(isImageGroupActive);
  }, [isImageGroupActive]);

  useEffect(() => {
    setPostOpen(isPostGroupActive);
  }, [isPostGroupActive]);

  useEffect(() => {
    setPageOpen(isPageGroupActive);
  }, [isPageGroupActive]);

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
              className={`${styles.subNav} ${
                productOpen ? styles.subNavOpen : ""
              }`}
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
                  href="/admin/tags"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/tags")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <Tags size={16} />
                  <span>Thẻ sản phẩm</span>
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

          <div className={styles.navGroup}>
            <button
              type="button"
              className={`${styles.navGroupTrigger} ${
                isImageGroupActive ? styles.navGroupTriggerActive : ""
              }`}
              onClick={() => setImageOpen((prev) => !prev)}
            >
              <span className={styles.navGroupLeft}>
                <Users size={18} />
                <span>Quản lý hình ảnh</span>
              </span>

              <ChevronDown
                size={18}
                className={`${styles.navGroupArrow} ${
                  imageOpen ? styles.navGroupArrowOpen : ""
                }`}
              />
            </button>

            <div
              className={`${styles.subNav} ${
                imageOpen ? styles.subNavOpen : ""
              }`}
            >
              <div className={styles.subNavInner}>
                <Link
                  href="/admin/logo"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/logo")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <span>Logo</span>
                </Link>

                <Link
                  href="/admin/favicon"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/favicon")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <span>Favicon</span>
                </Link>

                <Link
                  href="/admin/slideshow"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/slideshow")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <span>Slideshow</span>
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.navGroup}>
            <button
              type="button"
              className={`${styles.navGroupTrigger} ${
                isPostGroupActive ? styles.navGroupTriggerActive : ""
              }`}
              onClick={() => setPostOpen((prev) => !prev)}
            >
              <span className={styles.navGroupLeft}>
                <FileText size={18} />
                <span>Quản lý bài viết</span>
              </span>

              <ChevronDown
                size={18}
                className={`${styles.navGroupArrow} ${
                  postOpen ? styles.navGroupArrowOpen : ""
                }`}
              />
            </button>

            <div
              className={`${styles.subNav} ${postOpen ? styles.subNavOpen : ""}`}
            >
              <div className={styles.subNavInner}>
                <Link
                  href="/admin/services"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/services")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <span>Dịch vụ của chúng tôi</span>
                </Link>

                <Link
                  href="/admin/how-to-book"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/how-to-book")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <span>Làm thế nào để đặt xe</span>
                </Link>

                <Link
                  href="/admin/why-choose-us"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/why-choose-us") &&
                    !pathname.startsWith("/admin/why-choose-us/items")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <span>Vì sao chọn chúng tôi</span>
                </Link>

                <Link
                  href="/admin/why-choose-us/items"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/why-choose-us/items")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <span>Các lý do nổi bật</span>
                </Link>

                <Link
                  href="/admin/cta"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/cta")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <span>CTA Trang chủ</span>
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.navGroup}>
            <button
              type="button"
              className={`${styles.navGroupTrigger} ${
                isPageGroupActive ? styles.navGroupTriggerActive : ""
              }`}
              onClick={() => setPageOpen((prev) => !prev)}
            >
              <span className={styles.navGroupLeft}>
                <BookOpen size={18} />
                <span>Quản lý page</span>
              </span>

              <ChevronDown
                size={18}
                className={`${styles.navGroupArrow} ${
                  pageOpen ? styles.navGroupArrowOpen : ""
                }`}
              />
            </button>

            <div
              className={`${styles.subNav} ${pageOpen ? styles.subNavOpen : ""}`}
            >
              <div className={styles.subNavInner}>
                <Link
                  href="/admin/news"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/news")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <span>Tin tức</span>
                </Link>

                <Link
                  href="/admin/posts"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/posts")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <span>Bài viết</span>
                </Link>

                <Link
                  href="/admin/about-us"
                  className={`${styles.subNavItem} ${
                    pathname.startsWith("/admin/about-us")
                      ? styles.subNavItemActive
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <span>Giới thiệu</span>
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/admin/settings"
            className={`${styles.navItem} ${
              pathname.startsWith("/admin/settings") ? styles.active : ""
            }`}
            onClick={onClose}
          >
            <Settings size={18} />
            <span>Thiết lập thông tin</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
