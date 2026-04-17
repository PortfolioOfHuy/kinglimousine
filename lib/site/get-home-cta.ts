import { prisma } from "@/lib/prisma";

export type HomeCtaData = {
  isActive: boolean;
  title: string;
  description: string;
  backgroundImage: string;
  backgroundImageAlt: string;
};

export async function getHomeCta(): Promise<HomeCtaData | null> {
  const setting = await prisma.websiteSetting.findFirst({
    orderBy: { id: "asc" },
    include: {
      ctaBackgroundImage: true,
    },
  });

  if (!setting?.ctaIsActive) return null;

  return {
    isActive: Boolean(setting.ctaIsActive),
    title: setting.ctaTitle?.trim() || "",
    description: setting.ctaDescription?.trim() || "",
    backgroundImage: setting.ctaBackgroundImage?.filePath || "/globe.svg",
    backgroundImageAlt: setting.ctaTitle?.trim() || "CTA background",
  };
}
