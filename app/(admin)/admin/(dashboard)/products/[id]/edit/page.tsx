import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/modules/admin/products/ProductForm";
import { updateProduct } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId)) {
    notFound();
  }

  const [categories, product] = await Promise.all([
    prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.product.findUnique({
      where: { id: productId },
      include: {
        thumbnail: true,
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const action = updateProduct.bind(null, product.id);

  return (
    <ProductForm
      title="Cập nhật sản phẩm"
      submitLabel="Lưu thay đổi"
      action={action}
      categories={categories}
      defaultValues={{
        categoryId: product.categoryId,
        title: product.title,
        summary: product.summary ?? "",
        content: product.content ?? "",
        price: product.price ? String(product.price) : "",
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        thumbnailPath: product.thumbnail?.filePath ?? null,
      }}
    />
  );
}
