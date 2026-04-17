import { prisma } from "@/lib/prisma";
import HomeCtaSettingsForm from "@/components/modules/admin/cta/HomeCtaSettingsForm";
import { updateHomeCta } from "./actions";

export default async function HomeCtaPage() {
  const setting = await prisma.websiteSetting.findFirst({
    orderBy: { id: "asc" },
    include: {
      ctaBackgroundImage: true,
    },
  });

  return (
    <HomeCtaSettingsForm
      action={updateHomeCta}
      defaultValues={{
        ctaTitle: setting?.ctaTitle ?? "",
        ctaDescription: setting?.ctaDescription ?? "",
        ctaIsActive: setting?.ctaIsActive ?? true,
        ctaBackgroundImagePath: setting?.ctaBackgroundImage?.filePath ?? "",
      }}
    />
  );
}
