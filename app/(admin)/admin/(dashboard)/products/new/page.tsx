import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/modules/admin/products/ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const [categories, tags] = await Promise.all([
    prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.tag.findMany({
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ]);

  return (
    <ProductForm
      title="Tạo sản phẩm"
      submitLabel="Lưu sản phẩm"
      action={createProduct}
      categories={categories}
      tagOptions={tags}
    />
  );
}
