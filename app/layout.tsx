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
  const siteName = websiteSetting?.siteName?.trim() || "KINGLIMOUSINE";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kinglimousine.vn";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s`,
    },
    description:
      "Dịch vụ vận chuyển, cho thuê xe và đặt xe tiện lợi, nhanh chóng, chuyên nghiệp.",
    applicationName: siteName,
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      type: "website",
      siteName,
      title: siteName,
      description:
        "Dịch vụ vận chuyển, cho thuê xe và đặt xe tiện lợi, nhanh chóng, chuyên nghiệp.",
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description:
        "Dịch vụ vận chuyển, cho thuê xe và đặt xe tiện lợi, nhanh chóng, chuyên nghiệp.",
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