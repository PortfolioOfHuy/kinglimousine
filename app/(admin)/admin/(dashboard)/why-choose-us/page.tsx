import { prisma } from "@/lib/prisma";
import WhyChooseUsSectionForm from "@/components/modules/admin/why-choose-us/WhyChooseUsSectionForm";
import { saveWhyChooseUsSection } from "./actions";

export default async function WhyChooseUsPage() {
  const section = await prisma.staticPage.findUnique({
    where: { slug: "vi-sao-chon-chung-toi" },
    include: {
      featuredImage: true,
    },
  });

  return (
    <WhyChooseUsSectionForm
      title="Vì sao chọn chúng tôi"
      submitLabel="Lưu nội dung"
      action={saveWhyChooseUsSection}
      defaultValues={{
        summary: section?.summary ?? "",
        imagePath: section?.featuredImage?.filePath ?? null,
      }}
    />
  );
}
