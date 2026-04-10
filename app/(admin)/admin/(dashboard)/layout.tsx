import AdminLayoutClient from "@/components/modules/admin/layout/AdminLayoutClient";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
