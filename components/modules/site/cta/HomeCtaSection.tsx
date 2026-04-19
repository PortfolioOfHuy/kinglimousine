import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./HomeCtaSection.module.scss";
import type { HomeCtaData } from "@/lib/site/get-home-cta";

type Props = {
  data: HomeCtaData | null;
};

export default function HomeCtaSection({ data }: Props) {
  if (!data || !data.isActive) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.imageWrap}>
            <Image
              src={data.backgroundImage}
              alt={data.backgroundImageAlt}
              fill
              className={styles.image}
              sizes="100vw"
              priority={false}
            />
            <div className={styles.overlay} />
          </div>

          <div className={styles.content}>
            <h2 className={styles.title}>{data.title}</h2>
            <p className={styles.description}>{data.description}</p>

            <Link href="/lien-he" className={styles.button}>
              <span className={styles.buttonIcon}>
                <ArrowUpRight
                  className={styles.buttonIconSvg}
                  size={18}
                  strokeWidth={2.2}
                />
              </span>
              <span className={styles.buttonText}>Đặt Xe Ngay</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}