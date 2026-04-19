import { prisma } from "@/lib/prisma";
import WhyChooseUsItemsTable from "@/components/modules/admin/why-choose-us/items/WhyChooseUsItemsTable";

export const metadata = {
  title: "Trang Quản Trị",
};

export default async function WhyChooseUsItemsPage() {
  const items = await prisma.staticPage.findMany({
    where: {
      slug: {
        startsWith: "vi-sao-chon-item-",
      },
    },
    orderBy: [{ id: "asc" }],
  });

  const mappedItems = items.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    isFeatured: item.showInMenu,
    isVisible: item.status === "PUBLISHED",
  }));

  return <WhyChooseUsItemsTable items={mappedItems} />;
}
