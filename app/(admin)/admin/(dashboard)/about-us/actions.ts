"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const ABOUT_US_SLUG = "gioi-thieu";

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
  const safeBaseName = toSlug(baseName || "about-us-banner");
  const fileName = `${Date.now()}-${safeBaseName}${ext}`;

  const relativePath = `/uploads/about-us/${fileName}`;
  const absoluteDir = path.join(process.cwd(), "public", "uploads", "about-us");
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

export async function getAboutUs() {
  return prisma.staticPage.findUnique({
    where: { slug: ABOUT_US_SLUG },
    include: {
      bannerImage: true,
    },
  });
}

export async function saveAboutUs(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const bannerFile = formData.get("bannerImage") as File | null;

  if (!title) {
    throw new Error("Vui lòng nhập tiêu đề trang giới thiệu.");
  }

  const current = await prisma.staticPage.findUnique({
    where: { slug: ABOUT_US_SLUG },
    select: {
      id: true,
      bannerImageId: true,
    },
  });

  let bannerImageId = current?.bannerImageId ?? null;

  if (bannerFile && bannerFile.size > 0) {
    const media = await saveUploadedImage(bannerFile);
    bannerImageId = media?.id ?? null;
  }

  if (current) {
    await prisma.staticPage.update({
      where: { id: current.id },
      data: {
        title,
        slug: ABOUT_US_SLUG,
        summary: summary || null,
        content: content || null,
        bannerImageId,
        status: "PUBLISHED",
        showInMenu: false,
        publishedAt: new Date(),
      },
    });
  } else {
    await prisma.staticPage.create({
      data: {
        title,
        slug: ABOUT_US_SLUG,
        summary: summary || null,
        content: content || null,
        bannerImageId: bannerImageId ?? null,
        status: "PUBLISHED",
        showInMenu: false,
        publishedAt: new Date(),
        sortOrder: 0,
      },
    });
  }

  revalidatePath("/admin/about-us");
  revalidatePath("/gioi-thieu");
  redirect("/admin/about-us");
}