"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  CircleX,
  History,
  Lock,
  Menu,
  Power,
  User,
} from "lucide-react";
import styles from "./admin-topbar.module.scss";

type Props = {
  onToggleSidebar: () => void;
};

type AdminUser = {
  id: number;
  name: string;
  email?: string;
  isActive: boolean;
  lastLoginAt?: string | null;
};

type MeResponse = {
  user: AdminUser | null;
};

export default function AdminTopbar({ onToggleSidebar }: Props) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchAdmin = async () => {
      try {
        const res = await fetch("/api/admin/me", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        const data: MeResponse = await res.json();

        if (!res.ok || !data?.user) {
          throw new Error("Unauthorized");
        }

        if (mounted) {
          setAdmin(data.user);
        }
      } catch (error) {
        console.error("Fetch admin failed:", error);
        if (mounted) {
          setAdmin(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAdmin();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClearCache = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();

      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }

      router.refresh();
    } catch (error) {
      console.error("Clear cache failed:", error);
    } finally {
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setMenuOpen(false);
      router.replace("/admin/login");
      router.refresh();
    }
  };

  const adminName = admin?.name?.trim() || "Admin";

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={onToggleSidebar}
          aria-label="Mở menu"
        >
          <Menu size={20} />
        </button>

        <h1 className={styles.greeting}>
          Xin chào, {loading ? "..." : adminName}
        </h1>
      </div>

      <div className={styles.topbarRight} ref={dropdownRef}>
        <button
          type="button"
          className={styles.userMenuButton}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className={styles.userMenuText}>
            {loading ? "..." : adminName}
          </span>
          <ChevronDown
            size={18}
            className={menuOpen ? styles.chevronOpen : ""}
          />
        </button>

        {menuOpen && (
          <div className={styles.dropdown}>
            <Link
              href="/admin/profile"
              className={styles.dropdownItem}
              onClick={() => setMenuOpen(false)}
            >
              <User size={17} />
              <span>Thông tin admin</span>
            </Link>

            <Link
              href="/admin/change-password"
              className={styles.dropdownItem}
              onClick={() => setMenuOpen(false)}
            >
              <Lock size={17} />
              <span>Đổi mật khẩu</span>
            </Link>

            <Link
              href="/admin/login-history"
              className={styles.dropdownItem}
              onClick={() => setMenuOpen(false)}
            >
              <History size={17} />
              <span>Lịch sử truy cập</span>
            </Link>

            <button
              type="button"
              className={styles.dropdownItem}
              onClick={handleClearCache}
            >
              <CircleX size={17} />
              <span>Xóa bộ nhớ tạm</span>
            </button>

            <div className={styles.dropdownDivider} />

            <button
              type="button"
              className={`${styles.dropdownItem} ${styles.logoutItem}`}
              onClick={handleLogout}
            >
              <Power size={17} />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
