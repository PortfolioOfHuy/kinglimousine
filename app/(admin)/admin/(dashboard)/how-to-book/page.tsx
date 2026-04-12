import { prisma } from "@/lib/prisma";
import HowToBookTable from "@/components/modules/admin/how-to-book/HowToBookTable";
export default async function HowToBookPage() {
  const items = await prisma.staticPage.findMany({
    where: {
      slug: {
        startsWith: "dat-xe-",
      },
    },
    include: {
      featuredImage: true,
    },
    orderBy: [{ id: "desc" }],
  });

  const mappedItems = items.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    imagePath: item.featuredImage?.filePath ?? null,
    isFeatured: item.showInMenu,
    isVisible: item.status === "PUBLISHED",
  }));

  return <HowToBookTable items={mappedItems} />;
}
