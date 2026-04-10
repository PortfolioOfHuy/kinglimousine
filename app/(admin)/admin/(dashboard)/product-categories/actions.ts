"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

async function buildUniqueSlug(name: string, ignoreId?: number) {
  const baseSlug = slugify(name) || `danh-muc-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existed = await prisma.productCategory.findUnique({
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

export async function createProductCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("Tên danh mục không được để trống.");
  }

  const slug = await buildUniqueSlug(name);

  await prisma.productCategory.create({
    data: {
      name,
      slug,
      isFeatured: false,
      isActive: true,
      sortOrder: 0,
    },
  });

  revalidatePath("/admin/product-categories");
  redirect("/admin/product-categories");
}

export async function updateProductCategory(id: number, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const isFeatured = formData.get("isFeatured") === "on";
  const isActive = formData.get("isActive") === "on";

  if (!name) {
    throw new Error("Tên danh mục không được để trống.");
  }

  const slug = await buildUniqueSlug(name, id);

  await prisma.productCategory.update({
    where: { id },
    data: {
      name,
      slug,
      isFeatured,
      isActive,
    },
  });

  revalidatePath("/admin/product-categories");
  redirect("/admin/product-categories");
}

export async function deleteProductCategory(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!id || Number.isNaN(id)) {
    throw new Error("ID danh mục không hợp lệ.");
  }

  await prisma.productCategory.delete({
    where: { id },
  });

  revalidatePath("/admin/product-categories");
}

export async function toggleProductCategoryFeatured(formData: FormData) {
  const id = Number(formData.get("id"));
  const currentValue = String(formData.get("currentValue")) === "true";

  if (!id || Number.isNaN(id)) {
    throw new Error("ID danh mục không hợp lệ.");
  }

  await prisma.productCategory.update({
    where: { id },
    data: {
      isFeatured: !currentValue,
    },
  });

  revalidatePath("/admin/product-categories");
}

export async function toggleProductCategoryActive(formData: FormData) {
  const id = Number(formData.get("id"));
  const currentValue = String(formData.get("currentValue")) === "true";

  if (!id || Number.isNaN(id)) {
    throw new Error("ID danh mục không hợp lệ.");
  }

  await prisma.productCategory.update({
    where: { id },
    data: {
      isActive: !currentValue,
    },
  });

  revalidatePath("/admin/product-categories");
}
