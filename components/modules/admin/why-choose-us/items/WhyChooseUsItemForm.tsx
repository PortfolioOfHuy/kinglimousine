"use client";

import Link from "next/link";
import styles from "./WhyChooseUsItemForm.module.scss";
import Ckeditor4Field from "@/components/modules/admin/ckeditor/Ckeditor4Field";

type Props = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    title?: string;
    summary?: string;
    content?: string;
  };
};

export default function WhyChooseUsItemForm({
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
            Nhập tiêu đề, mô tả và nội dung cho item.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="submit"
            form="why-choose-us-item-form"
            className={styles.submitButton}
          >
            {submitLabel}
          </button>

          <Link href="/admin/why-choose-us/items" className={styles.backButton}>
            Quay lại
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <form
          id="why-choose-us-item-form"
          action={action}
          className={styles.form}
        >
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
              placeholder="Nhập tiêu đề..."
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
        </form>
      </div>
    </div>
  );
}
