import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductDetailBySlug } from "@/lib/site/get-product-detail";
import styles from "./ProductDetailPage.module.scss";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetailBySlug(slug);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
    };
  }

  return {
    title: product.title,
    description: product.summary.replace(/<[^>]*>/g, "").slice(0, 160),
    alternates: {
      canonical: `/san-pham/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductDetailBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/">Trang chủ</Link>
          <span>/</span>
          <Link href="/san-pham">Sản phẩm</Link>
          <span>/</span>
          <span>{product.title}</span>
        </div>

        <div className={styles.hero}>
          <div className={styles.heroImageWrap}>
            <Image
              src={product.bannerImage}
              alt={product.bannerAlt}
              fill
              className={styles.heroImage}
              sizes="(max-width: 767px) 100vw, 60vw"
              priority
            />
          </div>

          <div className={styles.heroContent}>
            {product.categoryName ? (
              <div className={styles.category}>{product.categoryName}</div>
            ) : null}

            <h1 className={styles.title}>{product.title}</h1>

            {product.tags.length > 0 ? (
              <div className={styles.tags}>
                {product.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {product.summary ? (
              <div
                className={styles.summary}
                dangerouslySetInnerHTML={{ __html: product.summary }}
              />
            ) : null}

            <div className={styles.priceBox}>
              {product.oldPrice ? (
                <div className={styles.oldPrice}>{product.oldPrice}đ</div>
              ) : null}

              {product.price ? (
                <div className={styles.price}>{product.price}đ</div>
              ) : (
                <div className={styles.contactPrice}>Liên hệ để báo giá</div>
              )}
            </div>

            <Link href="/lien-he" className={styles.cta}>
              Liên hệ tư vấn
            </Link>
          </div>
        </div>

        <div className={styles.contentCard}>
          <h2 className={styles.contentTitle}>Chi tiết sản phẩm</h2>

          {product.content ? (
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: product.content }}
            />
          ) : (
            <p className={styles.empty}>Nội dung đang được cập nhật.</p>
          )}
        </div>
      </div>
    </section>
  );
}