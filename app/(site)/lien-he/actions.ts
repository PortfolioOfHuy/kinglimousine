"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type SubmitState = {
  success: boolean;
  message: string;
};

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").trim();
}

async function sendLeadToZaloOa(payload: {
  fullName: string;
  phone: string;
  email?: string | null;
  subject?: string | null;
  message?: string | null;
  companyName?: string | null;
}) {
  const integration = await prisma.integrationSetting.findFirst({
    where: {
      type: "ZALO_OA",
      isActive: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (!integration) {
    return {
      ok: false,
      reason: "Chưa cấu hình Zalo OA.",
    };
  }

  const value = integration.valueJson as {
    webhookUrl?: string;
    secret?: string;
  };

  if (!value?.webhookUrl) {
    return {
      ok: false,
      reason: "Thiếu webhookUrl Zalo OA.",
    };
  }

  const response = await fetch(value.webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(value.secret
        ? {
            "x-webhook-secret": value.secret,
          }
        : {}),
    },
    body: JSON.stringify({
      type: "website_contact",
      source: "website",
      createdAt: new Date().toISOString(),
      data: {
        fullName: payload.fullName,
        phone: payload.phone,
        email: payload.email ?? null,
        subject: payload.subject ?? null,
        message: payload.message ?? null,
        companyName: payload.companyName ?? null,
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return {
      ok: false,
      reason: text || `Webhook lỗi ${response.status}.`,
    };
  }

  return {
    ok: true,
  };
}

export async function submitContactForm(
  _prevState: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const fullName = String(formData.get("fullName") || "").trim();
  const phone = normalizePhone(String(formData.get("phone") || ""));
  const email = String(formData.get("email") || "").trim();
  const companyName = String(formData.get("companyName") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!fullName) {
    return {
      success: false,
      message: "Vui lòng nhập họ và tên.",
    };
  }

  if (!phone) {
    return {
      success: false,
      message: "Vui lòng nhập số điện thoại.",
    };
  }

  const created = await prisma.contactMessage.create({
    data: {
      fullName,
      phone,
      email: email || null,
      companyName: companyName || null,
      subject: subject || null,
      message: message || null,
      sourcePage: "/lien-he",
      status: "NEW",
      sentToZalo: false,
      sentToEmail: false,
    },
    select: {
      id: true,
    },
  });

  const zaloResult = await sendLeadToZaloOa({
    fullName,
    phone,
    email: email || null,
    companyName: companyName || null,
    subject: subject || null,
    message: message || null,
  });

  if (zaloResult.ok) {
    await prisma.contactMessage.update({
      where: { id: created.id },
      data: {
        sentToZalo: true,
      },
    });
  }

  revalidatePath("/lien-he");

  return {
    success: true,
    message: zaloResult.ok
      ? "Gửi thông tin thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất."
      : "Thông tin đã được ghi nhận. Hệ thống Zalo OA đang tạm thời chưa kết nối.",
  };
}