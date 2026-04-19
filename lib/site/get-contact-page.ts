import { prisma } from "@/lib/prisma";

export type ContactPageData = {
  siteName: string;
  siteDescription: string | null;
  hotline: string | null;
  hotlineDisplay: string | null;
  email: string | null;
  address: string | null;
  zaloPhone: string | null;
  googleMapIframe: string | null;
};

export async function getContactPage(): Promise<ContactPageData | null> {
  const setting = await prisma.websiteSetting.findFirst({
    orderBy: {
      id: "asc",
    },
  });

  if (!setting) {
    return null;
  }

  return {
    siteName: setting.siteName,
    siteDescription: setting.siteDescription ?? null,
    hotline: setting.hotline ?? null,
    hotlineDisplay: setting.hotlineDisplay ?? null,
    email: setting.email ?? null,
    address: setting.address ?? null,
    zaloPhone: setting.zaloPhone ?? null,
    googleMapIframe: setting.googleMapIframe ?? null,
  };
}