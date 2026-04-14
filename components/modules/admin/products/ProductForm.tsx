import Link from "next/link";
import styles from "./ProductForm.module.scss";
import Ckeditor4Field from "@/components/modules/admin/ckeditor/Ckeditor4Field";
import ProductImageField from "./ProductImageField";

type CategoryOption = {
  id: number;
  name: string;
};

type TagOption = {
  id: number;
  name: string;
  slug: string;
};

type ProductFormProps = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  categories: CategoryOption[];
  tagOptions: TagOption[];
  defaultValues?: {
    categoryId?: number | null;
    title?: string;
    summary?: string;
    content?: string;
    price?: string | null;
    isFeatured?: boolean;
    isActive?: boolean;
    thumbnailPath?: string | null;
    tagIds?: number[];
  };
};

export default function ProductForm({
  title,
  submitLabel,
  action,
  categories,
  tagOptions,
  defaultValues,
}: ProductFormProps) {
  const isEditMode = Boolean(defaultValues);

  const hiddenIsActive = isEditMode ? (defaultValues?.isActive ?? true) : true;

  const hiddenIsFeatured = isEditMode
    ? (defaultValues?.isFeatured ?? false)
    : false;

  const selectedTagIds = new Set(defaultValues?.tagIds ?? []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>
            Điền thông tin sản phẩm bên dưới.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="submit"
            form="product-form"
            className={styles.submitButton}
          >
            {submitLabel}
          </button>

          <Link href="/admin/products" className={styles.backButton}>
            Quay lại
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <form id="product-form" action={action} className={styles.form}>
          <input
            type="hidden"
            name="isActive"
            value={hiddenIsActive ? "1" : "0"}
          />

          <input
            type="hidden"
            name="isFeatured"
            value={hiddenIsFeatured ? "1" : "0"}
          />

          <div className={styles.contentLayout}>
            <div className={styles.mainColumn}>
              <div className={styles.gridTwo}>
                <div className={styles.field}>
                  <label htmlFor="categoryId" className={styles.label}>
                    Danh mục
                  </label>
                  <select
                    id="categoryId"
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
                  <label htmlFor="price" className={styles.label}>
                    Giá
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="text"
                    defaultValue={defaultValues?.price ?? ""}
                    placeholder="Ví dụ: 1500000"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="title" className={styles.label}>
                  Tiêu đề sản phẩm
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={defaultValues?.title ?? ""}
                  placeholder="Nhập tiêu đề sản phẩm..."
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Thẻ sản phẩm</label>

                {tagOptions.length === 0 ? (
                  <div className={styles.tagsEmpty}>
                    Chưa có thẻ sản phẩm nào.
                  </div>
                ) : (
                  <div className={styles.tagsGrid}>
                    {tagOptions.map((tag) => (
                      <label key={tag.id} className={styles.tagOption}>
                        <input
                          type="checkbox"
                          name="tagIds"
                          value={tag.id}
                          defaultChecked={selectedTagIds.has(tag.id)}
                          className={styles.tagCheckbox}
                        />
                        <span className={styles.tagLabel}>{tag.name}</span>
                      </label>
                    ))}
                  </div>
                )}
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
                label="Ảnh sản phẩm"
                defaultImage={defaultValues?.thumbnailPath ?? ""}
                alt={defaultValues?.title ?? "product"}
              />
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
