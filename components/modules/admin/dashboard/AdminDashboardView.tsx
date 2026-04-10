"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Globe, Lock, Mail, Package2, Settings, Users } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./admin-dashboard.module.scss";

type DashboardData = {
  month: number;
  year: number;
  summary: {
    totalUsers: number;
    totalProducts: number;
    totalContacts: number;
    liveOnline: number;
    weekVisits: number;
    monthVisits: number;
    totalVisits: number;
    monthUniqueVisits: number;
    monthContactCount: number;
  };
  lineData: Array<{
    dayLabel: string;
    day: number;
    totalVisits: number;
    uniqueVisits: number;
    contactCount: number;
  }>;
  browserStats: Array<{
    name: string;
    value: number;
  }>;
  deviceStats: Array<{
    name: string;
    value: number;
  }>;
  topIpStats: Array<{
    name: string;
    value: number;
  }>;
};

type Props = {
  data: DashboardData;
};

const PIE_COLORS = [
  "var(--admin-primary)",
  "#60a5fa",
  "var(--admin-warning)",
  "#f87171",
];

export default function AdminDashboardView({ data }: Props) {
  const [liveOnline, setLiveOnline] = useState(data.summary.liveOnline);

  useEffect(() => {
    const fetchLiveOnline = async () => {
      try {
        const res = await fetch("/api/admin/live-online", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = await res.json();

        if (res.ok && typeof json.liveOnline === "number") {
          setLiveOnline(json.liveOnline);
        }
      } catch (error) {
        console.error("Fetch live online failed:", error);
      }
    };

    fetchLiveOnline();

    const interval = window.setInterval(fetchLiveOnline, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const overviewData = useMemo(
    () => [
      { name: "Đang online", value: liveOnline },
      { name: "Trong tuần", value: data.summary.weekVisits },
      { name: "Trong tháng", value: data.summary.monthVisits },
      { name: "Tổng truy cập", value: data.summary.totalVisits },
    ],
    [
      liveOnline,
      data.summary.weekVisits,
      data.summary.monthVisits,
      data.summary.totalVisits,
    ],
  );

  const totalDevice = data.deviceStats.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Bảng điều khiển</h2>

      <section className={styles.quickGrid}>
        <Link href="/admin/settings" className={styles.quickCard}>
          <span className={`${styles.quickIcon} ${styles.iconGold}`}>
            <Settings size={22} />
          </span>
          <div>
            <h3>Cấu hình website</h3>
            <p>Xem chi tiết</p>
          </div>
        </Link>

        <Link href="/admin/users" className={styles.quickCard}>
          <span className={`${styles.quickIcon} ${styles.iconGreen}`}>
            <Users size={22} />
          </span>
          <div>
            <h3>Tài khoản</h3>
            <p>{data.summary.totalUsers} tài khoản hoạt động</p>
          </div>
        </Link>

        <Link href="/admin/change-password" className={styles.quickCard}>
          <span className={`${styles.quickIcon} ${styles.iconBlue}`}>
            <Lock size={22} />
          </span>
          <div>
            <h3>Đổi mật khẩu</h3>
            <p>Cập nhật bảo mật đăng nhập</p>
          </div>
        </Link>

        <Link href="/admin/contacts" className={styles.quickCard}>
          <span className={`${styles.quickIcon} ${styles.iconSky}`}>
            <Mail size={22} />
          </span>
          <div>
            <h3>Thư liên hệ</h3>
            <p>{data.summary.totalContacts} liên hệ</p>
          </div>
        </Link>
      </section>

      <section className={styles.chartSection}>
        <div className={styles.chartCard}>
          <div className={styles.sectionHead}>
            <h3>
              Thống kê truy cập tháng {String(data.month).padStart(2, "0")}/
              {data.year}
            </h3>

            <div className={styles.headStats}>
              <span>Tổng: {data.summary.monthVisits}</span>
              <span>Unique: {data.summary.monthUniqueVisits}</span>
              <span>Liên hệ: {data.summary.monthContactCount}</span>
            </div>
          </div>

          <div className={styles.lineChartWrap}>
            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={data.lineData}>
                <CartesianGrid stroke="var(--admin-border)" vertical={false} />
                <XAxis dataKey="dayLabel" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="totalVisits"
                  stroke="var(--admin-primary)"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.sideCard}>
          <h3>Thống kê truy cập</h3>

          <div className={styles.donutWrap}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={overviewData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {overviewData.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.onlineBox}>
            <span>Đang online</span>
            <strong>{liveOnline}</strong>
          </div>

          <ul className={styles.legendList}>
            {overviewData.map((item, index) => (
              <li key={item.name}>
                <span
                  className={styles.legendDot}
                  style={{ background: PIE_COLORS[index % PIE_COLORS.length] }}
                />
                <span>{item.name}</span>
                <strong>{item.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.bottomGrid}>
        <div className={styles.infoCard}>
          <h3>Thống kê trình duyệt</h3>
          <ul className={styles.dataList}>
            {data.browserStats.map((item) => (
              <li key={item.name}>
                <span>{item.name}</span>
                <strong>{item.value}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.infoCard}>
          <h3>Thống kê thiết bị</h3>
          <ul className={styles.deviceList}>
            {data.deviceStats.map((item) => {
              const percent =
                totalDevice > 0
                  ? Math.round((item.value / totalDevice) * 100)
                  : 0;

              return (
                <li key={item.name}>
                  <div className={styles.deviceMeta}>
                    <span>{item.name}</span>
                    <small>{item.value} lượt truy cập</small>
                  </div>
                  <strong>{percent}%</strong>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.infoCard}>
          <h3>Thống kê IP</h3>
          <ul className={styles.dataList}>
            {data.topIpStats.map((item) => (
              <li key={item.name}>
                <span>{item.name}</span>
                <strong>{item.value} lần</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.bottomGrid}>
        <div className={styles.miniStatCard}>
          <div className={styles.miniStatIcon}>
            <Package2 size={18} />
          </div>
          <div>
            <span>Sản phẩm đang hoạt động</span>
            <strong>{data.summary.totalProducts}</strong>
          </div>
        </div>

        <div className={styles.miniStatCard}>
          <div className={styles.miniStatIcon}>
            <Globe size={18} />
          </div>
          <div>
            <span>Tổng truy cập hệ thống</span>
            <strong>{data.summary.totalVisits}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
