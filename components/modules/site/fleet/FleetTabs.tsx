"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import type {
  FleetCategoryItem,
  FleetProductItem,
} from "@/lib/site/get-home-fleet";
import styles from "./FleetSection.module.scss";

type Props = {
  categories: FleetCategoryItem[];
  products: FleetProductItem[];
};

function getInitialVisibleCount(width: number) {
  if (width <= 767) return 4;
  return 9;
}

function decodeHtmlEntities(input: string) {
  const namedMap: Record<string, string> = {
    nbsp: " ",
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    agrave: "à",
    aacute: "á",
    acirc: "â",
    atilde: "ã",
    abreve: "ă",
    aring: "å",
    auml: "ä",
    egrave: "è",
    eacute: "é",
    ecirc: "ê",
    euml: "ë",
    igrave: "ì",
    iacute: "í",
    icirc: "î",
    iuml: "ï",
    ograve: "ò",
    oacute: "ó",
    ocirc: "ô",
    otilde: "õ",
    ouml: "ö",
    ohorn: "ơ",
    ugrave: "ù",
    uacute: "ú",
    ucirc: "û",
    uuml: "ü",
    uhorn: "ư",
    yacute: "ý",
    yuml: "ÿ",
    Agrave: "À",
    Aacute: "Á",
    Acirc: "Â",
    Atilde: "Ã",
    Abreve: "Ă",
    Aring: "Å",
    Auml: "Ä",
    Egrave: "È",
    Eacute: "É",
    Ecirc: "Ê",
    Euml: "Ë",
    Igrave: "Ì",
    Iacute: "Í",
    Icirc: "Î",
    Iuml: "Ï",
    Ograve: "Ò",
    Oacute: "Ó",
    Ocirc: "Ô",
    Otilde: "Õ",
    Ouml: "Ö",
    Ohorn: "Ơ",
    Ugrave: "Ù",
    Uacute: "Ú",
    Ucirc: "Û",
    Uuml: "Ü",
    Uhorn: "Ư",
    Yacute: "Ý",
  };

  return input
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&([a-zA-Z]+);/g, (match, name) => namedMap[name] ?? match);
}

function htmlToPlainText(html: string) {
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<p[^>]*>/gi, "")
      .replace(/<\/div>/gi, "\n")
      .replace(/<div[^>]*>/gi, "")
      .replace(/<\/li>/gi, "\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<ul[^>]*>/gi, "")
      .replace(/<\/ul>/gi, "\n")
      .replace(/<ol[^>]*>/gi, "")
      .replace(/<\/ol>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/\r/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .trim(),
  );
}

export default function FleetTabs({ categories, products }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [initialVisibleCount, setInitialVisibleCount] = useState(9);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    const updateVisibleCount = () => {
      const nextCount = getInitialVisibleCount(window.innerWidth);
      setInitialVisibleCount(nextCount);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const visibleCategories = useMemo(() => {
    const productCategorySlugs = new Set(
      products.map((product) => product.categorySlug),
    );

    return categories.filter((category) =>
      productCategorySlugs.has(category.slug),
    );
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter(
      (product) => product.categorySlug === activeCategory,
    );
  }, [activeCategory, products]);

  useEffect(() => {
    setVisibleCount(initialVisibleCount);
  }, [activeCategory, initialVisibleCount]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = filteredProducts.length > visibleCount;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headingWrap}>
          <span className={styles.headingLine} />
          <h2 className={styles.heading}>ĐỘI XE CỦA CHÚNG TÔI</h2>
          <span className={styles.headingLine} />
        </div>

        <p className={styles.subheading}>
          Hệ thống xe đa dạng – hiện đại – sang trọng, đáp ứng mọi nhu cầu di
          chuyển từ phổ thông đến hạng thương gia.
        </p>

        <div className={styles.tabs}>
          <button
            type="button"
            className={clsx(
              styles.tabButton,
              activeCategory === "all" && styles.tabButtonActive,
            )}
            onClick={() => setActiveCategory("all")}
          >
            TẤT CẢ
          </button>

          {visibleCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={clsx(
                styles.tabButton,
                activeCategory === category.slug && styles.tabButtonActive,
              )}
              onClick={() => setActiveCategory(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {!filteredProducts.length ? (
          <p className={styles.empty}>Hiện chưa có xe phù hợp.</p>
        ) : (
          <>
            <div className={styles.grid}>
              {displayedProducts.map((product, index) => (
                <article key={product.id} className={styles.card}>
                  <Link
                    href={`/san-pham/${product.slug}`}
                    className={styles.imageLink}
                  >
                    <div className={styles.imageWrap}>
                      <Image
                        src={product.image}
                        alt={product.imageAlt}
                        fill
                        className={styles.image}
                        sizes="(max-width: 767px) 50vw, (max-width: 1199px) 50vw, 33vw"
                        priority={index < 2}
                        loading={index < 2 ? "eager" : "lazy"}
                      />
                    </div>
                  </Link>

                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>
                      <Link href={`/san-pham/${product.slug}`}>
                        {product.title}
                      </Link>
                    </h3>

                    {product.tags && product.tags.length > 0 && (
                      <div className={styles.badges}>
                        {product.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className={styles.badge}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className={styles.cardSummary}>
                      {htmlToPlainText(product.summary || "")}
                    </p>

                    {product.priceText ? (
                      <div className={styles.price}>{product.priceText}</div>
                    ) : (
                      <Link href="/lien-he" className={styles.contactButton}>
                        Liên hệ
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {hasMoreProducts && (
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.moreButton}
                  onClick={() => setVisibleCount(filteredProducts.length)}
                >
                  Xem thêm
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}