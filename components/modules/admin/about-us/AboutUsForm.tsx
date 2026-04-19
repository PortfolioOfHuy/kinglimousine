import Link from "next/link";
import styles from "./AboutUsForm.module.scss";
import Ckeditor4Field from "@/components/modules/admin/ckeditor/Ckeditor4Field";
import ProductImageField from "@/components/modules/admin/products/ProductImageField";

type AboutUsFormProps = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    title?: string;
    summary?: string;
    content?: string;
    bannerImagePath?: string | null;
  };
};

export default function AboutUsForm({
  title,
  submitLabel,
  action,
  defaultValues,
}: AboutUsFormProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>
            Cập nhật nội dung cho trang giới thiệu.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="submit"
            form="about-us-form"
            className={styles.submitButton}
          >
            {submitLabel}
          </button>

          <Link href="/admin" className={styles.backButton}>
            Quay lại
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <form id="about-us-form" action={action} className={styles.form}>
          <div className={styles.contentLayout}>
            <div className={styles.mainColumn}>
              <div className={styles.field}>
                <label htmlFor="title" className={styles.label}>
                  Tiêu đề
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={defaultValues?.title ?? ""}
                  placeholder="Nhập tiêu đề trang giới thiệu..."
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="summary" className={styles.label}>
                  Mô tả ngắn
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  rows={4}
                  defaultValue={defaultValues?.summary ?? ""}
                  placeholder="Nhập mô tả ngắn..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Nội dung</label>

                <div className={styles.editorWrap}>
                  <Ckeditor4Field
                    name="content"
                    defaultValue={defaultValues?.content ?? ""}
                    className={styles.editorTextarea}
                  />
                </div>
              </div>
            </div>

            <aside className={styles.sideColumn}>
              <ProductImageField
                name="bannerImage"
                label="Ảnh banner"
                defaultImage={defaultValues?.bannerImagePath ?? ""}
                alt={defaultValues?.title ?? "about-us-banner"}
              />
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}