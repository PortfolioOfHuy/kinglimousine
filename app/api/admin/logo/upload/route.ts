import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "File không hợp lệ." },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Chỉ chấp nhận file ảnh." },
        { status: 400 },
      );
    }

    const allowedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Định dạng ảnh không được hỗ trợ." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name.replace(/\s+/g, "-").toLowerCase();
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const fileName = `${baseName}-${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "logo");
    await mkdir(uploadDir, { recursive: true });

    const fullFilePath = path.join(uploadDir, fileName);
    await writeFile(fullFilePath, buffer);

    const publicFilePath = `/uploads/logo/${fileName}`;

    const media = await prisma.media.create({
      data: {
        fileName,
        filePath: publicFilePath,
        fileType: "logo",
        mimeType: file.type,
        fileSize: file.size,
        title: "Logo website",
        altText: "Logo website",
      },
    });

    let websiteSetting = await prisma.websiteSetting.findFirst();

    if (!websiteSetting) {
      websiteSetting = await prisma.websiteSetting.create({
        data: {
          siteName: "KINGLIMOUSINE",
          logoId: media.id,
        },
      });
    } else {
      websiteSetting = await prisma.websiteSetting.update({
        where: { id: websiteSetting.id },
        data: {
          logoId: media.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Upload logo thành công.",
      data: {
        media,
        websiteSetting,
      },
    });
  } catch (error) {
    console.error("UPLOAD_LOGO_ERROR", error);

    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra khi upload logo." },
      { status: 500 },
    );
  }
}
