import SlideshowSection from "@/components/modules/site/slideshow";
import ServicesSection from "@/components/modules/site/services";
import FleetSection from "@/components/modules/site/fleet";
import HomeSections from "@/components/modules/site/home/HomeSections";

export default function HomePage() {
  return (
    <HomeSections
      slideshow={<SlideshowSection />}
      services={<ServicesSection />}
      fleet={<FleetSection />}
    />
  );
}
