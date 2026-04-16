import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./WhyChooseUsSection.module.scss";
import type { HomeWhyChooseUsData } from "@/lib/site/get-home-why-choose-us";

type Props = {
  data: HomeWhyChooseUsData;
};

export default function WhyChooseUsSection({ data }: Props) {
  if (!data.intro || !data.items.length) return null;

  const [firstItem, ...restItems] = data.items;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>{data.intro.title}</h2>
          {data.intro.summary ? (
            <p className={styles.description}>{data.intro.summary}</p>
          ) : null}
        </div>

        <div className={styles.panel}>
          <div className={styles.imageWrap}>
            <Image
              src={data.intro.image}
              alt={data.intro.imageAlt}
              fill
              quality={100}
              className={styles.image}
              sizes="(max-width: 991px) 100vw, 1280px"
            />
            <div className={styles.imageOverlay} />
          </div>

          <div className={styles.grid}>
            <article className={`${styles.card} ${styles.featureCard}`}>
              <div className={styles.cardOverlay} />

              <div className={styles.cardInner}>
                <div className={styles.cardContent}>
                  <h3 className={styles.featureTitle}>{firstItem.title}</h3>

                  {firstItem.summary ? (
                    <p className={styles.featureSummary}>{firstItem.summary}</p>
                  ) : null}

                  <Link href="/lien-he" className={styles.moreButton}>
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

                <div className={styles.bottomTitle}>{firstItem.title}</div>
              </div>
            </article>

            {restItems.map((item) => (
              <article key={item.id} className={styles.card}>
                <div className={styles.cardOverlay} />

                <div className={styles.cardInner}>
                  <div className={styles.cardContent}>
                    <h3 className={styles.featureTitle}>{item.title}</h3>

                    {item.summary ? (
                      <p className={styles.featureSummary}>{item.summary}</p>
                    ) : null}

                    <Link href="/lien-he" className={styles.moreButton}>
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

                  <div className={styles.bottomTitle}>{item.title}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
