import { prisma } from "@/lib/prisma";
import TagsTable from "@/components/modules/admin/tags/TagsTable";

export default async function TagsPage() {
  const items = await prisma.tag.findMany({
    include: {
      products: true,
    },
    orderBy: [{ id: "desc" }],
  });

  const mappedItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    productCount: item.products.length,
  }));

  return <TagsTable items={mappedItems} />;
}
