import SlideshowSection from "@/components/modules/site/slideshow";
import ServicesSection from "@/components/modules/site/services";
import FleetSection from "@/components/modules/site/fleet";
import HomeHowToBookSection from "@/components/modules/site/howtobook/HomeHowToBookSection";
import WhyChooseUsSection from "@/components/modules/site/why-choose-us/WhyChooseUsSection";
import HomeSections from "@/components/modules/site/home/HomeSections";
import { getHomeHowToBook } from "@/lib/site/get-home-how-to-book";
import { getHomeWhyChooseUs } from "@/lib/site/get-home-why-choose-us";

export default async function HomePage() {
  const [howToBookItems, whyChooseUsData] = await Promise.all([
    getHomeHowToBook(),
    getHomeWhyChooseUs(),
  ]);

  return (
    <HomeSections
      slideshow={<SlideshowSection />}
      services={<ServicesSection />}
      fleet={<FleetSection />}
      howToBook={<HomeHowToBookSection items={howToBookItems} />}
      whyChooseUs={<WhyChooseUsSection data={whyChooseUsData} />}
    />
  );
}
