import { prisma } from "@/lib/prisma";

export type SiteProductDetail = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  price: string | null;
  oldPrice: string | null;
  image: string;
  imageAlt: string;
  bannerImage: string;
  bannerAlt: string;
  categoryName: string | null;
  tags: string[];
};

function formatPrice(value: unknown) {
  if (value == null) return null;

  const num = Number(value);
  if (Number.isNaN(num)) return null;

  return new Intl.NumberFormat("vi-VN").format(num);
}

export async function getProductDetailBySlug(
  slug: string,
): Promise<SiteProductDetail | null> {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      isActive: true,
      status: "PUBLISHED",
    },
    include: {
      category: true,
      thumbnail: true,
      bannerImage: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!product) return null;

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    summary: product.summary || "",
    content: product.content || "",
    price: formatPrice(product.price),
    oldPrice: formatPrice(product.oldPrice),
    image: product.thumbnail?.filePath || "/images/placeholder-product.jpg",
    imageAlt: product.thumbnail?.altText || product.title,
    bannerImage:
      product.bannerImage?.filePath ||
      product.thumbnail?.filePath ||
      "/images/placeholder-product.jpg",
    bannerAlt: product.bannerImage?.altText || product.title,
    categoryName: product.category?.name || null,
    tags: product.tags.map((item) => item.tag.name),
  };
}