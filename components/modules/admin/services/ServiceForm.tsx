"use client";

import Link from "next/link";
import styles from "./ServiceForm.module.scss";
import Ckeditor4Field from "@/components/modules/admin/ckeditor/Ckeditor4Field";
import ServiceImageField from "./ServiceImageField";

type ServiceFormProps = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    title?: string;
    summary?: string;
    content?: string;
    imagePath?: string | null;
  };
};

export default function ServiceForm({
  title,
  submitLabel,
  action,
  defaultValues,
}: ServiceFormProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>Điền thông tin dịch vụ bên dưới.</p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="submit"
            form="service-form"
            className={styles.submitButton}
          >
            {submitLabel}
          </button>

          <Link href="/admin/services" className={styles.backButton}>
            Quay lại
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <form id="service-form" action={action} className={styles.form}>
          <div className={styles.contentLayout}>
            <div className={styles.mainColumn}>
              <div className={styles.field}>
                <label htmlFor="title" className={styles.label}>
                  Tiêu đề dịch vụ
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={defaultValues?.title ?? ""}
                  placeholder="Nhập tiêu đề dịch vụ..."
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
              <ServiceImageField
                name="featuredImage"
                label="Ảnh dịch vụ"
                defaultImage={defaultValues?.imagePath ?? ""}
                alt={defaultValues?.title ?? "service"}
              />
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
