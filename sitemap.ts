import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://kinglimousine.vn";

  const [staticPages, productCategories, products, blogs, newsList] =
    await Promise.all([
      prisma.staticPage.findMany({
        where: {
          status: "PUBLISHED",
        },
        select: {
          slug: true,
          updatedAt: true,
        },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      }),

      prisma.productCategory.findMany({
        where: {
          isActive: true,
        },
        select: {
          slug: true,
          updatedAt: true,
        },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      }),

      prisma.product.findMany({
        where: {
          status: "PUBLISHED",
          isActive: true,
        },
        select: {
          slug: true,
          updatedAt: true,
        },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      }),

      prisma.blog.findMany({
        where: {
          status: "PUBLISHED",
          isActive: true,
        },
        select: {
          slug: true,
          updatedAt: true,
        },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      }),

      prisma.news.findMany({
        where: {
          status: "PUBLISHED",
          isActive: true,
        },
        select: {
          slug: true,
          updatedAt: true,
        },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      }),
    ]);

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    ...staticPages.map((page) => ({
      url: `${siteUrl}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    ...productCategories.map((category) => ({
      url: `${siteUrl}/danh-muc/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...products.map((product) => ({
      url: `${siteUrl}/san-pham/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...blogs.map((blog) => ({
      url: `${siteUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...newsList.map((news) => ({
      url: `${siteUrl}/tin-tuc/${news.slug}`,
      lastModified: news.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}