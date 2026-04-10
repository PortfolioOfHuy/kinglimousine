import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type OfflinePayload = {
  sessionId?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as OfflinePayload;

    if (!body.sessionId) {
      return NextResponse.json(
        { success: false, message: "Thiếu sessionId." },
        { status: 400 },
      );
    }

    await prisma.onlineSession.deleteMany({
      where: {
        sessionId: body.sessionId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("POST /api/online/offline error:", error);

    return NextResponse.json(
      { success: false, message: "Không thể cập nhật offline." },
      { status: 500 },
    );
  }
}
