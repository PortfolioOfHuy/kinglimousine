import { getHomeFleet } from "@/lib/site/get-home-fleet";
import FleetTabs from "./FleetTabs";

export default async function FleetSection() {
  const data = await getHomeFleet();

  if (!data.products.length) {
    return null;
  }

  return <FleetTabs categories={data.categories} products={data.products} />;
}
