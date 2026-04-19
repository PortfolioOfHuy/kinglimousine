import { prisma } from "@/lib/prisma";

export type ServicePageItem = {
  id: number;
  title: string;
  description: string;
  link: string;
  image: string | null;
  imageAlt: string;
};

export async function getServicesPage(): Promise<ServicePageItem[]> {
  const services = await prisma.staticPage.findMany({
    where: {
      type: "service",
      status: "PUBLISHED",
      showInMenu: true,
    },
    include: {
      featuredImage: true,
    },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return services.map((service) => {
    const rawImage = service.featuredImage?.filePath ?? null;

    const image = rawImage
      ? rawImage.startsWith("http") || rawImage.startsWith("/")
        ? rawImage
        : `/${rawImage}`
      : null;

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