import { prisma } from "@/lib/prisma";

export type AboutUsPageData = {
  title: string;
  summary: string | null;
  content: string | null;
  bannerImage: string | null;
  bannerImageAlt: string;
} | null;

export async function getAboutUs(): Promise<AboutUsPageData> {
  const page = await prisma.staticPage.findUnique({
    where: {
      slug: "gioi-thieu",
    },
    include: {
      bannerImage: true,
    },
  });

  if (!page || page.status !== "PUBLISHED") {
    return null;
  }

  return {
    title: page.title,
    summary: page.summary ?? null,
    content: page.content ?? null,
    bannerImage: page.bannerImage?.filePath ?? null,
    bannerImageAlt: page.bannerImage?.altText || page.title || "gioi-thieu",
  };
}