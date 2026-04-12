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
  const fileName = `${Date.now()}-${toSlug(baseName)}${ext}`;

  const relativePath = `/uploads/why-choose-us/${fileName}`;
  const absoluteDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "why-choose-us",
  );
  const absolutePath = path.join(absoluteDir, fileName);

  await fs.mkdir(absoluteDir, { recursive: true });
  await fs.writeFile(absolutePath, buffer);

  const media = await prisma.media.create({
    data: {
      fileName,
      filePath: relativePath,
      mimeType: file.type || null,
      fileSize: file.size || null,
    },
  });

  return media.id;
}

export async function saveWhyChooseUsSection(formData: FormData) {
  const summary = String(formData.get("summary") || "").trim() || null;
  const imageFile = formData.get("featuredImage") as File | null;

  const existing = await prisma.staticPage.findUnique({
    where: { slug: "vi-sao-chon-chung-toi" },
    select: {
      id: true,
      featuredImageId: true,
    },
  });

  let featuredImageId = existing?.featuredImageId ?? null;

  const uploadedImageId = await saveUploadedImage(imageFile);
  if (uploadedImageId) {
    featuredImageId = uploadedImageId;
  }

  if (existing) {
    await prisma.staticPage.update({
      where: { id: existing.id },
      data: {
        title: "Vì sao chọn chúng tôi",
        summary,
        featuredImageId,
        status: "PUBLISHED",
        publishedAt: new Date(),
        showInMenu: false,
      },
    });
  } else {
    await prisma.staticPage.create({
      data: {
        title: "Vì sao chọn chúng tôi",
        slug: "vi-sao-chon-chung-toi",
        summary,
        featuredImageId,
        status: "PUBLISHED",
        publishedAt: new Date(),
        showInMenu: false,
        sortOrder: 0,
      },
    });
  }

  revalidatePath("/admin/why-choose-us");
}
