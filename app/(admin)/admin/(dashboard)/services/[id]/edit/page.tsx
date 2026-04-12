import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceForm from "@/components/modules/admin/services/ServiceForm";
import { updateService } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const serviceId = Number(id);

  if (!Number.isInteger(serviceId)) {
    notFound();
  }

  const service = await prisma.staticPage.findUnique({
    where: { id: serviceId },
    include: {
      featuredImage: true,
    },
  });

  if (!service) {
    notFound();
  }

  const action = updateService.bind(null, service.id);

  return (
    <ServiceForm
      title="Cập nhật dịch vụ"
      submitLabel="Lưu thay đổi"
      action={action}
      defaultValues={{
        title: service.title,
        summary: service.summary ?? "",
        content: service.content ?? "",
        imagePath: service.featuredImage?.filePath ?? null,
      }}
    />
  );
}
