import SlideshowSection from "@/components/modules/site/slideshow";
import ServicesSection from "@/components/modules/site/services";
import FleetSection from "@/components/modules/site/fleet";
import HomeHowToBookSection from "@/components/modules/site/howtobook/HomeHowToBookSection";
import HomeSections from "@/components/modules/site/home/HomeSections";
import { getHomeHowToBook } from "@/lib/site/get-home-how-to-book";

export default async function HomePage() {
  const howToBookItems = await getHomeHowToBook();

  return (
    <HomeSections
      slideshow={<SlideshowSection />}
      services={<ServicesSection />}
      fleet={<FleetSection />}
      howToBook={<HomeHowToBookSection items={howToBookItems} />}
    />
  );
}
