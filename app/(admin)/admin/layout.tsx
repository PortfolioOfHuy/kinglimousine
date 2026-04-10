import { fontInter } from "./fonts";
import "antd/dist/reset.css";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={fontInter.variable}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </div>
  );
}
