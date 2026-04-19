"use client";

import "./login.scss";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Typography, Alert } from "antd";
import { LockKeyhole, ShieldCheck, User2 } from "lucide-react";

const { Title, Paragraph } = Typography;

export default function AdminLoginPageClient() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data?.message || "Đăng nhập thất bại.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setMessage("Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__overlay" />

      <div className="admin-login__wrapper">
        <div className="admin-login__brand">
          <div className="admin-login__brand-badge">
            <ShieldCheck size={18} />
            <span>Admin Dashboard</span>
          </div>

          <Title level={1} className="admin-login__brand-title">
            Quản trị hệ thống
            <br />
            đơn giản và an toàn
          </Title>

          <Paragraph className="admin-login__brand-desc">
            Đăng nhập để quản lý nội dung website, tin tức, blog, sản phẩm, SEO,
            thông tin liên hệ và các thiết lập hệ thống.
          </Paragraph>
        </div>

        <div className="admin-login__card">
          <div className="admin-login__card-top">
            <div className="admin-login__icon-wrap">
              <LockKeyhole size={22} />
            </div>

            <Title level={3} className="admin-login__title">
              Đăng nhập quản trị
            </Title>
          </div>

          <form onSubmit={handleSubmit} className="admin-login__form">
            <div className="admin-login__field">
              <label htmlFor="name" className="admin-login__label">
                Tên đăng nhập
              </label>
              <Input
                id="name"
                size="large"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                autoComplete="username"
                prefix={<User2 size={16} className="admin-login__input-icon" />}
                className="admin-login__input"
              />
            </div>

            <div className="admin-login__field">
              <label htmlFor="password" className="admin-login__label">
                Mật khẩu
              </label>
              <Input.Password
                id="password"
                size="large"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                prefix={
                  <LockKeyhole size={16} className="admin-login__input-icon" />
                }
                className="admin-login__input"
              />
            </div>

            {message ? (
              <Alert
                className="admin-login__alert"
                message={message}
                type="error"
                showIcon
              />
            ) : null}

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="admin-login__button"
              block
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}