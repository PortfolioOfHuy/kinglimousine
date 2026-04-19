import Footer from "@/components/modules/site/footer/page";
import { openSans } from "./fonts";
import styles from "./layout.module.scss";
import SiteActivityTracker from "@/components/modules/site/SiteActivityTracker";
import Header from "@/components/modules/site/header";
import { getFooterData } from "@/lib/site/get-footer-data";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footerData = await getFooterData();
  return (
    <div className={`${styles.container} ${openSans.variable}`}>
      <Header />
      <main>
        <SiteActivityTracker />
        {children}
      </main>
      <Footer {...footerData} />
    </div>
  );
}
