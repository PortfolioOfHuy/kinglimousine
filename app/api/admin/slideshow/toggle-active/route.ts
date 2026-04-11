import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id ?? 0);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID slideshow không hợp lệ." },
        { status: 400 },
      );
    }

    const current = await prisma.slideshow.findUnique({
      where: { id },
    });

    if (!current) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy slideshow." },
        { status: 404 },
      );
    }

    const updated = await prisma.slideshow.update({
      where: { id },
      data: {
        isActive: !current.isActive,
      },
    });

    revalidatePath("/admin/slideshow");
    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    console.error("toggle slideshow active error:", error);

    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra khi cập nhật hiển thị." },
      { status: 500 },
    );
  }
}
