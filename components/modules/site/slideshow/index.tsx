import { getHomeSlides } from "@/lib/site/get-home-slides";
import HomeSlideshow from "./HomeSlideshow";

export default async function SlideshowSection() {
  const slides = await getHomeSlides();

  if (!slides.length) return null;

  return <HomeSlideshow slides={slides} />;
}
