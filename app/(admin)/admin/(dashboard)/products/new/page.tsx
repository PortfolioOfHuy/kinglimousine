import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/modules/admin/products/ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const categories = await prisma.productCategory.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <ProductForm
      title="Tạo sản phẩm"
      submitLabel="Lưu sản phẩm"
      action={createProduct}
      categories={categories}
    />
  );
}
