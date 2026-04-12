import WhyChooseUsItemForm from "@/components/modules/admin/why-choose-us/items/WhyChooseUsItemForm";
import { createWhyChooseUsItem } from "../actions";

export default async function NewWhyChooseUsItemPage() {
  return (
    <WhyChooseUsItemForm
      title="Tạo item lý do"
      submitLabel="Lưu item"
      action={createWhyChooseUsItem}
    />
  );
}
