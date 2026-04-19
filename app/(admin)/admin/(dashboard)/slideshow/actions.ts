"use server";

import { prisma } from "@/lib/prisma";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugifyFileName(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  const baseName = path.basename(fileName, ext);

  const safeBaseName = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return {
    ext,
    safeBaseName,
  };
}

async function saveImage(file: File) {
  const allowedMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/svg+xml",
  ];

  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error(
      "Ảnh slideshow chỉ chấp nhận PNG, JPG, JPEG, WEBP hoặc SVG.",
    );
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Ảnh slideshow không được vượt quá 5MB.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { ext, safeBaseName } = slugifyFileName(file.name);
  const finalFileName = `slideshow-${safeBaseName || "image"}-${Date.now()}${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "slideshow");
  await mkdir(uploadDir, { recursive: true });

  const outputPath = path.join(uploadDir, finalFileName);
  await writeFile(outputPath, buffer);

  const publicFilePath = `/uploads/slideshow/${finalFileName}`;

  const media = await prisma.media.create({
    data: {
      fileName: finalFileName,
      filePath: publicFilePath,
      fileType: "slideshow",
      mimeType: file.type,
      fileSize: file.size,
      title: "Slideshow image",
      altText: "Slideshow image",
    },
  });

  return media;
}

export async function createSlideshow(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();
  const altText = String(formData.get("altText") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const isActive = String(formData.get("isActive") ?? "1") === "1";
  const image = formData.get("image");

  if (!(image instanceof File) || image.size === 0) {
    throw new Error("Vui lòng chọn ảnh slideshow.");
  }

  const savedMedia = await saveImage(image);

  await prisma.slideshow.create({
    data: {
      title: title || null,
      link: link || null,
      altText: altText || null,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      isActive,
      imageId: savedMedia.id,
    },
  });

  revalidatePath("/admin/slideshow");
  revalidatePath("/", "layout");
  redirect("/admin/slideshow");
}

export async function updateSlideshow(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);
  if (!id) throw new Error("Slideshow không hợp lệ.");

  const title = String(formData.get("title") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();
  const altText = String(formData.get("altText") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const isActive = String(formData.get("isActive") ?? "1") === "1";
  const image = formData.get("image");

  const current = await prisma.slideshow.findUnique({
    where: { id },
    include: { image: true },
  });

  if (!current) throw new Error("Không tìm thấy slideshow.");

  let imageId = current.imageId;

  if (image instanceof File && image.size > 0) {
    const savedMedia = await saveImage(image);
    imageId = savedMedia.id;
  }

  await prisma.slideshow.update({
    where: { id },
    data: {
      title: title || null,
      link: link || null,
      altText: altText || null,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      isActive,
      imageId,
    },
  });

  revalidatePath("/admin/slideshow");
  revalidatePath("/", "layout");
  redirect("/admin/slideshow");
}

export async function deleteSlideshow(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);
  if (!id) return;

  const current = await prisma.slideshow.findUnique({
    where: { id },
    include: { image: true },
  });

  if (!current) return;

  await prisma.slideshow.delete({
    where: { id },
  });

  if (current.image?.filePath) {
    const absolutePath = path.join(
      process.cwd(),
      "public",
      current.image.filePath,
    );
    try {
      await unlink(absolutePath);
    } catch {}
  }

  await prisma.media.delete({
    where: { id: current.imageId },
  });

  revalidatePath("/admin/slideshow");
  revalidatePath("/", "layout");
  redirect("/admin/slideshow");
}
