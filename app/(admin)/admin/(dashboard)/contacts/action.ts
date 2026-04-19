"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type ContactStatus = "NEW" | "READ" | "REPLIED" | "SPAM";

type GetContactMessagesParams = {
  status?: string;
  q?: string;
  selectedId?: string;
};

type ContactCounts = {
  ALL: number;
  NEW: number;
  READ: number;
  REPLIED: number;
  SPAM: number;
};

const validStatuses: ContactStatus[] = ["NEW", "READ", "REPLIED", "SPAM"];

function normalizeStatus(value?: string): ContactStatus | undefined {
  if (!value || value === "ALL") return undefined;

  return validStatuses.includes(value as ContactStatus)
    ? (value as ContactStatus)
    : undefined;
}

export async function getContactMessages(params: GetContactMessagesParams) {
  const status = normalizeStatus(params.status);
  const q = String(params.q || "").trim();
  const selectedId = Number(params.selectedId);

  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            {
              fullName: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              phone: {
                contains: q,
              },
            },
            {
              email: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              subject: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              companyName: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [items, countsRaw, selectedItem] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        companyName: true,
        subject: true,
        message: true,
        status: true,
        sourcePage: true,
        noteInternal: true,
        sentToZalo: true,
        sentToEmail: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.contactMessage.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),
    selectedId && !Number.isNaN(selectedId)
      ? prisma.contactMessage.findUnique({
          where: { id: selectedId },
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            companyName: true,
            subject: true,
            message: true,
            serviceType: true,
            sourcePage: true,
            noteInternal: true,
            status: true,
            sentToZalo: true,
            sentToEmail: true,
            createdAt: true,
            updatedAt: true,
          },
        })
      : null,
  ]);

  const counts: ContactCounts = {
    ALL: items.length,
    NEW: 0,
    READ: 0,
    REPLIED: 0,
    SPAM: 0,
  };

  for (const item of countsRaw) {
    if (item.status === "NEW") counts.NEW = item._count._all;
    if (item.status === "READ") counts.READ = item._count._all;
    if (item.status === "REPLIED") counts.REPLIED = item._count._all;
    if (item.status === "SPAM") counts.SPAM = item._count._all;
  }

  return {
    filters: {
      status: status ?? "ALL",
      q,
    },
    counts,
    items,
    selectedItem,
  };
}

export async function updateContactStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const statusValue = String(formData.get("status") || "").trim();
  const status = normalizeStatus(statusValue);

  if (!id || Number.isNaN(id)) {
    throw new Error("Thiếu id liên hệ.");
  }

  if (!status) {
    throw new Error("Trạng thái không hợp lệ.");
  }

  await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/contacts");
}

export async function saveContactNote(formData: FormData) {
  const id = Number(formData.get("id"));
  const noteInternal = String(formData.get("noteInternal") || "").trim();

  if (!id || Number.isNaN(id)) {
    throw new Error("Thiếu id liên hệ.");
  }

  await prisma.contactMessage.update({
    where: { id },
    data: {
      noteInternal: noteInternal || null,
    },
  });

  revalidatePath("/admin/contacts");
}

export async function deleteContactMessage(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!id || Number.isNaN(id)) {
    throw new Error("Thiếu id liên hệ.");
  }

  await prisma.contactMessage.delete({
    where: { id },
  });

  revalidatePath("/admin/contacts");
}