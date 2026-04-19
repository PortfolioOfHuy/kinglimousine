"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./NewsSection.module.scss";
import type { HomeNewsItem } from "@/lib/site/get-home-news";

type Props = {
  items: HomeNewsItem[];
  title?: string;
  description?: string;
};

function getPageSize(width: number) {
  return width <= 767 ? 2 : 3;
}

export default function NewsSection({
  items,
  title = "CẬP NHẬT TIN TỨC CÙNG CHÚNG TÔI",
  description = "Theo dõi những thông tin mới nhất về dịch vụ, xu hướng di chuyển và các cập nhật quan trọng dành cho khách hàng.",
}: Props) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setPageSize(getPageSize(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pages = useMemo(() => {
    const result: HomeNewsItem[][] = [];

    for (let i = 0; i < items.length; i += pageSize) {
      result.push(items.slice(i, i + pageSize));
    }

    return result;
  }, [items, pageSize]);

  useEffect(() => {
    if (page > pages.length - 1) {
      setPage(0);
    }
  }, [page, pages.length]);

  useEffect(() => {
    if (pages.length <= 1) return;

    const timer = setInterval(() => {
      setPage((prev) => (prev + 1) % pages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [pages.length]);

  const currentItems = pages[page] || [];
  const hasMultiplePages = pages.length > 1;

  const handlePrev = () => {
    if (!pages.length) return;
    setPage((prev) => (prev === 0 ? pages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!pages.length) return;
    setPage((prev) => (prev === pages.length - 1 ? 0 : prev + 1));
  };

  if (!items.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.headingBlock}>
            <h2 className={styles.heading}>{title}</h2>
            <p className={styles.description}>{description}</p>
          </div>

          {hasMultiplePages ? (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.navButton}
                onClick={handlePrev}
                aria-label="Tin trước"
              >
                <ChevronLeft size={22} strokeWidth={2} />
              </button>

              <button
                type="button"
                className={styles.navButton}
                onClick={handleNext}
                aria-label="Tin tiếp theo"
              >
                <ChevronRight size={22} strokeWidth={2} />
              </button>
            </div>
          ) : null}
        </div>

        <div
          className={`${styles.grid} ${
            pageSize === 3 ? styles.desktopGrid : styles.mobileGrid
          }`}
        >
          {currentItems.map((item) => (
            <Link
              key={item.id}
              href={`/tin-tuc/${item.slug}`}
              className={styles.card}
            >
              <div className={styles.dateRow}>
                <div className={styles.day}>{item.publishedDay}</div>

                <div className={styles.dateMeta}>
                  <span>{item.publishedMonth}</span>
                  <span>{item.publishedYear}</span>
                </div>
              </div>

              <h3 className={styles.cardTitle}>{item.title}</h3>

              <p className={styles.cardSummary}>{item.summary}</p>

              <div className={styles.imageWrap}>
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className={styles.image}
                  sizes="(max-width: 767px) 50vw, 33vw"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}