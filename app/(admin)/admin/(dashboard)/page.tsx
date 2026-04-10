import AdminDashboardView from "@/components/modules/admin/dashboard/AdminDashboardView";
import { getDashboardData } from "@/lib/admin/get-dashboard-data";

type PageProps = {
  searchParams?: Promise<{
    month?: string;
    year?: string;
  }>;
};

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  const now = new Date();
  const month = Number(resolvedSearchParams?.month) || now.getMonth() + 1;
  const year = Number(resolvedSearchParams?.year) || now.getFullYear();

  const data = await getDashboardData({ month, year });

  return <AdminDashboardView data={data} />;
}
