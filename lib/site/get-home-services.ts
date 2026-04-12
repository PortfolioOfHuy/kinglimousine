import { prisma } from "@/lib/prisma";

export type HomeServiceItem = {
  id: number;
  title: string;
  description: string;
  link: string;
  image: string;
  imageAlt: string;
};

export async function getHomeServices(): Promise<HomeServiceItem[]> {
  const services = await prisma.staticPage.findMany({
    where: {
      type: "service",
      status: "PUBLISHED",
      showInMenu: true,
      featuredImageId: {
        not: null,
      },
    },
    include: {
      featuredImage: true,
    },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return services.map((service) => {
    const rawImage = service.featuredImage!.filePath;

    const image =
      rawImage.startsWith("http") || rawImage.startsWith("/")
        ? rawImage
        : `/${rawImage}`;

    return {
      id: service.id,
      title: service.title,
      description: service.summary ?? "",
      link: `/dich-vu/${service.slug}`,
      image,
      imageAlt: service.featuredImage?.altText ?? service.title,
    };
  });
}
