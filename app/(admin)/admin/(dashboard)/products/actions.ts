"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  removeProductImage,
  saveProductImage,
} from "@/lib/admin/product-upload";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function buildUniqueSlug(title: string, ignoreId?: number) {
  const baseSlug = slugify(title) || `san-pham-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existed = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existed || existed.id === ignoreId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

function parseOptionalInt(value: FormDataEntryValue | null) {
  if (!value) return null;
  const num = Number(String(value));
  return Number.isNaN(num) || num <= 0 ? null : num;
}

function parseTagIds(formData: FormData) {
  const values = formData.getAll("tagIds");

  return Array.from(
    new Set(
      values
        .map((value) => Number(String(value)))
        .filter((value) => Number.isInteger(value) && value > 0),
    ),
  );
}

function parsePrice(value: FormDataEntryValue | null) {
  const raw = String(value ?? "")
    .trim()
    .replace(/\./g, "")
    .replace(/,/g, "");

  if (!raw) return null;

  const num = Number(raw);
  if (Number.isNaN(num)) {
    throw new Error("Giá sản phẩm không hợp lệ.");
  }

  return num.toFixed(2);
}

export async function createProduct(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const categoryId = parseOptionalInt(formData.get("categoryId"));
  const price = parsePrice(formData.get("price"));
  const tagIds = parseTagIds(formData);

  const isFeatured = String(formData.get("isFeatured") ?? "0") === "1";
  const isActive = String(formData.get("isActive") ?? "1") === "1";

  const imageFile = formData.get("thumbnail") as File | null;

  if (!title) {
    throw new Error("Tiêu đề sản phẩm không được để trống.");
  }

  const slug = await buildUniqueSlug(title);
  const media = await saveProductImage(imageFile);

  await prisma.product.create({
    data: {
      title,
      slug,
      summary: summary || null,
      content: content || null,
      price,
      categoryId,
      thumbnailId: media?.id ?? null,
      isFeatured,
      isActive,
      status: "PUBLISHED",
      publishedAt: new Date(),
      tags: {
        create: tagIds.map((tagId) => ({
          tagId,
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: number, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const categoryId = parseOptionalInt(formData.get("categoryId"));
  const price = parsePrice(formData.get("price"));
  const tagIds = parseTagIds(formData);

  const isActive = String(formData.get("isActive") ?? "1") === "1";
  const isFeatured = String(formData.get("isFeatured") ?? "0") === "1";

  if (!title) {
    throw new Error("Tiêu đề sản phẩm không được để trống.");
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      thumbnailId: true,
    },
  });

  if (!existingProduct) {
    throw new Error("Sản phẩm không tồn tại.");
  }

  const nextSlug =
    title !== "" ? await buildUniqueSlug(title, id) : existingProduct.slug;

  let thumbnailId = existingProduct.thumbnailId;

  const file = formData.get("thumbnail");
  if (file instanceof File && file.size > 0) {
    const media = await saveProductImage(file);
    thumbnailId = media?.id ?? existingProduct.thumbnailId ?? null;

    if (
      existingProduct.thumbnailId &&
      media?.id &&
      existingProduct.thumbnailId !== media.id
    ) {
      await removeProductImage(existingProduct.thumbnailId);
    }
  }

  await prisma.product.update({
    where: { id },
    data: {
      categoryId,
      title,
      slug: nextSlug,
      summary: summary || null,
      content: content || null,
      price,
      isActive,
      isFeatured,
      thumbnailId,
      tags: {
        deleteMany: {},
        create: tagIds.map((tagId) => ({
          tagId,
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!id || Number.isNaN(id)) {
    throw new Error("ID sản phẩm không hợp lệ.");
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      thumbnailId: true,
    },
  });

  if (!product) {
    throw new Error("Sản phẩm không tồn tại.");
  }

  await prisma.product.delete({
    where: { id: product.id },
  });

  if (product.thumbnailId) {
    await removeProductImage(product.thumbnailId);
  }

  revalidatePath("/admin/products");
}

export async function toggleProductFeatured(formData: FormData) {
  const id = Number(formData.get("id"));
  const currentValue = String(formData.get("currentValue")) === "true";

  if (!id || Number.isNaN(id)) {
    throw new Error("ID sản phẩm không hợp lệ.");
  }

  await prisma.product.update({
    where: { id },
    data: {
      isFeatured: !currentValue,
    },
  });

  revalidatePath("/admin/products");
}

export async function toggleProductActive(formData: FormData) {
  const id = Number(formData.get("id"));
  const currentValue = String(formData.get("currentValue")) === "true";

  if (!id || Number.isNaN(id)) {
    throw new Error("ID sản phẩm không hợp lệ.");
  }

  await prisma.product.update({
    where: { id },
    data: {
      isActive: !currentValue,
    },
  });

  revalidatePath("/admin/products");
}
