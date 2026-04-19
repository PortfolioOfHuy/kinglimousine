import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

type JwtPayload = {
  userId: number;
  email: string;
};

async function getAdminUserIdFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "dev-secret",
    );

    const { payload } = await jwtVerify(token, secret);
    const userId = Number((payload as JwtPayload).userId);

    if (!userId || Number.isNaN(userId)) {
      return null;
    }

    return userId;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const userId = await getAdminUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập." },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        lastLoginAt: true,
        isActive: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get login history failed:", error);

    return NextResponse.json(
      { message: "Không thể tải lịch sử truy cập." },
      { status: 500 },
    );
  }
}