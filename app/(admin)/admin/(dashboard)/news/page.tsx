import { prisma } from "@/lib/prisma";
import NewsTable from "@/components/modules/admin/news/NewsTable";

export default async function NewsPage() {
  const items = await prisma.news.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      thumbnail: true,
    },
  });

  return (
    <NewsTable
      items={items.map((item) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        isActive: item.isActive,
        thumbnailPath: item.thumbnail?.filePath ?? null,
      }))}
    />
  );
}
