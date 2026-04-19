import AboutUsForm from "@/components/modules/admin/about-us/AboutUsForm";
import {
  getAboutUs,
  saveAboutUs,
} from "./actions"

export const dynamic = "force-dynamic";

export default async function AdminAboutUsPage() {
  const data = await getAboutUs();

  return (
    <AboutUsForm
      title="Trang giới thiệu"
      submitLabel="Lưu nội dung"
      action={saveAboutUs}
      defaultValues={{
        title: data?.title ?? "",
        summary: data?.summary ?? "",
        content: data?.content ?? "",
        bannerImagePath: data?.bannerImage?.filePath ?? "",
      }}
    />
  );
}