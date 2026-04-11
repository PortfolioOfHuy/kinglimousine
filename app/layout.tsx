import "./globals.css";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const websiteSetting = await prisma.websiteSetting.findFirst({
    orderBy: { id: "asc" },
    include: {
      favicon: true,
    },
  });

  const faviconUrl = websiteSetting?.favicon?.filePath || "/favicon.ico";

  return {
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
