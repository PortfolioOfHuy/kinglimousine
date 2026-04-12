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
  const fileName = `${Date.now()}-${toSlug(baseName)}${ext}`;

  const relativePath = `/uploads/how-to-book/${fileName}`;
  const absoluteDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "how-to-book",
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

export async function createHowToBook(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim() || null;
  const content = String(formData.get("content") || "").trim() || null;
  const imageFile = formData.get("featuredImage") as File | null;

  if (!title) {
    throw new Error("Tiêu đề là bắt buộc.");
  }

  const slug = `dat-xe-${toSlug(title)}`;

  const existed = await prisma.staticPage.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existed) {
    throw new Error("Tiêu đề đã tồn tại, vui lòng đổi tiêu đề khác.");
  }

  const featuredImageId = await saveUploadedImage(imageFile);

  await prisma.staticPage.create({
    data: {
      title,
      slug,
      summary,
      content,
      type: "how-to-book",
      featuredImageId,
      sortOrder: 0,
      showInMenu: false,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  revalidatePath("/admin/how-to-book");
  redirect("/admin/how-to-book");
}

export async function updateHowToBook(id: number, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim() || null;
  const content = String(formData.get("content") || "").trim() || null;
  const imageFile = formData.get("featuredImage") as File | null;

  if (!title) {
    throw new Error("Tiêu đề là bắt buộc.");
  }

  const current = await prisma.staticPage.findUnique({
    where: { id },
    select: {
      id: true,
      featuredImageId: true,
    },
  });

  if (!current) {
    throw new Error("Bài viết không tồn tại.");
  }

  const slug = `dat-xe-${toSlug(title)}`;

  const existed = await prisma.staticPage.findFirst({
    where: {
      slug,
      NOT: { id },
    },
    select: { id: true },
  });

  if (existed) {
    throw new Error("Tiêu đề đã tồn tại, vui lòng đổi tiêu đề khác.");
  }

  let featuredImageId = current.featuredImageId;

  const uploadedImageId = await saveUploadedImage(imageFile);
  if (uploadedImageId) {
    featuredImageId = uploadedImageId;
  }

  await prisma.staticPage.update({
    where: { id },
    data: {
      title,
      slug,
      summary,
      content,
      featuredImageId,
    },
  });

  revalidatePath("/admin/how-to-book");
  revalidatePath(`/admin/how-to-book/${id}/edit`);
  redirect("/admin/how-to-book");
}

export async function deleteHowToBook(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id)) {
    throw new Error("ID không hợp lệ.");
  }

  await prisma.staticPage.delete({
    where: { id },
  });

  revalidatePath("/admin/how-to-book");
}

export async function toggleHowToBookFeatured(formData: FormData) {
  const id = Number(formData.get("id"));
  const currentValue = String(formData.get("currentValue")) === "true";

  if (!Number.isInteger(id)) {
    throw new Error("ID không hợp lệ.");
  }

  await prisma.staticPage.update({
    where: { id },
    data: {
      showInMenu: !currentValue,
    },
  });

  revalidatePath("/admin/how-to-book");
}

export async function toggleHowToBookVisible(formData: FormData) {
  const id = Number(formData.get("id"));
  const currentValue = String(formData.get("currentValue")) === "true";

  if (!Number.isInteger(id)) {
    throw new Error("ID không hợp lệ.");
  }

  const current = await prisma.staticPage.findUnique({
    where: { id },
    select: { publishedAt: true },
  });

  await prisma.staticPage.update({
    where: { id },
    data: {
      status: currentValue ? "DRAFT" : "PUBLISHED",
      publishedAt: currentValue ? null : (current?.publishedAt ?? new Date()),
    },
  });

  revalidatePath("/admin/how-to-book");
}
