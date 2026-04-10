import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { syncVisitDailyStats } from "@/lib/admin/sync-visit-daily-stats";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Chưa đăng nhập." }, { status: 401 });
    }

    await verifyAdminToken(token);

    const body = await request.json().catch(() => ({}));

    const result = await syncVisitDailyStats({
      startDate: body?.startDate,
      endDate: body?.endDate,
      timezoneOffsetMinutes: body?.timezoneOffsetMinutes ?? 420,
    });

    return NextResponse.json(
      {
        message: "Đồng bộ thống kê thành công.",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/admin/stats/sync error:", error);

    return NextResponse.json(
      { message: "Đồng bộ thống kê thất bại." },
      { status: 500 },
    );
  }
}
