import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id ?? 0);
    const sortOrder = Number(body.sortOrder ?? 0);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID slideshow không hợp lệ." },
        { status: 400 },
      );
    }

    if (Number.isNaN(sortOrder)) {
      return NextResponse.json(
        { success: false, message: "Thứ tự không hợp lệ." },
        { status: 400 },
      );
    }

    const updated = await prisma.slideshow.update({
      where: { id },
      data: {
        sortOrder,
      },
    });

    revalidatePath("/admin/slideshow");
    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        sortOrder: updated.sortOrder,
      },
    });
  } catch (error) {
    console.error("update slideshow sort order error:", error);

    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra khi cập nhật thứ tự." },
      { status: 500 },
    );
  }
}
