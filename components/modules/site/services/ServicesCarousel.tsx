"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { HomeServiceItem } from "@/lib/site/get-home-services";
import styles from "./ServicesSection.module.scss";

type Props = {
  services: HomeServiceItem[];
};

function getItemsPerView(width: number) {
  return width <= 767 ? 2 : 4;
}

export default function ServicesCarousel({ services }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const updateItemsPerView = () => {
      const next = getItemsPerView(window.innerWidth);
      setItemsPerView((prev) => (prev === next ? prev : next));
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(services.length - itemsPerView, 0);
  const canSlide = services.length > itemsPerView;

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handlePrev = () => {
    if (!canSlide) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    if (!canSlide) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const trackStyle = useMemo(
    () => ({
      transform: `translate3d(-${currentIndex * (100 / itemsPerView)}%, 0, 0)`,
    }),
    [currentIndex, itemsPerView],
  );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>DỊCH VỤ CỦA CHÚNG TÔI</h2>
        </div>

        <div className={styles.carousel}>
          {canSlide && (
            <>
              <button
                type="button"
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={handlePrev}
                aria-label="Dịch vụ trước"
              >
                <ChevronLeft size={28} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={handleNext}
                aria-label="Dịch vụ tiếp theo"
              >
                <ChevronRight size={28} strokeWidth={2.2} />
              </button>
            </>
          )}

          <div className={styles.viewport}>
            <div className={styles.track} style={trackStyle}>
              {services.map((service, index) => {
                const isPriorityImage = index < itemsPerView;

                return (
                  <div
                    key={service.id}
                    className={styles.slide}
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <article className={styles.card}>
                      <div className={styles.imageWrap}>
                        <Image
                          src={service.image}
                          alt={service.imageAlt}
                          fill
                          className={styles.image}
                          sizes="(max-width: 767px) 50vw, 25vw"
                          priority={isPriorityImage}
                          loading={isPriorityImage ? "eager" : "lazy"}
                        />
                      </div>

                      <div className={styles.overlay} />

                      <div className={styles.content}>
                        <h3 className={styles.title}>{service.title}</h3>
                        <p className={styles.description}>
                          {service.description}
                        </p>

                        <Link href={service.link} className={styles.moreButton}>
                          <span className={styles.moreIcon}>
                            <ArrowUpRight
                              className={styles.moreIconSvg}
                              size={18}
                              strokeWidth={2.2}
                            />
                          </span>
                          <span className={styles.moreText}>Xem Thêm</span>
                        </Link>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}