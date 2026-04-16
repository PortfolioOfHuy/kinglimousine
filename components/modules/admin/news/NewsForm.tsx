import Link from "next/link";
import styles from "./NewsForm.module.scss";
import Ckeditor4Field from "@/components/modules/admin/ckeditor/Ckeditor4Field";
import ProductImageField from "../products/ProductImageField";

type NewsFormProps = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    id?: number;
    title?: string;
    summary?: string;
    content?: string;
    thumbnailPath?: string | null;
  };
};

export default function NewsForm({
  title,
  submitLabel,
  action,
  defaultValues,
}: NewsFormProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>Điền thông tin tin tức bên dưới.</p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="submit"
            form="news-form"
            className={styles.submitButton}
          >
            {submitLabel}
          </button>

          <Link href="/admin/news" className={styles.backButton}>
            Quay lại
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <form id="news-form" action={action} className={styles.form}>
          {defaultValues?.id ? (
            <input type="hidden" name="id" value={defaultValues.id} />
          ) : null}

          <div className={styles.contentLayout}>
            <div className={styles.mainColumn}>
              <div className={styles.field}>
                <label htmlFor="title" className={styles.label}>
                  Tiêu đề tin tức
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={defaultValues?.title ?? ""}
                  placeholder="Nhập tiêu đề tin tức..."
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
                name="thumbnail"
                label="Ảnh đại diện tin tức"
                defaultImage={defaultValues?.thumbnailPath ?? ""}
                alt={defaultValues?.title ?? "news"}
              />
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
