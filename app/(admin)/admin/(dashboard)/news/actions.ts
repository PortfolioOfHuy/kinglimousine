"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function saveUploadedImage(file: File | null) {
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || ".jpg";
  const baseName = path.basename(file.name, ext);
  const safeBaseName = toSlug(baseName || "news");
  const fileName = `${Date.now()}-${safeBaseName}${ext}`;

  const relativePath = `/uploads/news/${fileName}`;
  const absoluteDir = path.join(process.cwd(), "public", "uploads", "news");
  const absolutePath = path.join(absoluteDir, fileName);

  await fs.mkdir(absoluteDir, { recursive: true });
  await fs.writeFile(absolutePath, buffer);

  const media = await prisma.media.create({
    data: {
      fileName,
      filePath: relativePath,
      mimeType: file.type || null,
      fileSize: file.size || null,
      title: baseName || fileName,
      altText: baseName || fileName,
    },
  });

  return media;
}

export async function createNews(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const imageFile = formData.get("thumbnail") as File | null;

  if (!title) {
    throw new Error("Vui lòng nhập tiêu đề tin tức.");
  }

  let slug = toSlug(title);
  if (!slug) slug = `tin-tuc-${Date.now()}`;

  const existed = await prisma.news.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existed) {
    slug = `${slug}-${Date.now()}`;
  }

  let thumbnailId: number | null = null;

  if (imageFile && imageFile.size > 0) {
    const media = await saveUploadedImage(imageFile);
    thumbnailId = media?.id ?? null;
  }

  await prisma.news.create({
    data: {
      title,
      slug,
      summary: summary || null,
      content: content || null,
      thumbnailId,
      status: "PUBLISHED",
      isActive: true,
      isFeatured: false,
      publishedAt: new Date(),
      sortOrder: 0,
      authorName: null,
    },
  });

  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function updateNews(formData: FormData) {
  const id = Number(formData.get("id"));
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const imageFile = formData.get("thumbnail") as File | null;

  if (!id || Number.isNaN(id)) {
    throw new Error("Thiếu id tin tức.");
  }

  if (!title) {
    throw new Error("Vui lòng nhập tiêu đề tin tức.");
  }

  const current = await prisma.news.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      thumbnailId: true,
    },
  });

  if (!current) {
    throw new Error("Không tìm thấy tin tức.");
  }

  let slug = toSlug(title);
  if (!slug) slug = current.slug;

  const existed = await prisma.news.findFirst({
    where: {
      slug,
      NOT: { id },
    },
    select: { id: true },
  });

  if (existed) {
    slug = `${slug}-${Date.now()}`;
  }

  let thumbnailId = current.thumbnailId;

  if (imageFile && imageFile.size > 0) {
    const media = await saveUploadedImage(imageFile);
    thumbnailId = media?.id ?? null;
  }

  await prisma.news.update({
    where: { id },
    data: {
      title,
      slug,
      summary: summary || null,
      content: content || null,
      thumbnailId,
      status: "PUBLISHED",
    },
  });

  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function deleteNews(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!id || Number.isNaN(id)) {
    throw new Error("Thiếu id tin tức.");
  }

  await prisma.news.delete({
    where: { id },
  });

  revalidatePath("/admin/news");
}

export async function toggleNewsActive(formData: FormData) {
  const id = Number(formData.get("id"));
  const currentValue = String(formData.get("currentValue")) === "true";

  if (!id || Number.isNaN(id)) {
    throw new Error("Thiếu id tin tức.");
  }

  await prisma.news.update({
    where: { id },
    data: {
      isActive: !currentValue,
    },
  });

  revalidatePath("/admin/news");
}
