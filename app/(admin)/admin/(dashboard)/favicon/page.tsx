import { prisma } from "@/lib/prisma";
import FaviconForm from "@/components/modules/admin/favicon/FaviconForm";
import { saveWebsiteFavicon } from "./actions";

export default async function AdminFaviconPage() {
  const websiteSetting = await prisma.websiteSetting.findFirst({
    orderBy: { id: "asc" },
    include: {
      favicon: true,
    },
  });

  const initialValues = {
    siteName: websiteSetting?.siteName ?? "",
    faviconId: websiteSetting?.faviconId ?? null,
    faviconPath: websiteSetting?.favicon?.filePath ?? "",
    faviconAltText: websiteSetting?.favicon?.altText ?? "",
  };

  return (
    <div style={{ padding: 24 }}>
      <FaviconForm initialValues={initialValues} action={saveWebsiteFavicon} />
    </div>
  );
}
