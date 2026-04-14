import { prisma } from "@/lib/prisma";

export type HomeHowToBookItem = {
  id: number;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  stepNumber: string;
  slug: string;
};

function normalizeImagePath(path: string) {
  return path.startsWith("http") || path.startsWith("/") ? path : `/${path}`;
}

function extractStepNumber(slug: string, index: number) {
  const match = slug.match(/(\d+)$/);
  const number = match ? Number(match[1]) : index + 1;
  return String(number).padStart(2, "0");
}

export async function getHomeHowToBook(): Promise<HomeHowToBookItem[]> {
  const items = await prisma.staticPage.findMany({
    where: {
      slug: {
        startsWith: "dat-xe-",
      },
      status: "PUBLISHED",
      showInMenu: true,
    },
    include: {
      featuredImage: true,
    },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return items
    .filter((item) => item.featuredImage?.filePath)
    .map((item, index) => ({
      id: item.id,
      title: item.title,
      summary: item.summary ?? "",
      image: normalizeImagePath(item.featuredImage!.filePath),
      imageAlt: item.featuredImage?.altText ?? item.title,
      stepNumber: extractStepNumber(item.slug, index),
      slug: item.slug,
    }));
}
