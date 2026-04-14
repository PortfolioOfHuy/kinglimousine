import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./HomeHowToBookSection.module.scss";
import type { HomeHowToBookItem } from "@/lib/site/get-home-how-to-book";

type Props = {
  items: HomeHowToBookItem[];
};

export default function HomeHowToBookSection({ items }: Props) {
  if (!items.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>LÀM THẾ NÀO ĐỂ ĐẶT XE</h2>

        <div className={styles.grid}>
          {items.map((item, index) => {
            const isReverse = index % 2 === 1;
            const isLastItem = index === items.length - 1;

            return (
              <article
                key={item.id}
                className={`${styles.row} ${isReverse ? styles.rowReverse : ""}`}
              >
                <div className={styles.content}>
                  <h3 className={styles.title}>{item.title}</h3>

                  <p className={styles.summary}>{item.summary}</p>

                  {isLastItem && (
                    <Link href="/lien-he" className={styles.moreButton}>
                      <span className={styles.moreIcon}>
                        <ArrowUpRight
                          className={styles.moreIconSvg}
                          size={18}
                          strokeWidth={2.2}
                        />
                      </span>
                      <span className={styles.moreText}>Đặt Xe Ngay</span>
                    </Link>
                  )}

                  <span className={styles.stepNumber}>{item.stepNumber}</span>
                </div>

                <div className={styles.imageWrap}>
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className={styles.image}
                    sizes="(max-width: 991px) 100vw, 50vw"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
