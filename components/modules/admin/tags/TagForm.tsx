import Link from "next/link";
import styles from "./TagForm.module.scss";

type TagFormProps = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    name?: string;
    slug?: string;
  };
};

export default function TagForm({
  title,
  submitLabel,
  action,
  defaultValues,
}: TagFormProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>
            Điền thông tin tag sản phẩm bên dưới.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button type="submit" form="tag-form" className={styles.submitButton}>
            {submitLabel}
          </button>

          <Link href="/admin/tags" className={styles.backButton}>
            Quay lại
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <form id="tag-form" action={action} className={styles.form}>
          <div className={styles.mainColumn}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Tên tag
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={defaultValues?.name ?? ""}
                placeholder="Nhập tên tag..."
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="slug" className={styles.label}>
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                defaultValue={defaultValues?.slug ?? ""}
                placeholder="Để trống sẽ tự tạo từ tên"
                className={styles.input}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
