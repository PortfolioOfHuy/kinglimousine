"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
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
  const safeBaseName = toSlug(baseName || "cta");
  const fileName = `${Date.now()}-${safeBaseName}${ext}`;

  const relativePath = `/uploads/settings/${fileName}`;
  const absoluteDir = path.join(process.cwd(), "public", "uploads", "settings");
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

export async function updateHomeCta(formData: FormData) {
  const ctaTitle = String(formData.get("ctaTitle") || "").trim();
  const ctaDescription = String(formData.get("ctaDescription") || "").trim();
  const ctaIsActive = String(formData.get("ctaIsActive") || "") === "1";
  const imageFile = formData.get("ctaBackgroundImage") as File | null;

  const current = await prisma.websiteSetting.findFirst({
    orderBy: { id: "asc" },
    select: {
      id: true,
      ctaBackgroundImageId: true,
    },
  });

  let ctaBackgroundImageId = current?.ctaBackgroundImageId ?? null;

  if (imageFile && imageFile.size > 0) {
    const media = await saveUploadedImage(imageFile);
    ctaBackgroundImageId = media?.id ?? null;
  }

  if (current) {
    await prisma.websiteSetting.update({
      where: { id: current.id },
      data: {
        ctaTitle: ctaTitle || null,
        ctaDescription: ctaDescription || null,
        ctaIsActive,
        ctaBackgroundImageId,
      },
    });
  } else {
    await prisma.websiteSetting.create({
      data: {
        siteName: "KING LIMOUSINE",
        ctaTitle: ctaTitle || null,
        ctaDescription: ctaDescription || null,
        ctaIsActive,
        ctaBackgroundImageId,
      },
    });
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
