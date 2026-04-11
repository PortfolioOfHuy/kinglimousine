"use server";

import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export type SaveWebsiteLogoState = {
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

async function saveImageToLocal(
  file: File,
  prefix: "header-logo" | "footer-logo",
  altText: string,
) {
  const allowedMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/svg+xml",
  ];

  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("Định dạng ảnh không hợp lệ.");
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Dung lượng ảnh không được vượt quá 5MB.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { ext, safeBaseName } = slugifyFileName(file.name);
  const finalFileName = `${prefix}-${safeBaseName || "image"}-${Date.now()}${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "logo");
  await mkdir(uploadDir, { recursive: true });

  const outputPath = path.join(uploadDir, finalFileName);
  await writeFile(outputPath, buffer);

  const publicFilePath = `/uploads/logo/${finalFileName}`;

  return prisma.media.create({
    data: {
      fileName: finalFileName,
      filePath: publicFilePath,
      fileType: prefix,
      mimeType: file.type,
      fileSize: file.size,
      title: prefix === "header-logo" ? "Header Logo" : "Footer Logo",
      altText:
        altText ||
        (prefix === "header-logo"
          ? "Logo header website"
          : "Logo footer website"),
    },
  });
}

export async function saveWebsiteLogo(
  _prevState: SaveWebsiteLogoState,
  formData: FormData,
): Promise<SaveWebsiteLogoState> {
  try {
    const headerLogo = formData.get("headerLogo");
    const footerLogo = formData.get("footerLogo");
    const headerAltText = String(formData.get("headerAltText") ?? "").trim();
    const footerAltText = String(formData.get("footerAltText") ?? "").trim();

    const hasHeaderLogo = headerLogo instanceof File && headerLogo.size > 0;
    const hasFooterLogo = footerLogo instanceof File && footerLogo.size > 0;

    if (!hasHeaderLogo && !hasFooterLogo) {
      return {
        success: false,
        message: "Vui lòng chọn ít nhất 1 logo để cập nhật.",
      };
    }

    let headerMediaId: number | undefined;
    let footerMediaId: number | undefined;

    if (hasHeaderLogo) {
      const savedHeaderMedia = await saveImageToLocal(
        headerLogo,
        "header-logo",
        headerAltText,
      );
      headerMediaId = savedHeaderMedia.id;
    }

    if (hasFooterLogo) {
      const savedFooterMedia = await saveImageToLocal(
        footerLogo,
        "footer-logo",
        footerAltText,
      );
      footerMediaId = savedFooterMedia.id;
    }

    const websiteSetting = await prisma.websiteSetting.findFirst({
      orderBy: { id: "asc" },
    });

    if (websiteSetting) {
      await prisma.websiteSetting.update({
        where: { id: websiteSetting.id },
        data: {
          ...(headerMediaId ? { logoId: headerMediaId } : {}),
          ...(footerMediaId ? { footerLogoId: footerMediaId } : {}),
        },
      });
    } else {
      await prisma.websiteSetting.create({
        data: {
          siteName: "KINGLIMOUSINE",
          ...(headerMediaId ? { logoId: headerMediaId } : {}),
          ...(footerMediaId ? { footerLogoId: footerMediaId } : {}),
        },
      });
    }

    revalidatePath("/admin/logo");
    revalidatePath("/admin/settings");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Cập nhật logo header/footer thành công.",
    };
  } catch (error) {
    console.error("saveWebsiteLogo error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu logo.",
    };
  }
}
