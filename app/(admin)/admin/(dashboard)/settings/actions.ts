"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  IntegrationType,
  Prisma,
  SeoPageType,
} from "@/generated/prisma/client";

export type SettingsActionState = {
  success: boolean;
  message: string;
};

const EXTRA_SETTING_NAMES = {
  zaloOaId: "zalo_oa_id",
  websiteUrl: "website_url",
  googleMapCoordinates: "google_map_coordinates",
  googleAnalytics: "google_analytics",
  googleWebmasterTool: "google_webmaster_tool",
  homePrimaryKeyword: "home_primary_keyword",
} as const;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return value.trim();
}

function toNullable(value: string) {
  const v = value.trim();
  return v.length > 0 ? v : null;
}

async function saveExtraSetting(
  tx: Prisma.TransactionClient,
  params: {
    type: IntegrationType;
    name: string;
    value: string;
    jsonKey?: string;
  },
) {
  const existing = await tx.integrationSetting.findFirst({
    where: {
      type: params.type,
      name: params.name,
    },
  });

  const finalValueJson =
    params.jsonKey && params.value
      ? { [params.jsonKey]: params.value }
      : { value: params.value };

  if (existing) {
    return tx.integrationSetting.update({
      where: { id: existing.id },
      data: {
        valueJson: finalValueJson,
        isActive: params.value.length > 0,
      },
    });
  }

  return tx.integrationSetting.create({
    data: {
      type: params.type,
      name: params.name,
      valueJson: finalValueJson,
      isActive: params.value.length > 0,
    },
  });
}

export async function saveWebsiteSettings(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  try {
    const siteName = getString(formData, "siteName");
    const address = getString(formData, "address");
    const email = getString(formData, "email");
    const hotline = getString(formData, "hotline");
    const phone = getString(formData, "phone");
    const zaloPhone = getString(formData, "zaloPhone");
    const zaloOaId = getString(formData, "zaloOaId");
    const websiteUrl = getString(formData, "websiteUrl");
    const facebookUrl = getString(formData, "facebookUrl");
    const googleMapCoordinates = getString(formData, "googleMapCoordinates");
    const googleMapIframe = getString(formData, "googleMapIframe");
    const googleAnalytics = getString(formData, "googleAnalytics");
    const googleWebmasterTool = getString(formData, "googleWebmasterTool");
    const headerScripts = getString(formData, "headerScripts");
    const bodyScripts = getString(formData, "bodyScripts");

    const metaTitle = getString(formData, "metaTitle");
    const metaKeywords = getString(formData, "metaKeywords");
    const metaDescription = getString(formData, "metaDescription");
    const primaryKeyword = getString(formData, "primaryKeyword");

    if (!siteName) {
      return {
        success: false,
        message: "Vui lòng nhập tiêu đề website.",
      };
    }

    await prisma.$transaction(async (tx) => {
      const currentSetting = await tx.websiteSetting.findFirst({
        orderBy: { id: "asc" },
      });

      const websiteSettingData = {
        siteName,
        address: toNullable(address),
        email: toNullable(email),
        hotline: toNullable(hotline),
        hotlineDisplay: toNullable(phone),
        zaloPhone: toNullable(zaloPhone),
        facebookUrl: toNullable(facebookUrl),
        googleMapIframe: toNullable(googleMapIframe),
        headerScripts: toNullable(headerScripts),
        bodyScripts: toNullable(bodyScripts),
        defaultLanguage: "vi",
      };

      if (currentSetting) {
        await tx.websiteSetting.update({
          where: { id: currentSetting.id },
          data: websiteSettingData,
        });
      } else {
        await tx.websiteSetting.create({
          data: websiteSettingData,
        });
      }

      const currentSeo = await tx.seoPage.findFirst({
        where: {
          pageType: SeoPageType.HOME,
          routePath: "/",
        },
      });

      const seoData = {
        pageType: SeoPageType.HOME,
        routePath: "/",
        metaTitle: toNullable(metaTitle),
        metaKeywords: toNullable(metaKeywords),
        metaDescription: toNullable(metaDescription),
        ogTitle: toNullable(metaTitle),
        ogDescription: toNullable(metaDescription),
        twitterTitle: toNullable(metaTitle),
        twitterDescription: toNullable(metaDescription),
      };

      if (currentSeo) {
        await tx.seoPage.update({
          where: { id: currentSeo.id },
          data: seoData,
        });
      } else {
        await tx.seoPage.create({
          data: seoData,
        });
      }

      await saveExtraSetting(tx, {
        type: IntegrationType.ZALO_OA,
        name: EXTRA_SETTING_NAMES.zaloOaId,
        value: zaloOaId,
        jsonKey: "oaid",
      });

      await saveExtraSetting(tx, {
        type: IntegrationType.OTHER,
        name: EXTRA_SETTING_NAMES.websiteUrl,
        value: websiteUrl,
      });

      await saveExtraSetting(tx, {
        type: IntegrationType.OTHER,
        name: EXTRA_SETTING_NAMES.googleMapCoordinates,
        value: googleMapCoordinates,
      });

      await saveExtraSetting(tx, {
        type: IntegrationType.OTHER,
        name: EXTRA_SETTING_NAMES.googleAnalytics,
        value: googleAnalytics,
      });

      await saveExtraSetting(tx, {
        type: IntegrationType.OTHER,
        name: EXTRA_SETTING_NAMES.googleWebmasterTool,
        value: googleWebmasterTool,
      });

      await saveExtraSetting(tx, {
        type: IntegrationType.OTHER,
        name: EXTRA_SETTING_NAMES.homePrimaryKeyword,
        value: primaryKeyword,
      });
    });

    revalidatePath("/admin/settings");
    revalidatePath("/");

    return {
      success: true,
      message: "Đã lưu cài đặt thành công.",
    };
  } catch (error) {
    console.error("saveWebsiteSettings error:", error);

    return {
      success: false,
      message: "Lưu cài đặt thất bại, vui lòng thử lại.",
    };
  }
}
