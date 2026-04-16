"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import Reveal from "@/components/common/Reveal";

type Props = {
  slideshow: ReactNode;
  services: ReactNode;
  fleet: ReactNode;
  howToBook: ReactNode;
  whyChooseUs: ReactNode;
  news: ReactNode;
};

export default function HomeSections({
  slideshow,
  services,
  fleet,
  howToBook,
  whyChooseUs,
  news,
}: Props) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {slideshow}
      </motion.div>

      <Reveal delay={0.08}>{services}</Reveal>
      <Reveal delay={0.12}>{fleet}</Reveal>
      <Reveal delay={0.16}>{howToBook}</Reveal>
      <Reveal delay={0.2}>{whyChooseUs}</Reveal>
      <Reveal delay={0.24}>{news}</Reveal>
    </>
  );
}
