import { prisma } from "@/lib/prisma";

export type FooterServiceItem = {
  id: number;
  title: string;
  link: string;
};

export type FooterData = {
  siteName: string;
  footerLogo: string | null;
  address: string | null;
  email: string | null;
  hotline: string | null;
  hotlineDisplay: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  zaloPhone: string | null;
  copyrightText: string | null;
  services: FooterServiceItem[];
};

export async function getFooterData(): Promise<FooterData> {
  const websiteSetting = await prisma.websiteSetting.findFirst({
    orderBy: { id: "asc" },
    include: {
      footerLogo: true,
    },
  });

  const services = await prisma.staticPage.findMany({
    where: {
      type: "service",
      status: "PUBLISHED",
      showInMenu: true,
    },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: {
      id: true,
      title: true,
      slug: true,
    },
    take: 6,
  });

  return {
    siteName: websiteSetting?.siteName || "KING LIMOUSINE",
    footerLogo: websiteSetting?.footerLogo?.filePath ?? null,
    address: websiteSetting?.address ?? null,
    email: websiteSetting?.email ?? null,
    hotline: websiteSetting?.hotline ?? null,
    hotlineDisplay: websiteSetting?.hotlineDisplay ?? null,
    facebookUrl: websiteSetting?.facebookUrl ?? null,
    instagramUrl: websiteSetting?.instagramUrl ?? null,
    zaloPhone: websiteSetting?.zaloPhone ?? null,
    copyrightText:
      websiteSetting?.copyrightText ??
      "Copyright 2026 © KING LIMOUSINE",
    services: services.map((service) => ({
      id: service.id,
      title: service.title,
      link: `/dich-vu/${service.slug}`,
    })),
  };
}