import { NextRequest, NextResponse } from "next/server";
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

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getAdminUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();

    if (!name) {
      return NextResponse.json(
        { message: "Vui lòng nhập tên hiển thị." },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        { message: "Vui lòng nhập email." },
        { status: 400 },
      );
    }

    const existedByName = await prisma.user.findFirst({
      where: {
        name,
        NOT: { id: userId },
      },
      select: { id: true },
    });

    if (existedByName) {
      return NextResponse.json(
        { message: "Tên hiển thị đã tồn tại." },
        { status: 409 },
      );
    }

    const existedByEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
      select: { id: true },
    });

    if (existedByEmail) {
      return NextResponse.json(
        { message: "Email đã tồn tại." },
        { status: 409 },
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        lastLoginAt: true,
      },
    });

    return NextResponse.json({
      message: "Cập nhật tài khoản thành công.",
      user: updated,
    });
  } catch (error) {
    console.error("Update profile failed:", error);

    return NextResponse.json(
      { message: "Không thể cập nhật tài khoản." },
      { status: 500 },
    );
  }
}