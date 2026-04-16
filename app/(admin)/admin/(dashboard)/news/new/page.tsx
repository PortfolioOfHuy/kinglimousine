import NewsForm from "@/components/modules/admin/news/NewsForm";
import { createNews } from "../actions";

export default function NewNewsPage() {
  return (
    <NewsForm
      title="Thêm tin tức"
      submitLabel="Lưu tin tức"
      action={createNews}
    />
  );
}
