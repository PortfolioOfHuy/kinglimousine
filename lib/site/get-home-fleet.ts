import { prisma } from "@/lib/prisma";

export type FleetCategoryItem = {
  id: number;
  name: string;
  slug: string;
};

export type FleetProductItem = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image: string;
  imageAlt: string;
  priceText: string | null;
  categorySlug: string;
  categoryName: string;
  tags?: string[];
};

export type HomeFleetData = {
  categories: FleetCategoryItem[];
  products: FleetProductItem[];
};

function formatPrice(price: unknown) {
  if (price === null || price === undefined) return null;

  const numericPrice =
    typeof price === "object" && price !== null && "toNumber" in price
      ? (price as { toNumber: () => number }).toNumber()
      : Number(price);

  if (Number.isNaN(numericPrice)) return null;

  return `${numericPrice.toLocaleString("vi-VN")} VND`;
}

function normalizeImagePath(path: string) {
  return path.startsWith("http") || path.startsWith("/") ? path : `/${path}`;
}

export async function getHomeFleet(): Promise<HomeFleetData> {
  const [categories, products] = await Promise.all([
    prisma.productCategory.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        status: "PUBLISHED",
        category: {
          isActive: true,
          isFeatured: true,
        },
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
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }),
  ]);

  const featuredCategorySlugs = new Set(
    categories.map((category) => category.slug),
  );

  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    })),
    products: products
      .filter(
        (product) =>
          product.thumbnail?.filePath &&
          product.category &&
          featuredCategorySlugs.has(product.category.slug),
      )
      .map((product) => ({
        id: product.id,
        title: product.title,
        slug: product.slug,
        summary: product.summary ?? "",
        image: normalizeImagePath(product.thumbnail!.filePath),
        imageAlt: product.thumbnail?.altText ?? product.title,
        priceText: formatPrice(product.price),
        categorySlug: product.category!.slug,
        categoryName: product.category!.name,
        tags: product.tags.map((item) => item.tag.name),
      })),
  };
}
