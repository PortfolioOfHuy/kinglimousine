import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TagForm from "@/components/modules/admin/tags/TagForm";
import { updateTag } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTagPage({ params }: Props) {
  const { id } = await params;
  const tagId = Number(id);

  if (Number.isNaN(tagId)) {
    notFound();
  }

  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
  });

  if (!tag) {
    notFound();
  }

  async function updateTagById(formData: FormData) {
    "use server";
    return updateTag(tagId, formData);
  }

  return (
    <TagForm
      title="Chỉnh sửa tag sản phẩm"
      submitLabel="Cập nhật"
      action={updateTagById}
      defaultValues={{
        name: tag.name,
        slug: tag.slug,
      }}
    />
  );
}
