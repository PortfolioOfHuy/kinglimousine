import { fontInter } from "./fonts";

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
