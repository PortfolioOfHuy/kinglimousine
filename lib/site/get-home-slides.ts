import { prisma } from "@/lib/prisma";

export type HomeSlideItem = {
  id: number;
  title: string;
  description: string;
  link: string;
  image: string;
  imageAlt: string;
};

export async function getHomeSlides(): Promise<HomeSlideItem[]> {
  const slides = await prisma.slideshow.findMany({
    where: {
      isActive: true,
    },
    include: {
      image: true,
    },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return slides
    .filter((slide) => slide.image?.filePath)
    .map((slide) => {
      const rawImage = slide.image.filePath;

      const image =
        rawImage.startsWith("http") || rawImage.startsWith("/")
          ? rawImage
          : `/${rawImage}`;

      return {
        id: slide.id,
        title: slide.title ?? "",
        description: slide.altText ?? "",
        link: slide.link ?? "",
        image,
        imageAlt: slide.image.altText ?? slide.title ?? "Slideshow image",
      };
    });
}
