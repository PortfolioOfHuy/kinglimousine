"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const WHY_CHOOSE_US_ITEM_TYPE = "why-choose-us-item";
const WHY_CHOOSE_US_ITEM_SLUG_PREFIX = "vi-sao-chon-item-";

function toSlug(value: string) {
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

function buildItemSlug(title: string) {
  const base = toSlug(title);
  if (!base) {
    throw new Error("Tiêu đề không hợp lệ.");
  }

  return `${WHY_CHOOSE_US_ITEM_SLUG_PREFIX}${base}`;
}

function isWhyChooseUsItem(record: { type: string | null; slug: string }) {
  return (
    record.type === WHY_CHOOSE_US_ITEM_TYPE ||
    record.slug.startsWith(WHY_CHOOSE_US_ITEM_SLUG_PREFIX)
  );
}

async function getWhyChooseUsItemOrThrow(id: number) {
  if (!Number.isInteger(id)) {
    throw new Error("ID không hợp lệ.");
  }

  const current = await prisma.staticPage.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      type: true,
      showInMenu: true,
      status: true,
      publishedAt: true,
    },
  });

  if (!current || !isWhyChooseUsItem(current)) {
    throw new Error("Item không tồn tại.");
  }

  return current;
}

async function ensureUniqueItemSlug(slug: string, ignoreId?: number) {
  const existed = await prisma.staticPage.findFirst({
    where: {
      slug,
      ...(ignoreId ? { NOT: { id: ignoreId } } : {}),
    },
    select: { id: true },
  });

  if (existed) {
    throw new Error("Tiêu đề đã tồn tại.");
  }
}

function revalidateWhyChooseUsPaths(id?: number) {
  revalidatePath("/admin/why-choose-us/items");
  revalidatePath("/");

  if (id) {
    revalidatePath(`/admin/why-choose-us/items/${id}/edit`);
  }
}

export async function createWhyChooseUsItem(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "").trim() || null;

  if (!title) {
    throw new Error("Tiêu đề là bắt buộc.");
  }

  const slug = buildItemSlug(title);

  await ensureUniqueItemSlug(slug);

  await prisma.staticPage.create({
    data: {
      title,
      slug,
      summary,
      content,
      type: WHY_CHOOSE_US_ITEM_TYPE,
      status: "PUBLISHED",
      publishedAt: new Date(),
      showInMenu: false,
      sortOrder: 0,
    },
  });

  revalidateWhyChooseUsPaths();
  redirect("/admin/why-choose-us/items");
}

export async function updateWhyChooseUsItem(id: number, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "").trim() || null;

  if (!title) {
    throw new Error("Tiêu đề là bắt buộc.");
  }

  await getWhyChooseUsItemOrThrow(id);

  const slug = buildItemSlug(title);

  await ensureUniqueItemSlug(slug, id);

  await prisma.staticPage.update({
    where: { id },
    data: {
      title,
      slug,
      summary,
      content,
      type: WHY_CHOOSE_US_ITEM_TYPE,
    },
  });

  revalidateWhyChooseUsPaths(id);
  redirect("/admin/why-choose-us/items");
}

export async function deleteWhyChooseUsItem(formData: FormData) {
  const id = Number(formData.get("id"));

  await getWhyChooseUsItemOrThrow(id);

  await prisma.staticPage.delete({
    where: { id },
  });

  revalidateWhyChooseUsPaths();
}

export async function toggleWhyChooseUsItemFeatured(formData: FormData) {
  const id = Number(formData.get("id"));

  const current = await getWhyChooseUsItemOrThrow(id);

  await prisma.staticPage.update({
    where: { id },
    data: {
      showInMenu: !current.showInMenu,
      type: WHY_CHOOSE_US_ITEM_TYPE,
    },
  });

  revalidateWhyChooseUsPaths();
}

export async function toggleWhyChooseUsItemVisible(formData: FormData) {
  const id = Number(formData.get("id"));

  const current = await getWhyChooseUsItemOrThrow(id);
  const nextVisible = current.status !== "PUBLISHED";

  await prisma.staticPage.update({
    where: { id },
    data: {
      status: nextVisible ? "PUBLISHED" : "DRAFT",
      publishedAt: nextVisible ? (current.publishedAt ?? new Date()) : null,
      type: WHY_CHOOSE_US_ITEM_TYPE,
    },
  });

  revalidateWhyChooseUsPaths();
}
