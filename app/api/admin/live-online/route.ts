import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ liveOnline: 0 }, { status: 401 });
    }

    await verifyAdminToken(token);

    const threshold = new Date(Date.now() - 70 * 1000);

    const liveOnline = await prisma.onlineSession.count({
      where: {
        lastSeenAt: {
          gte: threshold,
        },
      },
    });

    return NextResponse.json({ liveOnline }, { status: 200 });
  } catch {
    return NextResponse.json({ liveOnline: 0 }, { status: 401 });
  }
}
