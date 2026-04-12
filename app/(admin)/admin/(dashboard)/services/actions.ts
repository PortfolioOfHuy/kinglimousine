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

  const relativePath = `/uploads/services/${fileName}`;
  const absoluteDir = path.join(process.cwd(), "public", "uploads", "services");
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

export async function createService(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim() || null;
  const content = String(formData.get("content") || "").trim() || null;
  const imageFile = formData.get("featuredImage") as File | null;

  if (!title) {
    throw new Error("Tiêu đề dịch vụ là bắt buộc.");
  }

  const slug = `dich-vu-${toSlug(title)}`;

  const existed = await prisma.staticPage.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existed) {
    throw new Error("Tên dịch vụ đã tồn tại, vui lòng đổi tiêu đề.");
  }

  const featuredImageId = await saveUploadedImage(imageFile);

  await prisma.staticPage.create({
    data: {
      title,
      slug,
      summary,
      content,
      featuredImageId,
      sortOrder: 0,
      showInMenu: false,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateService(id: number, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim() || null;
  const content = String(formData.get("content") || "").trim() || null;
  const imageFile = formData.get("featuredImage") as File | null;

  if (!title) {
    throw new Error("Tiêu đề dịch vụ là bắt buộc.");
  }

  const current = await prisma.staticPage.findUnique({
    where: { id },
    select: {
      id: true,
      featuredImageId: true,
    },
  });

  if (!current) {
    throw new Error("Dịch vụ không tồn tại.");
  }

  const slug = `dich-vu-${toSlug(title)}`;

  const existed = await prisma.staticPage.findFirst({
    where: {
      slug,
      NOT: { id },
    },
    select: { id: true },
  });

  if (existed) {
    throw new Error("Tên dịch vụ đã tồn tại, vui lòng đổi tiêu đề.");
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

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}/edit`);
  redirect("/admin/services");
}

export async function deleteService(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id)) {
    throw new Error("ID dịch vụ không hợp lệ.");
  }

  await prisma.staticPage.delete({
    where: { id },
  });

  revalidatePath("/admin/services");
}

export async function toggleServiceFeatured(formData: FormData) {
  const id = Number(formData.get("id"));
  const currentValue = String(formData.get("currentValue")) === "true";

  if (!Number.isInteger(id)) {
    throw new Error("ID dịch vụ không hợp lệ.");
  }

  await prisma.staticPage.update({
    where: { id },
    data: {
      showInMenu: !currentValue,
    },
  });

  revalidatePath("/admin/services");
}

export async function toggleServiceVisible(formData: FormData) {
  const id = Number(formData.get("id"));
  const currentValue = String(formData.get("currentValue")) === "true";

  if (!Number.isInteger(id)) {
    throw new Error("ID dịch vụ không hợp lệ.");
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

  revalidatePath("/admin/services");
}
