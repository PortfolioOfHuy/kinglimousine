import { prisma } from "@/lib/prisma";
import ProductCategoriesTable from "@/components/modules/admin/product-categories/ProductCategoriesTable";

export default async function ProductCategoriesPage() {
  const categories = await prisma.productCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  const items = categories.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isActive: item.isActive,
  }));

  return <ProductCategoriesTable items={items} />;
}
