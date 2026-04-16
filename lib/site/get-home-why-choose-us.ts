import { prisma } from "@/lib/prisma";

export type WhyChooseUsIntro = {
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
};

export type WhyChooseUsItem = {
  id: number;
  title: string;
  summary: string;
  link: string;
};

export type HomeWhyChooseUsData = {
  intro: WhyChooseUsIntro | null;
  items: WhyChooseUsItem[];
};

function normalizeImagePath(path: string) {
  return path.startsWith("http") || path.startsWith("/") ? path : `/${path}`;
}

export async function getHomeWhyChooseUs(): Promise<HomeWhyChooseUsData> {
  const [intro, items] = await Promise.all([
    prisma.staticPage.findFirst({
      where: {
        OR: [
          { slug: "vi-sao-chon-chung-toi" },
          { type: "why-choose-us-section" },
        ],
        status: "PUBLISHED",
      },
      include: {
        featuredImage: true,
        bannerImage: true,
      },
    }),
    prisma.staticPage.findMany({
      where: {
        OR: [
          { type: "why-choose-us-item" },
          {
            slug: {
              startsWith: "vi-sao-chon-item-",
            },
          },
        ],
        status: "PUBLISHED",
        showInMenu: true,
      },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      take: 4,
    }),
  ]);

  const introImage =
    intro?.featuredImage?.filePath || intro?.bannerImage?.filePath || "";

  return {
    intro:
      intro && introImage
        ? {
            title: intro.title,
            summary: intro.summary ?? "",
            image: normalizeImagePath(introImage),
            imageAlt:
              intro.featuredImage?.altText ||
              intro.bannerImage?.altText ||
              intro.title,
          }
        : null,
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary ?? "",
      link: "/lien-he",
    })),
  };
}
