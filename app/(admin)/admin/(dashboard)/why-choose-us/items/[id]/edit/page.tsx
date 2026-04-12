import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WhyChooseUsItemForm from "@/components/modules/admin/why-choose-us/items/WhyChooseUsItemForm";
import { updateWhyChooseUsItem } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditWhyChooseUsItemPage({ params }: Props) {
  const { id } = await params;
  const itemId = Number(id);

  if (!Number.isInteger(itemId)) {
    notFound();
  }

  const item = await prisma.staticPage.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    notFound();
  }

  const action = updateWhyChooseUsItem.bind(null, item.id);

  return (
    <WhyChooseUsItemForm
      title="Cập nhật item lý do"
      submitLabel="Lưu thay đổi"
      action={action}
      defaultValues={{
        title: item.title,
        summary: item.summary ?? "",
        content: item.content ?? "",
      }}
    />
  );
}
