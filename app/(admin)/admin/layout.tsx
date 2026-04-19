import { fontInter } from "./fonts";
import "antd/dist/reset.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Quản trị",
    template: "%s | Quản trị - Kinglimousine",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

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