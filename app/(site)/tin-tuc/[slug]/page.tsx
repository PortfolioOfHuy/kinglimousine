import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.scss";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const item = await prisma.news.findFirst({
    where: {
      slug,
      isActive: true,
      status: "PUBLISHED",
    },
    select: {
      title: true,
    },
  });

  return {
    title: item?.title || "Tin tức",
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  const item = await prisma.news.findFirst({
    where: {
      slug,
      isActive: true,
      status: "PUBLISHED",
    },
    select: {
      title: true,
      content: true,
    },
  });

  if (!item) {
    notFound();
  }

  return (
    <article className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.heading}>{item.title}</h1>

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{
            __html: item.content || "<p>Đang cập nhật nội dung...</p>",
          }}
        />
      </div>
    </article>
  );
}
