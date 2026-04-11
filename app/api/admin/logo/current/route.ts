import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const websiteSetting = await prisma.websiteSetting.findFirst({
      include: {
        logo: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: websiteSetting,
    });
  } catch (error) {
    console.error("GET_CURRENT_LOGO_ERROR", error);

    return NextResponse.json(
      { success: false, message: "Không lấy được thông tin logo." },
      { status: 500 },
    );
  }
}
