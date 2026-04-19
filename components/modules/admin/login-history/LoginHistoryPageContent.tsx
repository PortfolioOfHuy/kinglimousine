"use client";

import { useEffect, useState } from "react";
import styles from "./LoginHistoryPageContent.module.scss";

type LoginHistoryItem = {
  id: number;
  name: string;
  email: string;
  lastLoginAt: string | null;
  isActive: boolean;
};

type ResponseData = {
  user: LoginHistoryItem | null;
};

function formatDateTime(value?: string | null) {
  if (!value) return "Chưa có dữ liệu";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Không hợp lệ";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default function LoginHistoryPageContent() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<LoginHistoryItem | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/login-history", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        const data: ResponseData = await res.json();

        if (!res.ok) {
          throw new Error("Không thể tải lịch sử truy cập.");
        }

        if (mounted) {
          setUser(data.user);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải dữ liệu.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lịch sử truy cập</h1>
        <p className={styles.description}>
          Theo dõi trạng thái và thời điểm đăng nhập gần nhất của tài khoản hiện tại.
        </p>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p className={styles.note}>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className={styles.errorText}>{error}</p>
        ) : user ? (
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Tên tài khoản</span>
              <strong className={styles.value}>{user.name}</strong>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Email</span>
              <strong className={styles.value}>{user.email}</strong>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Trạng thái</span>
              <strong
                className={`${styles.badge} ${
                  user.isActive ? styles.active : styles.inactive
                }`}
              >
                {user.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Đăng nhập gần nhất</span>
              <strong className={styles.value}>
                {formatDateTime(user.lastLoginAt)}
              </strong>
            </div>
          </div>
        ) : (
          <p className={styles.note}>Không có dữ liệu truy cập.</p>
        )}
      </div>
    </div>
  );
}