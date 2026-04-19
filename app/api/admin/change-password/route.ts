import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
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
    const currentPassword = String(body?.currentPassword || "");
    const newPassword = String(body?.newPassword || "");

    if (!currentPassword) {
      return NextResponse.json(
        { message: "Vui lòng nhập mật khẩu hiện tại." },
        { status: 400 },
      );
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { message: "Mật khẩu mới phải có ít nhất 8 ký tự." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản." },
        { status: 404 },
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Mật khẩu hiện tại không đúng." },
        { status: 400 },
      );
    }

    const sameAsOld = await bcrypt.compare(newPassword, user.passwordHash);

    if (sameAsOld) {
      return NextResponse.json(
        { message: "Mật khẩu mới không được trùng mật khẩu cũ." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
      },
    });

    return NextResponse.json({
      message: "Đổi mật khẩu thành công.",
    });
  } catch (error) {
    console.error("Change password failed:", error);

    return NextResponse.json(
      { message: "Không thể đổi mật khẩu." },
      { status: 500 },
    );
  }
}