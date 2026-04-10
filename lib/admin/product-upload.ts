import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

const PRODUCT_UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "products",
);

const PRODUCT_PUBLIC_PREFIX = "/uploads/products";

function getExtension(fileName: string) {
  const ext = path.extname(fileName || "").toLowerCase();
  return ext || ".jpg";
}

export async function saveProductImage(file: File | null | undefined) {
  if (!file || file.size <= 0) {
    return null;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File tải lên phải là hình ảnh.");
  }

  await mkdir(PRODUCT_UPLOAD_DIR, { recursive: true });

  const ext = getExtension(file.name);
  const fileName = `${Date.now()}-${randomUUID()}${ext}`;
  const absolutePath = path.join(PRODUCT_UPLOAD_DIR, fileName);
  const relativePath = `${PRODUCT_PUBLIC_PREFIX}/${fileName}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(absolutePath, buffer);

  const media = await prisma.media.create({
    data: {
      fileName,
      filePath: relativePath,
      fileType: "image",
      mimeType: file.type || null,
      fileSize: file.size || null,
      title: file.name || fileName,
    },
  });

  return media;
}

export async function removeProductImage(mediaId?: number | null) {
  if (!mediaId) return;

  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    select: {
      id: true,
      filePath: true,
    },
  });

  if (!media) return;

  await prisma.media.delete({
    where: { id: media.id },
  });

  if (media.filePath?.startsWith(PRODUCT_PUBLIC_PREFIX)) {
    const absolutePath = path.join(
      process.cwd(),
      "public",
      media.filePath.replace(/^\/+/, ""),
    );

    try {
      await unlink(absolutePath);
    } catch {
      // bỏ qua nếu file đã không còn
    }
  }
}
