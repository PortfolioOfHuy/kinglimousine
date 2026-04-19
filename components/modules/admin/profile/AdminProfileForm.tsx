"use client";

import { useEffect, useState } from "react";
import styles from "./AdminProfileForm.module.scss";

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

export default function AdminProfileForm() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchMe = async () => {
      try {
        const res = await fetch("/api/admin/me", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        const data: MeResponse = await res.json();

        if (!res.ok || !data?.user) {
          throw new Error("Không thể tải thông tin tài khoản.");
        }

        if (mounted) {
          setUser(data.user);
          setName(data.user.name || "");
          setEmail(data.user.email || "");
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Đã xảy ra lỗi.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchMe();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Vui lòng nhập tên hiển thị.");
      return;
    }

    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Cập nhật thông tin thất bại.");
      }

      setUser(data.user);
      setName(data.user.name || "");
      setEmail(data.user.email || "");
      setMessage("Cập nhật thông tin tài khoản thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Thông tin tài khoản</h1>
        <p className={styles.description}>
          Cập nhật thông tin quản trị viên đang đăng nhập.
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Thông tin chung</h2>

          {loading ? (
            <p className={styles.note}>Đang tải dữ liệu...</p>
          ) : user ? (
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>ID</span>
                <span className={styles.infoValue}>#{user.id}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Trạng thái</span>
                <span
                  className={`${styles.badge} ${
                    user.isActive ? styles.active : styles.inactive
                  }`}
                >
                  {user.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Lần đăng nhập gần nhất</span>
                <span className={styles.infoValue}>
                  {formatDateTime(user.lastLoginAt)}
                </span>
              </div>
            </div>
          ) : (
            <p className={styles.errorText}>
              {error || "Không tải được thông tin tài khoản."}
            </p>
          )}
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Chỉnh sửa tài khoản</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Tên hiển thị
              </label>
              <input
                id="name"
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên hiển thị"
                disabled={loading || !user || submitting}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
                disabled={loading || !user || submitting}
              />
            </div>

            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || !user || submitting}
              >
                {submitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>

            {message ? <p className={styles.successText}>{message}</p> : null}
            {error ? <p className={styles.errorText}>{error}</p> : null}
          </form>
        </div>
      </div>
    </div>
  );
}