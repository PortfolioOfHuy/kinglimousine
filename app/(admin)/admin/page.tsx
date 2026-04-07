import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    const session = await verifyAdminToken(token);

    return (
      <div style={{ padding: "24px" }}>
        <h1>Dashboard Admin</h1>
        <p>Xin chào, {session.name}</p>

        <form
          action="/api/admin/logout"
          method="post"
          style={{ marginTop: "16px" }}
        >
          <button type="submit">Đăng xuất</button>
        </form>
      </div>
    );
  } catch {
    redirect("/admin/login");
  }
}
