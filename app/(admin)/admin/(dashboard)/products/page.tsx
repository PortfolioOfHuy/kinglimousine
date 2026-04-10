import { prisma } from "@/lib/prisma";
import ProductsTable from "@/components/modules/admin/products/ProductsTable";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      thumbnail: true,
    },
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
  });

  const items = products.map((item) => ({
    id: item.id,
    title: item.title,
    categoryName: item.category?.name ?? "—",
    price: item.price ? String(item.price) : null,
    isFeatured: item.isFeatured,
    isActive: item.isActive,
    thumbnailPath: item.thumbnail?.filePath ?? null,
  }));

  return <ProductsTable items={items} />;
}
