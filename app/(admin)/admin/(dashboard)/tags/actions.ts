"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createTag(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  if (!name) {
    throw new Error("Tên tag không được để trống.");
  }

  const slug = slugInput ? slugify(slugInput) : slugify(name);

  if (!slug) {
    throw new Error("Slug không hợp lệ.");
  }

  const existed = await prisma.tag.findFirst({
    where: {
      OR: [{ name }, { slug }],
    },
  });

  if (existed) {
    throw new Error("Tag đã tồn tại tên hoặc slug.");
  }

  await prisma.tag.create({
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}

export async function updateTag(id: number, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  if (!name) {
    throw new Error("Tên tag không được để trống.");
  }

  const slug = slugInput ? slugify(slugInput) : slugify(name);

  if (!slug) {
    throw new Error("Slug không hợp lệ.");
  }

  const existed = await prisma.tag.findFirst({
    where: {
      AND: [
        {
          OR: [{ name }, { slug }],
        },
        {
          id: {
            not: id,
          },
        },
      ],
    },
  });

  if (existed) {
    throw new Error("Tag đã tồn tại tên hoặc slug.");
  }

  await prisma.tag.update({
    where: { id },
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/admin/tags");
  revalidatePath(`/admin/tags/${id}/edit`);
  redirect("/admin/tags");
}

export async function deleteTag(formData: FormData) {
  const id = Number(formData.get("id"));

  if (Number.isNaN(id)) {
    throw new Error("ID tag không hợp lệ.");
  }

  await prisma.tag.delete({
    where: { id },
  });

  revalidatePath("/admin/tags");
}
