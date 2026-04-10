import { notFound } from "next/navigation";
import CategoryForm from "@/components/modules/admin/product-categories/CategoryForm";
import { prisma } from "@/lib/prisma";
import { updateProductCategory } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductCategoryPage({ params }: Props) {
  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId)) {
    notFound();
  }

  const category = await prisma.productCategory.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    notFound();
  }

  const action = updateProductCategory.bind(null, category.id);

  return (
    <CategoryForm
      title={`Sửa danh mục: ${category.name}`}
      submitLabel="Cập nhật danh mục"
      action={action}
      showStatusFields
      defaultValues={{
        name: category.name,
        isFeatured: category.isFeatured,
        isActive: category.isActive,
      }}
    />
  );
}
