import { prisma } from "@/lib/prisma";

export type HomeNewsItem = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image: string;
  imageAlt: string;
  publishedDay: string;
  publishedMonth: string;
  publishedYear: string;
};

export async function getHomeNews(limit = 6): Promise<HomeNewsItem[]> {
  const items = await prisma.news.findMany({
    where: {
      isActive: true,
      status: "PUBLISHED",
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
    include: {
      thumbnail: true,
    },
  });

  return items.map((item) => {
    const date = item.publishedAt ?? item.createdAt;

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      summary: item.summary?.trim() || "Đang cập nhật nội dung tin tức...",
      image: item.thumbnail?.filePath || "/globe.svg",
      imageAlt: item.title,
      publishedDay: String(date.getDate()).padStart(2, "0"),
      publishedMonth: date.toLocaleString("en-US", { month: "long" }),
      publishedYear: String(date.getFullYear()),
    };
  });
}
