"use server";

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

export async function createWhyChooseUsItem(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim() || null;
  const content = String(formData.get("content") || "").trim() || null;

  if (!title) {
    throw new Error("Tiêu đề là bắt buộc.");
  }

  const slug = `vi-sao-chon-item-${toSlug(title)}`;

  const existed = await prisma.staticPage.findFirst({
    where: {
      slug,
      type: "why-choose-us-item",
    },
    select: { id: true },
  });

  if (existed) {
    throw new Error("Tiêu đề đã tồn tại.");
  }

  await prisma.staticPage.create({
    data: {
      title,
      slug,
      summary,
      content,
      type: "why-choose-us-item",
      status: "PUBLISHED",
      publishedAt: new Date(),
      showInMenu: false,
      sortOrder: 0,
    },
  });

  revalidatePath("/admin/why-choose-us/items");
  revalidatePath("/");
  redirect("/admin/why-choose-us/items");
}

export async function updateWhyChooseUsItem(id: number, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim() || null;
  const content = String(formData.get("content") || "").trim() || null;

  if (!title) {
    throw new Error("Tiêu đề là bắt buộc.");
  }

  const current = await prisma.staticPage.findUnique({
    where: { id },
    select: { id: true, type: true },
  });

  if (!current || current.type !== "why-choose-us-item") {
    throw new Error("Item không tồn tại.");
  }

  const slug = `vi-sao-chon-item-${toSlug(title)}`;

  const existed = await prisma.staticPage.findFirst({
    where: {
      slug,
      type: "why-choose-us-item",
      NOT: { id },
    },
    select: { id: true },
  });

  if (existed) {
    throw new Error("Tiêu đề đã tồn tại.");
  }

  await prisma.staticPage.update({
    where: { id },
    data: {
      title,
      slug,
      summary,
      content,
      type: "why-choose-us-item",
    },
  });

  revalidatePath("/admin/why-choose-us/items");
  revalidatePath(`/admin/why-choose-us/items/${id}/edit`);
  revalidatePath("/");
  redirect("/admin/why-choose-us/items");
}

export async function deleteWhyChooseUsItem(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id)) {
    throw new Error("ID không hợp lệ.");
  }

  const current = await prisma.staticPage.findUnique({
    where: { id },
    select: { id: true, type: true },
  });

  if (!current || current.type !== "why-choose-us-item") {
    throw new Error("Item không tồn tại.");
  }

  await prisma.staticPage.delete({
    where: { id },
  });

  revalidatePath("/admin/why-choose-us/items");
  revalidatePath("/");
}

export async function toggleWhyChooseUsItemFeatured(formData: FormData) {
  const id = Number(formData.get("id"));
  const currentValue = String(formData.get("currentValue")) === "true";

  if (!Number.isInteger(id)) {
    throw new Error("ID không hợp lệ.");
  }

  const current = await prisma.staticPage.findUnique({
    where: { id },
    select: { id: true, type: true },
  });

  if (!current || current.type !== "why-choose-us-item") {
    throw new Error("Item không tồn tại.");
  }

  await prisma.staticPage.update({
    where: { id },
    data: {
      showInMenu: !currentValue,
    },
  });

  revalidatePath("/admin/why-choose-us/items");
  revalidatePath("/");
}

export async function toggleWhyChooseUsItemVisible(formData: FormData) {
  const id = Number(formData.get("id"));
  const currentValue = String(formData.get("currentValue")) === "true";

  if (!Number.isInteger(id)) {
    throw new Error("ID không hợp lệ.");
  }

  const current = await prisma.staticPage.findUnique({
    where: { id },
    select: { publishedAt: true, type: true },
  });

  if (!current || current.type !== "why-choose-us-item") {
    throw new Error("Item không tồn tại.");
  }

  await prisma.staticPage.update({
    where: { id },
    data: {
      status: currentValue ? "DRAFT" : "PUBLISHED",
      publishedAt: currentValue ? null : (current.publishedAt ?? new Date()),
    },
  });

  revalidatePath("/admin/why-choose-us/items");
  revalidatePath("/");
}
