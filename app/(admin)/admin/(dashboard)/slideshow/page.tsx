import { prisma } from "@/lib/prisma";
import SlideshowsTable from "@/components/modules/admin/slideshow/SlideshowsTable";

export default async function AdminSlideshowsPage() {
  const items = await prisma.slideshow.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
    include: {
      image: true,
    },
  });

  const mappedItems = items.map((item) => ({
    id: item.id,
    title: item.title ?? "",
    link: item.link ?? "",
    altText: item.altText ?? "",
    sortOrder: item.sortOrder,
    isActive: item.isActive,
    imagePath: item.image?.filePath ?? "",
  }));

  return <SlideshowsTable items={mappedItems} />;
}
