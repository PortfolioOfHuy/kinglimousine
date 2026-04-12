"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styles from "./HomeSlideshow.module.scss";

type SlideItem = {
  id: number;
  title: string;
  description: string;
  link: string;
  image: string;
  imageAlt: string;
};

type Props = {
  slides: SlideItem[];
};

const AUTOPLAY_DELAY = 5000;

export default function HomeSlideshow({ slides }: Props) {
  const items = useMemo(() => slides.filter((item) => item.image), [slides]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (items.length <= 1) return;

    clearAutoplay();

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, AUTOPLAY_DELAY);
  }, [clearAutoplay, items.length]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      startAutoplay();
    },
    [startAutoplay],
  );

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    startAutoplay();
  }, [items.length, startAutoplay]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    startAutoplay();
  }, [items.length, startAutoplay]);

  useEffect(() => {
    if (!items.length) return;

    setCurrentIndex((prev) => (prev >= items.length ? 0 : prev));
  }, [items.length]);

  useEffect(() => {
    startAutoplay();
    return () => clearAutoplay();
  }, [startAutoplay, clearAutoplay]);

  if (!items.length) return null;

  const currentSlide = items[currentIndex];

  return (
    <section className={styles.hero}>
      {items.map((slide, index) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${
            index === currentIndex ? styles.active : ""
          }`}
          aria-hidden={index !== currentIndex}
        >
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            priority={index === 0}
            className={styles.image}
            sizes="100vw"
          />
        </div>
      ))}

      <div className={styles.overlay} />

      {items.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.navButton} ${styles.prevButton}`}
            aria-label="Slide trước"
            onClick={handlePrev}
          >
            <LeftOutlined />
          </button>

          <button
            type="button"
            className={`${styles.navButton} ${styles.nextButton}`}
            aria-label="Slide tiếp theo"
            onClick={handleNext}
          >
            <RightOutlined />
          </button>
        </>
      )}

      <div className={styles.content}>
        <div className={styles.textBox}>
          {!!currentSlide.title && (
            <h1 className={styles.title}>{currentSlide.title}</h1>
          )}

          {!!currentSlide.description && (
            <p className={styles.description}>{currentSlide.description}</p>
          )}

          {!!currentSlide.link && (
            <Link href={currentSlide.link} className={styles.cta}>
              Xem thêm
            </Link>
          )}
        </div>
      </div>

      {items.length > 1 && (
        <div className={styles.dots}>
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Chuyển tới slide ${index + 1}`}
              className={`${styles.dot} ${
                index === currentIndex ? styles.activeDot : ""
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
