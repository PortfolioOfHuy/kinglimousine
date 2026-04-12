import { prisma } from "@/lib/prisma";

export type ServiceDetail = {
  id: number;
  title: string;
  content: string;
};

export async function getServiceDetail(
  slug: string,
): Promise<ServiceDetail | null> {
  const service = await prisma.staticPage.findFirst({
    where: {
      slug,
      type: "service",
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      content: true,
    },
  });

  if (!service) {
    return null;
  }

  return {
    id: service.id,
    title: service.title,
    content: service.content ?? "",
  };
}
