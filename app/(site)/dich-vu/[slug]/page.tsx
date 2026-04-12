import { notFound } from "next/navigation";
import { getServiceDetail } from "@/lib/site/get-service-detail";
import styles from "./page.module.scss";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceDetail(slug);

  if (!service) {
    notFound();
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>{service.title}</h1>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: service.content }}
        />
      </div>
    </section>
  );
}
