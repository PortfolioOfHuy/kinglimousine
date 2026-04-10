import CategoryForm from "@/components/modules/admin/product-categories/CategoryForm";
import { createProductCategory } from "../actions";

export default function NewProductCategoryPage() {
  return (
    <CategoryForm
      title="Tạo danh mục"
      submitLabel="Lưu danh mục"
      action={createProductCategory}
      showStatusFields={false}
    />
  );
}
