"use client";

import Link from "next/link";
import styles from "./WhyChooseUsSectionForm.module.scss";
import WhyChooseUsSectionImageField from "./WhyChooseUsSectionImageField";

type Props = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    summary?: string;
    imagePath?: string | null;
  };
};

export default function WhyChooseUsSectionForm({
  title,
  submitLabel,
  action,
  defaultValues,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>
            Cập nhật mô tả và ảnh nền cho khối chính.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="submit"
            form="why-choose-us-section-form"
            className={styles.submitButton}
          >
            {submitLabel}
          </button>

          <Link href="/admin/why-choose-us/items" className={styles.backButton}>
            Quản lý các item
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <form
          id="why-choose-us-section-form"
          action={action}
          className={styles.form}
        >
          <div className={styles.contentLayout}>
            <div className={styles.mainColumn}>
              <div className={styles.field}>
                <label htmlFor="summary" className={styles.label}>
                  Mô tả
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  rows={6}
                  defaultValue={defaultValues?.summary ?? ""}
                  placeholder="Nhập mô tả..."
                  className={styles.textarea}
                />
              </div>
            </div>

            <aside className={styles.sideColumn}>
              <WhyChooseUsSectionImageField
                name="featuredImage"
                label="Ảnh khối chính"
                defaultImage={defaultValues?.imagePath ?? ""}
                alt="why-choose-us"
              />
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
