import ContactForm from "./ContactForm";
import styles from "./ContactPageSection.module.scss";
import type { ContactPageData } from "@/lib/site/get-contact-page";

type Props = {
  data: ContactPageData | null;
};

export default function ContactPageSection({ data }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.heading}>LIÊN HỆ VỚI CHÚNG TÔI</h1>
          <p className={styles.description}>
            Hãy để lại thông tin để chúng tôi tư vấn nhanh chóng và hỗ trợ bạn
            lựa chọn dịch vụ phù hợp nhất.
          </p>
        </div>

        <div className={styles.formWrap}>
          <div className={styles.formPanel}>
            <h2 className={styles.formTitle}>Gửi yêu cầu tư vấn</h2>
            <ContactForm />
          </div>
        </div>

        {data?.googleMapIframe ? (
          <div
            className={styles.mapWrap}
            dangerouslySetInnerHTML={{ __html: data.googleMapIframe }}
          />
        ) : null}
      </div>
    </section>
  );
}