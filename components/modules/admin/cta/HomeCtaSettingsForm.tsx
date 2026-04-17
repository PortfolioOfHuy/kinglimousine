import styles from "./HomeCtaSettingsForm.module.scss";
import ProductImageField from "../products/ProductImageField";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    ctaTitle?: string | null;
    ctaDescription?: string | null;
    ctaIsActive?: boolean;
    ctaBackgroundImagePath?: string | null;
  };
};

export default function HomeCtaSettingsForm({ action, defaultValues }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>CTA Trang chủ</h2>
          <p className={styles.description}>
            Quản lý nội dung CTA hiển thị ở homepage.
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <form action={action} className={styles.form}>
          <div className={styles.contentLayout}>
            <div className={styles.mainColumn}>
              <div className={styles.field}>
                <label htmlFor="ctaTitle" className={styles.label}>
                  Tiêu đề CTA
                </label>
                <input
                  id="ctaTitle"
                  name="ctaTitle"
                  type="text"
                  defaultValue={defaultValues?.ctaTitle ?? ""}
                  placeholder="Nhập tiêu đề CTA..."
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="ctaDescription" className={styles.label}>
                  Mô tả CTA
                </label>
                <textarea
                  id="ctaDescription"
                  name="ctaDescription"
                  rows={5}
                  defaultValue={defaultValues?.ctaDescription ?? ""}
                  placeholder="Nhập mô tả CTA..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Trạng thái hiển thị</label>

                <label className={styles.checkRow}>
                  <input
                    type="checkbox"
                    name="ctaIsActive"
                    value="1"
                    defaultChecked={defaultValues?.ctaIsActive ?? true}
                    className={styles.checkbox}
                  />
                  <span>Bật CTA ở trang chủ</span>
                </label>
              </div>

              <div className={styles.actions}>
                <button type="submit" className={styles.submitButton}>
                  Lưu CTA
                </button>
              </div>
            </div>

            <aside className={styles.sideColumn}>
              <ProductImageField
                name="ctaBackgroundImage"
                label="Ảnh nền CTA"
                defaultImage={defaultValues?.ctaBackgroundImagePath ?? ""}
                alt="cta background"
              />
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
