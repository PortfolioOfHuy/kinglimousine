import { getHomeServices } from "@/lib/site/get-home-services";
import ServicesCarousel from "./ServicesCarousel";

export default async function ServicesSection() {
  const services = await getHomeServices();

  if (!services.length) {
    return null;
  }

  return <ServicesCarousel services={services} />;
}
