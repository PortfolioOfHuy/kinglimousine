"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  CircleX,
  ExternalLink,
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

type ContactNotificationItem = {
  id: number;
  fullName: string;
  phone: string;
  subject: string | null;
  createdAt: string;
  status: "NEW" | "READ" | "REPLIED" | "SPAM";
};

type NotificationResponse = {
  unreadCount: number;
  items: ContactNotificationItem[];
};

function formatTimeAgo(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < hour) {
    const minutes = Math.max(1, Math.floor(diff / minute));
    return `${minutes} phút trước`;
  }

  if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} giờ trước`;
  }

  const days = Math.floor(diff / day);
  return `${days} ngày trước`;
}

export default function AdminTopbar({ onToggleSidebar }: Props) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<ContactNotificationItem[]>(
    [],
  );
  const [notificationLoading, setNotificationLoading] = useState(true);

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
    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/admin/contact-notifications", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Fetch notifications failed");
        }

        const data: NotificationResponse = await res.json();

        if (mounted) {
          setUnreadCount(data.unreadCount ?? 0);
          setNotifications(data.items ?? []);
        }
      } catch (error) {
        console.error("Fetch notifications failed:", error);
        if (mounted) {
          setUnreadCount(0);
          setNotifications([]);
        }
      } finally {
        if (mounted) {
          setNotificationLoading(false);
        }
      }
    };

    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 15000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setNotificationOpen(false);
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

      setMenuOpen(false);
      window.location.href = "/admin";
    } catch (error) {
      console.error("Clear cache failed:", error);
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

  const handleOpenNotification = () => {
    setNotificationOpen((prev) => !prev);
    setMenuOpen(false);
  };

  const handleOpenUserMenu = () => {
    setMenuOpen((prev) => !prev);
    setNotificationOpen(false);
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

      <div className={styles.topbarRight} ref={wrapperRef}>
        <div className={styles.quickActions}>
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className={styles.iconActionButton}
            aria-label="Mở trang chủ ở tab mới"
            title="Mở trang chủ"
          >
            <ExternalLink size={18} />
          </Link>

          <div className={styles.notificationWrap}>
            <button
              type="button"
              className={styles.iconActionButton}
              onClick={handleOpenNotification}
              aria-label="Thông báo liên hệ"
              title="Thông báo liên hệ"
            >
              <Bell size={18} />
              {unreadCount > 0 ? (
                <span className={styles.notificationBadge}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              ) : null}
            </button>

            {notificationOpen && (
              <div className={styles.notificationDropdown}>
                <div className={styles.notificationHeader}>
                  <span>Thông báo liên hệ</span>
                  <Link
                    href="/admin/contact-messages"
                    className={styles.notificationViewAll}
                    onClick={() => setNotificationOpen(false)}
                  >
                    Xem tất cả
                  </Link>
                </div>

                <div className={styles.notificationList}>
                  {notificationLoading ? (
                    <div className={styles.notificationEmpty}>Đang tải...</div>
                  ) : notifications.length ? (
                    notifications.map((item) => (
                      <Link
                        key={item.id}
                        href={`/admin/contact-messages?id=${item.id}`}
                        className={styles.notificationItem}
                        onClick={() => setNotificationOpen(false)}
                      >
                        <div className={styles.notificationTop}>
                          <strong className={styles.notificationName}>
                            {item.fullName}
                          </strong>
                          {item.status === "NEW" ? (
                            <span className={styles.notificationDot} />
                          ) : null}
                        </div>

                        <p className={styles.notificationText}>
                          {item.subject?.trim()
                            ? item.subject
                            : `SĐT: ${item.phone}`}
                        </p>

                        <span className={styles.notificationTime}>
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className={styles.notificationEmpty}>
                      Chưa có thông báo mới.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className={styles.userMenuButton}
          onClick={handleOpenUserMenu}
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