import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import HowToBookForm from "@/components/modules/admin/how-to-book/HowToBookForm";
import { updateHowToBook } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditHowToBookPage({ params }: Props) {
  const { id } = await params;
  const itemId = Number(id);

  if (!Number.isInteger(itemId)) {
    notFound();
  }

  const item = await prisma.staticPage.findUnique({
    where: { id: itemId },
    include: {
      featuredImage: true,
    },
  });

  if (!item) {
    notFound();
  }

  const action = updateHowToBook.bind(null, item.id);

  return (
    <HowToBookForm
      title="Cập nhật bài hướng dẫn đặt xe"
      submitLabel="Lưu thay đổi"
      action={action}
      defaultValues={{
        title: item.title,
        summary: item.summary ?? "",
        content: item.content ?? "",
        imagePath: item.featuredImage?.filePath ?? null,
      }}
    />
  );
}
