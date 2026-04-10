import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

type HeartbeatPayload = {
  sessionId?: string;
  path?: string;
};

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return null;
}

function normalizePath(path?: string) {
  if (!path) return "/";
  if (!path.startsWith("/")) return `/${path}`;
  return path;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as HeartbeatPayload;

    if (!body.sessionId) {
      return NextResponse.json(
        { success: false, message: "Thiếu sessionId." },
        { status: 400 },
      );
    }

    const userAgent = request.headers.get("user-agent");
    const ip = getClientIp(request);
    const ipHash = ip ? hashValue(ip) : null;
    const path = normalizePath(body.path);
    const now = new Date();

    await prisma.onlineSession.upsert({
      where: {
        sessionId: body.sessionId,
      },
      update: {
        path,
        ipHash,
        userAgent,
        lastSeenAt: now,
      },
      create: {
        sessionId: body.sessionId,
        path,
        ipHash,
        userAgent,
        lastSeenAt: now,
      },
    });

    const staleBefore = new Date(Date.now() - 2 * 60 * 1000);

    await prisma.onlineSession.deleteMany({
      where: {
        lastSeenAt: {
          lt: staleBefore,
        },
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("POST /api/online/heartbeat error:", error);

    return NextResponse.json(
      { success: false, message: "Không thể cập nhật online." },
      { status: 500 },
    );
  }
}
