import { prisma } from "@/lib/prisma";

export async function getWebsiteSetting() {
  const setting = await prisma.websiteSetting.findFirst({
    include: {
      logo: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return {
    siteName: setting?.siteName ?? "KING LIMOUSINE",
    logo: setting?.logo?.filePath ?? null,
    logoAlt: setting?.logo?.altText ?? setting?.siteName ?? "Logo",
  };
}
