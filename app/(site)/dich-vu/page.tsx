import ServicesPageSection from "@/components/modules/site/services-page";
import { getServicesPage } from "@/lib/site/get-services-page";

export const metadata = {
  title: "Dịch vụ",
};

export default async function ServicesPage() {
  const items = await getServicesPage();

  return (
    <main>
      <ServicesPageSection items={items} />
    </main>
  );
}