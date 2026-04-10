import Footer from "@/components/modules/site/footer/page";
import Header from "@/components/modules/site/header/page";
import { openSans } from "./fonts";
import styles from "./layout.module.scss";
import SiteActivityTracker from "@/components/modules/site/SiteActivityTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${styles.container} ${openSans.variable}`}>
      <Header />
      <main>
        <SiteActivityTracker />
        {children}
      </main>
      <Footer />
    </div>
  );
}
