import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SlideshowForm from "@/components/modules/admin/slideshow/SlideshowForm";
import { updateSlideshow } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSlideshowPage({ params }: Props) {
  const { id } = await params;
  const slideshowId = Number(id);

  if (!slideshowId) notFound();

  const item = await prisma.slideshow.findUnique({
    where: { id: slideshowId },
    include: {
      image: true,
    },
  });

  if (!item) notFound();

  return (
    <div style={{ padding: 24 }}>
      <SlideshowForm
        title="Chỉnh sửa slideshow"
        submitLabel="Lưu thay đổi"
        action={updateSlideshow}
        defaultValues={{
          id: item.id,
          title: item.title ?? "",
          link: item.link ?? "",
          altText: item.altText ?? "",
          sortOrder: item.sortOrder,
          isActive: item.isActive,
          imagePath: item.image?.filePath ?? "",
        }}
      />
    </div>
  );
}
