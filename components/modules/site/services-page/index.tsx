import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./ServicesPageSection.module.scss";
import type { ServicePageItem } from "@/lib/site/get-services-page";

type Props = {
  items: ServicePageItem[];
};

export default function ServicesPageSection({ items }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.heading}>DỊCH VỤ CỦA CHÚNG TÔI</h1>
          <p className={styles.description}>
            Khám phá các dịch vụ nổi bật, được thiết kế linh hoạt để đáp ứng đa
            dạng nhu cầu di chuyển của khách hàng.
          </p>
        </div>

        {items.length ? (
          <div className={styles.grid}>
            {items.map((service) => (
              <article key={service.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      fill
                      className={styles.image}
                      sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 25vw"
                    />
                  ) : (
                    <div className={styles.imagePlaceholder} />
                  )}
                </div>

                <div className={styles.overlay} />

                <div className={styles.content}>
                  <h2 className={styles.title}>{service.title}</h2>

                  {service.description ? (
                    <p className={styles.summary}>{service.description}</p>
                  ) : null}

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
            ))}
          </div>
        ) : (
          <div className={styles.empty}>Hiện chưa có dịch vụ nào.</div>
        )}
      </div>
    </section>
  );
}