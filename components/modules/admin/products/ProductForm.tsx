import Link from "next/link";
import styles from "./ProductForm.module.scss";

type CategoryOption = {
  id: number;
  name: string;
};

type ProductFormProps = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  categories: CategoryOption[];
  defaultValues?: {
    categoryId?: number | null;
    title?: string;
    summary?: string;
    content?: string;
    price?: string | null;
    isFeatured?: boolean;
    isActive?: boolean;
    thumbnailPath?: string | null;
  };
};

export default function ProductForm({
  title,
  submitLabel,
  action,
  categories,
  defaultValues,
}: ProductFormProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>Điền thông tin sản phẩm bên dưới.</p>
      </div>

      <div className={styles.card}>
        <form action={action} className={styles.form}>
          <div className={styles.gridTwo}>
            <div className={styles.field}>
              <label className={styles.label}>Danh mục</label>
              <select
                name="categoryId"
                defaultValue={defaultValues?.categoryId ?? ""}
                className={styles.select}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Giá</label>
              <input
                name="price"
                type="text"
                defaultValue={defaultValues?.price ?? ""}
                placeholder="Ví dụ: 1500000"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tiêu đề sản phẩm</label>
            <input
              name="title"
              type="text"
              required
              defaultValue={defaultValues?.title ?? ""}
              placeholder="Nhập tiêu đề sản phẩm..."
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mô tả ngắn</label>
            <textarea
              name="summary"
              rows={4}
              defaultValue={defaultValues?.summary ?? ""}
              placeholder="Nhập mô tả ngắn..."
              className={styles.textarea}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Nội dung</label>
            <textarea
              name="content"
              rows={10}
              defaultValue={defaultValues?.content ?? ""}
              placeholder="Nhập nội dung chi tiết..."
              className={styles.textarea}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Ảnh sản phẩm</label>

            {defaultValues?.thumbnailPath ? (
              <div className={styles.previewBox}>
                <img
                  src={defaultValues.thumbnailPath}
                  alt={defaultValues.title ?? "product"}
                  className={styles.previewImage}
                />
              </div>
            ) : null}

            <input
              name="thumbnail"
              type="file"
              accept="image/*"
              className={styles.fileInput}
            />
          </div>

          <div className={styles.statusGrid}>
            <label className={styles.checkboxCard}>
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={Boolean(defaultValues?.isFeatured)}
              />
              <span className={styles.checkboxText}>
                <strong>Sản phẩm nổi bật</strong>
                <small>Bật để ưu tiên hiển thị sản phẩm này</small>
              </span>
            </label>

            <label className={styles.checkboxCard}>
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={defaultValues?.isActive ?? true}
              />
              <span className={styles.checkboxText}>
                <strong>Hiển thị sản phẩm</strong>
                <small>Cho phép sản phẩm xuất hiện ngoài giao diện</small>
              </span>
            </label>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton}>
              {submitLabel}
            </button>

            <Link href="/admin/products" className={styles.backButton}>
              Quay lại
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
