import { prisma } from "@/lib/prisma";
import SiteHeader from "./SiteHeader";

export default async function Header() {
  const setting = await prisma.websiteSetting.findFirst({
    include: {
      logo: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  const rawLogo = setting?.logo?.filePath ?? null;

  const logo =
    rawLogo && !rawLogo.startsWith("http") && !rawLogo.startsWith("/")
      ? `/${rawLogo}`
      : rawLogo;

  return (
    <SiteHeader
      logo={logo}
      logoAlt={setting?.logo?.altText ?? setting?.siteName ?? "Logo"}
      siteName={setting?.siteName ?? "KING LIMOUSINE"}
    />
  );
}
