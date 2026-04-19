import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [unreadCount, items] = await Promise.all([
      prisma.contactMessage.count({
        where: {
          status: "NEW",
        },
      }),
      prisma.contactMessage.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
        select: {
          id: true,
          fullName: true,
          phone: true,
          subject: true,
          createdAt: true,
          status: true,
        },
      }),
    ]);

    return NextResponse.json({
      unreadCount,
      items,
    });
  } catch (error) {
    console.error("Get contact notifications failed:", error);

    return NextResponse.json(
      {
        unreadCount: 0,
        items: [],
        message: "Không thể tải thông báo.",
      },
      { status: 500 },
    );
  }
}