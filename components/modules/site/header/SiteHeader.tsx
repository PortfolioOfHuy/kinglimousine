"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Drawer } from "antd";
import styles from "./SiteHeader.module.scss";

type Props = {
  logo?: string | null;
  logoAlt?: string;
  siteName?: string;
};

export default function SiteHeader({
  logo,
  logoAlt = "Logo",
  siteName = "KING LIMOUSINE",
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={clsx(styles.header, scrolled && styles.scrolled)}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <button
              type="button"
              aria-label="Open menu"
              className={styles.iconButton}
              onClick={() => setDrawerOpen(true)}
            >
              <span className={styles.menuIcon}>
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>

          <div className={styles.center}>
            <Link href="/" className={styles.logoLink}>
              {logo ? (
                <Image
                  src={logo}
                  alt={logoAlt}
                  width={110}
                  height={64}
                  priority
                  className={styles.logo}
                />
              ) : (
                <span className={styles.siteName}>{siteName}</span>
              )}
            </Link>
          </div>

          <div className={styles.right}>
            <button
              type="button"
              aria-label="Search"
              className={styles.iconButton}
            >
              <span className={styles.searchIcon} />
            </button>
          </div>
        </div>

        <div className={styles.bottomLine} />
      </header>

      <Drawer
        title="Menu"
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <nav className={styles.drawerNav}>
          <Link href="/" onClick={() => setDrawerOpen(false)}>
            Trang chủ
          </Link>
          <Link href="/gioi-thieu" onClick={() => setDrawerOpen(false)}>
            Giới thiệu
          </Link>
          <Link href="/dich-vu" onClick={() => setDrawerOpen(false)}>
            Dịch vụ
          </Link>
          <Link href="/tin-tuc" onClick={() => setDrawerOpen(false)}>
            Tin tức
          </Link>
          <Link href="/lien-he" onClick={() => setDrawerOpen(false)}>
            Liên hệ
          </Link>
        </nav>
      </Drawer>
    </>
  );
}
