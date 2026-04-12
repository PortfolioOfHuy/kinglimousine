import HowToBookForm from "@/components/modules/admin/how-to-book/HowToBookForm";
import { createHowToBook } from "../actions";

export default async function NewHowToBookPage() {
  return (
    <HowToBookForm
      title="Tạo bài hướng dẫn đặt xe"
      submitLabel="Lưu bài viết"
      action={createHowToBook}
    />
  );
}
