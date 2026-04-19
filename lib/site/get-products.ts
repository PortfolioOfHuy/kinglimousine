import { prisma } from "@/lib/prisma";

export type SiteProductItem = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  price: string | null;
  oldPrice: string | null;
  image: string;
  imageAlt: string;
  categoryName: string | null;
  tags: string[];
};

function formatPrice(value: unknown) {
  if (value == null) return null;

  const num = Number(value);
  if (Number.isNaN(num)) return null;

  return new Intl.NumberFormat("vi-VN").format(num);
}

function stripHtml(html: string | null | undefined) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/div>/gi, "\n")
    .replace(/<div[^>]*>/gi, "")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getProducts(): Promise<SiteProductItem[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      status: "PUBLISHED",
    },
    include: {
      category: true,
      thumbnail: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: [
      { sortOrder: "asc" },
      { publishedAt: "desc" },
      { updatedAt: "desc" },
    ],
  });

  return products.map((product) => ({
    id: product.id,
    title: product.title,
    slug: product.slug,
    summary: stripHtml(product.summary),
    price: formatPrice(product.price),
    oldPrice: formatPrice(product.oldPrice),
    image: product.thumbnail?.filePath || "/images/placeholder-product.jpg",
    imageAlt: product.thumbnail?.altText || product.title,
    categoryName: product.category?.name || null,
    tags: product.tags.map((item) => item.tag.name),
  }));
}