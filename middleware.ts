import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, verifyAdminToken } from "@/lib/auth";

function clearAndRedirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.delete("admin_token");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (!isAdminPage) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;

  if (isLoginPage) {
    if (!token) return NextResponse.next();

    try {
      await verifyAdminToken(token);
      return NextResponse.redirect(new URL("/admin", request.url));
    } catch {
      const response = NextResponse.next();
      response.cookies.delete("admin_token");
      return response;
    }
  }

  if (!token) {
    return clearAndRedirectToLogin(request);
  }

  try {
    const payload = await verifyAdminToken(token);

    const refreshedToken = await signAdminToken({
      userId: payload.userId,
      name: payload.name,
    });

    const response = NextResponse.next();

    response.cookies.set("admin_token", refreshedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return response;
  } catch {
    return clearAndRedirectToLogin(request);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};