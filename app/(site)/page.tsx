import SlideshowSection from "@/components/modules/site/slideshow";
import ServicesSection from "@/components/modules/site/services";
import FleetSection from "@/components/modules/site/fleet";
import NewsSection from "@/components/modules/site/news";
import HomeCtaSection from "@/components/modules/site/cta";
import HomeHowToBookSection from "@/components/modules/site/howtobook/HomeHowToBookSection";
import WhyChooseUsSection from "@/components/modules/site/why-choose-us/WhyChooseUsSection";
import HomeSections from "@/components/modules/site/home/HomeSections";
import { getHomeHowToBook } from "@/lib/site/get-home-how-to-book";
import { getHomeWhyChooseUs } from "@/lib/site/get-home-why-choose-us";
import { getHomeNews } from "@/lib/site/get-home-news";
import { getHomeCta } from "@/lib/site/get-home-cta";

export const metadata = {
  title: "Trang chủ",
};

export default async function HomePage() {
  const [howToBookItems, whyChooseUsData, newsItems, ctaData] =
    await Promise.all([
      getHomeHowToBook(),
      getHomeWhyChooseUs(),
      getHomeNews(),
      getHomeCta(),
    ]);

  return (
    <HomeSections
      slideshow={<SlideshowSection />}
      services={<ServicesSection />}
      fleet={<FleetSection />}
      howToBook={<HomeHowToBookSection items={howToBookItems} />}
      whyChooseUs={<WhyChooseUsSection data={whyChooseUsData} />}
      cta={<HomeCtaSection data={ctaData} />}
      news={<NewsSection items={newsItems} />}
    />
  );
}
