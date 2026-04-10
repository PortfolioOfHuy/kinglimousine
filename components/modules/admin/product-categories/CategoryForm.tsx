import Link from "next/link";
import styles from "./CategoryForm.module.scss";

type CategoryFormProps = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    name?: string;
    isFeatured?: boolean;
    isActive?: boolean;
  };
  showStatusFields?: boolean;
};

export default function CategoryForm({
  title,
  submitLabel,
  action,
  defaultValues,
  showStatusFields = false,
}: CategoryFormProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>Điền thông tin danh mục bên dưới.</p>
      </div>

      <div className={styles.card}>
        <form action={action} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Tên danh mục
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={defaultValues?.name ?? ""}
              placeholder="Nhập tên danh mục..."
              className={styles.input}
            />
          </div>

          {showStatusFields && (
            <div className={styles.statusGrid}>
              <label className={styles.checkboxCard}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={Boolean(defaultValues?.isFeatured)}
                />
                <span className={styles.checkboxText}>
                  <strong>Danh mục nổi bật</strong>
                  <small>Bật để ưu tiên hiển thị danh mục này</small>
                </span>
              </label>

              <label className={styles.checkboxCard}>
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={defaultValues?.isActive ?? true}
                />
                <span className={styles.checkboxText}>
                  <strong>Hiển thị danh mục</strong>
                  <small>Cho phép danh mục xuất hiện ngoài giao diện</small>
                </span>
              </label>
            </div>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton}>
              {submitLabel}
            </button>

            <Link
              href="/admin/product-categories"
              className={styles.backButton}
            >
              Quay lại
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
