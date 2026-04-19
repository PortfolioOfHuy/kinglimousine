import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signAdminToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const password = String(body?.password ?? "").trim();

    if (!name || !password) {
      return NextResponse.json(
        { message: "Vui lòng nhập tên đăng nhập và mật khẩu." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { name },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { message: "Tài khoản không tồn tại hoặc đã bị khóa." },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Sai mật khẩu." }, { status: 401 });
    }

    const token = await signAdminToken({
      userId: user.id,
      name: user.name,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const response = NextResponse.json(
      {
        message: "Đăng nhập thành công.",
        user: {
          id: user.id,
          name: user.name,
        },
      },
      { status: 200 },
    );

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return response;
  } catch (error) {
    console.error("ADMIN_LOGIN_ERROR", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi đăng nhập." },
      { status: 500 },
    );
  }
}
