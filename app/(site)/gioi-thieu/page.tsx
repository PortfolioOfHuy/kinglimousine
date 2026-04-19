import Image from "next/image";
import { notFound } from "next/navigation";
import { getAboutUs } from "@/lib/site/get-about-us";
import styles from "./AboutPage.module.scss";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const data = await getAboutUs();

  if (!data) {
    notFound();
  }

  return (
    <main className={styles.page}>
      {data.bannerImage ? (
        <section className={styles.hero}>
          <Image
            src={data.bannerImage}
            alt={data.bannerImageAlt}
            fill
            className={styles.heroImage}
            sizes="100vw"
            priority
          />
          <div className={styles.heroOverlay} />
        </section>
      ) : null}

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.contentWrap}>
            <h1 className={styles.title}>{data.title}</h1>

            {data.summary ? (
              <p className={styles.summary}>{data.summary}</p>
            ) : null}

            {data.content ? (
              <div
                className={data.summary ? styles.content : styles.contentNoSummary}
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}