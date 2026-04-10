import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

type VisitPayload = {
  sessionId?: string;
  path?: string;
  referer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
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

function getDeviceType(
  userAgent: string | null,
): "DESKTOP" | "MOBILE" | "TABLET" | "OTHER" {
  const ua = (userAgent || "").toLowerCase();

  if (/ipad|tablet/.test(ua)) return "TABLET";
  if (/mobi|android|iphone|ipod/.test(ua)) return "MOBILE";
  if (!ua) return "OTHER";

  return "DESKTOP";
}

function getBrowser(userAgent: string | null) {
  const ua = userAgent || "";

  if (/edg/i.test(ua)) return "Microsoft Edge";
  if (/opr|opera/i.test(ua)) return "Opera";
  if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua) && !/chrome|crios|edg/i.test(ua)) return "Safari";
  if (/firefox|fxios/i.test(ua)) return "Firefox";

  return "Other";
}

function getOs(userAgent: string | null) {
  const ua = userAgent || "";

  if (/windows/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/mac os x|macintosh/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";

  return "Other";
}

function normalizePath(path?: string) {
  if (!path) return "/";
  if (!path.startsWith("/")) return `/${path}`;
  return path;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as VisitPayload;
    const userAgent = request.headers.get("user-agent");
    const ip = getClientIp(request);
    const ipHash = ip ? hashValue(ip) : null;
    const path = normalizePath(body.path);

    await prisma.visit.create({
      data: {
        sessionId: body.sessionId || null,
        path,
        referer: body.referer || null,
        utmSource: body.utmSource || null,
        utmMedium: body.utmMedium || null,
        utmCampaign: body.utmCampaign || null,
        deviceType: getDeviceType(userAgent),
        browser: getBrowser(userAgent),
        os: getOs(userAgent),
        ipHash,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/visit error:", error);

    return NextResponse.json(
      { success: false, message: "Không thể ghi visit." },
      { status: 500 },
    );
  }
}
