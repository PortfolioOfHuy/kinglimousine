import TagForm from "@/components/modules/admin/tags/TagForm";
import { createTag } from "../actions";

export default function NewTagPage() {
  return (
    <TagForm
      title="Thêm tag sản phẩm"
      submitLabel="Lưu tag"
      action={createTag}
    />
  );
}
