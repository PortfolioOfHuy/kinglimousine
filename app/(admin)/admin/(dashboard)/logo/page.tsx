import { prisma } from "@/lib/prisma";
import LogoForm from "@/components/modules/admin/logo/LogoForm";
import { saveWebsiteLogo } from "./actions";

export default async function AdminLogoPage() {
  const websiteSetting = await prisma.websiteSetting.findFirst({
    orderBy: { id: "asc" },
    include: {
      logo: true,
      footerLogo: true,
    },
  });

  const initialValues = {
    siteName: websiteSetting?.siteName ?? "",

    headerLogoId: websiteSetting?.logoId ?? null,
    headerLogoPath: websiteSetting?.logo?.filePath ?? "",
    headerLogoAltText: websiteSetting?.logo?.altText ?? "",

    footerLogoId: websiteSetting?.footerLogoId ?? null,
    footerLogoPath: websiteSetting?.footerLogo?.filePath ?? "",
    footerLogoAltText: websiteSetting?.footerLogo?.altText ?? "",
  };

  return (
    <div style={{ padding: 24 }}>
      <LogoForm initialValues={initialValues} action={saveWebsiteLogo} />
    </div>
  );
}
