import ServicesTable from "@/components/modules/admin/services/ServicesTable";
import { prisma } from "@/lib/prisma";

export default async function ServicesPage() {
  const items = await prisma.staticPage.findMany({
    where: {
      slug: {
        startsWith: "dich-vu-",
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

  return <ServicesTable items={mappedItems} />;
}
