import SlideshowForm from "@/components/modules/admin/slideshow/SlideshowForm";
import { createSlideshow } from "../actions";

export default function NewSlideshowPage() {
  return (
    <div style={{ padding: 24 }}>
      <SlideshowForm
        title="Thêm slideshow"
        submitLabel="Tạo mới"
        action={createSlideshow}
      />
    </div>
  );
}
