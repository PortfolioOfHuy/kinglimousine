import ContactPageSection from "@/components/modules/site/contact-page";
import { getContactPage } from "@/lib/site/get-contact-page";

export const metadata = {
  title: "Liên hệ",
};

export default async function ContactPage() {
  const data = await getContactPage();

  return (
    <main>
      <ContactPageSection data={data} />
    </main>
  );
}