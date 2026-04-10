import { prisma } from "@/lib/prisma";
import { SeoPageType } from "@/generated/prisma/client";
import SettingsForm from "@/components/modules/admin/settings/SettingsForm";
import { saveWebsiteSettings } from "./actions";

const EXTRA_SETTING_NAMES = {
  zaloOaId: "zalo_oa_id",
  websiteUrl: "website_url",
  googleMapCoordinates: "google_map_coordinates",
  googleAnalytics: "google_analytics",
  googleWebmasterTool: "google_webmaster_tool",
  homePrimaryKeyword: "home_primary_keyword",
} as const;

function readExtraValue(valueJson: unknown): string {
  if (typeof valueJson === "string") return valueJson;

  if (valueJson && typeof valueJson === "object") {
    const record = valueJson as Record<string, unknown>;

    if (typeof record.value === "string") return record.value;
    if (typeof record.oaid === "string") return record.oaid;
    if (typeof record.code === "string") return record.code;

    return JSON.stringify(valueJson);
  }

  return "";
}

export default async function AdminSettingsPage() {
  const [websiteSetting, seoPage, extras] = await Promise.all([
    prisma.websiteSetting.findFirst({
      orderBy: { id: "asc" },
    }),
    prisma.seoPage.findFirst({
      where: {
        pageType: SeoPageType.HOME,
        routePath: "/",
      },
    }),
    prisma.integrationSetting.findMany({
      where: {
        name: {
          in: Object.values(EXTRA_SETTING_NAMES),
        },
      },
    }),
  ]);

  const extraMap = Object.fromEntries(
    extras.map((item) => [item.name, readExtraValue(item.valueJson)]),
  );

  const initialValues = {
    siteName: websiteSetting?.siteName ?? "",
    address: websiteSetting?.address ?? "",
    email: websiteSetting?.email ?? "",
    hotline: websiteSetting?.hotline ?? "",
    phone: websiteSetting?.hotlineDisplay ?? "",
    zaloPhone: websiteSetting?.zaloPhone ?? "",
    zaloOaId: extraMap[EXTRA_SETTING_NAMES.zaloOaId] ?? "",
    websiteUrl: extraMap[EXTRA_SETTING_NAMES.websiteUrl] ?? "",
    facebookUrl: websiteSetting?.facebookUrl ?? "",
    googleMapCoordinates:
      extraMap[EXTRA_SETTING_NAMES.googleMapCoordinates] ?? "",
    googleMapIframe: websiteSetting?.googleMapIframe ?? "",
    googleAnalytics: extraMap[EXTRA_SETTING_NAMES.googleAnalytics] ?? "",
    googleWebmasterTool:
      extraMap[EXTRA_SETTING_NAMES.googleWebmasterTool] ?? "",
    headerScripts: websiteSetting?.headerScripts ?? "",
    bodyScripts: websiteSetting?.bodyScripts ?? "",
    metaTitle: seoPage?.metaTitle ?? "",
    metaKeywords: seoPage?.metaKeywords ?? "",
    metaDescription: seoPage?.metaDescription ?? "",
    primaryKeyword: extraMap[EXTRA_SETTING_NAMES.homePrimaryKeyword] ?? "",
  };

  return (
    <div style={{ padding: 24 }}>
      <SettingsForm
        initialValues={initialValues}
        action={saveWebsiteSettings}
      />
    </div>
  );
}
