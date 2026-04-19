import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/site/get-products";
import styles from "./ProductsPage.module.scss";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Danh sách tất cả sản phẩm tại KINGLIMOUSINE.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Tất cả sản phẩm</h1>
          <p className={styles.description}>
            Khám phá toàn bộ sản phẩm và dịch vụ đang được cung cấp.
          </p>
        </div>

        {products.length === 0 ? (
          <div className={styles.empty}>Hiện chưa có sản phẩm nào.</div>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <article key={product.id} className={styles.card}>
                <Link href={`/san-pham/${product.slug}`} className={styles.imageLink}>
                  <div className={styles.imageWrap}>
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      className={styles.image}
                      sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                    />
                  </div>
                </Link>

                <div className={styles.cardBody}>
                  {product.categoryName ? (
                    <div className={styles.category}>{product.categoryName}</div>
                  ) : null}

                  <h2 className={styles.cardTitle}>
                    <Link href={`/san-pham/${product.slug}`}>{product.title}</Link>
                  </h2>

                  {product.tags.length > 0 ? (
                    <div className={styles.tags}>
                      {product.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <p className={styles.summary}>{product.summary}</p>

                  <div className={styles.bottomRow}>
                    <div className={styles.priceWrap}>
                      {product.oldPrice ? (
                        <span className={styles.oldPrice}>{product.oldPrice}đ</span>
                      ) : null}
                      {product.price ? (
                        <span className={styles.price}>{product.price}đ</span>
                      ) : (
                        <span className={styles.contactText}>Liên hệ</span>
                      )}
                    </div>

                    <Link href={`/san-pham/${product.slug}`} className={styles.button}>
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}