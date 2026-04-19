import NewsSection from "@/components/modules/site/news";
import { getHomeNews } from "@/lib/site/get-home-news";
import styles from "./page.module.scss";

export const metadata = {
  title: "Tin tức",
};

export default async function NewsListPage() {
  const newsItems = await getHomeNews(100);

  return (
    <main className={styles.page}>
      <NewsSection
        items={newsItems}
        title="TẤT CẢ TIN TỨC"
        description="Cập nhật các thông tin mới nhất về dịch vụ, xu hướng di chuyển và những thông báo quan trọng dành cho khách hàng."
      />
    </main>
  );
}