"use server";

import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export type SaveWebsiteFaviconState = {
  success: boolean;
  message: string;
};

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

export async function saveWebsiteFavicon(
  _prevState: SaveWebsiteFaviconState,
  formData: FormData,
): Promise<SaveWebsiteFaviconState> {
  try {
    const file = formData.get("favicon");
    const altText = String(formData.get("altText") ?? "").trim();

    if (!(file instanceof File) || file.size === 0) {
      return {
        success: false,
        message: "Vui lòng chọn file favicon.",
      };
    }

    const allowedMimeTypes = [
      "image/png",
      "image/x-icon",
      "image/vnd.microsoft.icon",
      "image/svg+xml",
      "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return {
        success: false,
        message: "Favicon chỉ chấp nhận PNG, ICO, SVG hoặc WEBP.",
      };
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        message: "Dung lượng favicon không được vượt quá 2MB.",
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { ext, safeBaseName } = slugifyFileName(file.name);
    const finalFileName = `${safeBaseName || "favicon"}-${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "favicon");
    await mkdir(uploadDir, { recursive: true });

    const outputPath = path.join(uploadDir, finalFileName);
    await writeFile(outputPath, buffer);

    const publicFilePath = `/uploads/favicon/${finalFileName}`;

    const createdMedia = await prisma.media.create({
      data: {
        fileName: finalFileName,
        filePath: publicFilePath,
        fileType: "favicon",
        mimeType: file.type,
        fileSize: file.size,
        title: "Website Favicon",
        altText: altText || "Favicon website",
      },
    });

    const websiteSetting = await prisma.websiteSetting.findFirst({
      orderBy: { id: "asc" },
    });

    if (websiteSetting) {
      await prisma.websiteSetting.update({
        where: { id: websiteSetting.id },
        data: {
          faviconId: createdMedia.id,
        },
      });
    } else {
      await prisma.websiteSetting.create({
        data: {
          siteName: "KINGLIMOUSINE",
          faviconId: createdMedia.id,
        },
      });
    }

    revalidatePath("/admin/favicon");
    revalidatePath("/admin/settings");
    revalidatePath("/");

    return {
      success: true,
      message: "Cập nhật favicon thành công.",
    };
  } catch (error) {
    console.error("saveWebsiteFavicon error:", error);

    return {
      success: false,
      message: "Có lỗi xảy ra khi lưu favicon.",
    };
  }
}
