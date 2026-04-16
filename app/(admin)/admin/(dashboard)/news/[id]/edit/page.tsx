import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NewsForm from "@/components/modules/admin/news/NewsForm";
import { updateNews } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditNewsPage({ params }: Props) {
  const { id } = await params;
  const newsId = Number(id);

  if (!newsId || Number.isNaN(newsId)) {
    notFound();
  }

  const item = await prisma.news.findUnique({
    where: { id: newsId },
    include: {
      thumbnail: true,
    },
  });

  if (!item) {
    notFound();
  }

  return (
    <NewsForm
      title="Chỉnh sửa tin tức"
      submitLabel="Cập nhật"
      action={updateNews}
      defaultValues={{
        id: item.id,
        title: item.title,
        summary: item.summary ?? "",
        content: item.content ?? "",
        thumbnailPath: item.thumbnail?.filePath ?? null,
      }}
    />
  );
}
