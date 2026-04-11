"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./slideshow-form.module.scss";

type Props = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    id?: number;
    title?: string;
    link?: string;
    altText?: string;
    sortOrder?: number;
    isActive?: boolean;
    imagePath?: string;
  };
};

export default function SlideshowForm({
  title,
  submitLabel,
  action,
  defaultValues,
}: Props) {
  const [preview, setPreview] = useState(defaultValues?.imagePath ?? "");

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>
            Điền thông tin slideshow bên dưới.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="submit"
            form="slideshow-form"
            className={styles.submitButton}
          >
            {submitLabel}
          </button>

          <Link href="/admin/slideshow" className={styles.backButton}>
            Quay lại
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <form id="slideshow-form" action={action} className={styles.form}>
          {defaultValues?.id ? (
            <input type="hidden" name="id" value={defaultValues.id} />
          ) : null}

          <input
            type="hidden"
            name="isActive"
            value={(defaultValues?.isActive ?? true) ? "1" : "0"}
          />

          <div className={styles.contentLayout}>
            <div className={styles.mainColumn}>
              <div className={styles.gridTwo}>
                <div className={styles.field}>
                  <label htmlFor="title" className={styles.label}>
                    Tiêu đề
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={defaultValues?.title ?? ""}
                    placeholder="Nhập tiêu đề slideshow"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="sortOrder" className={styles.label}>
                    Thứ tự hiển thị
                  </label>
                  <input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    defaultValue={defaultValues?.sortOrder ?? 0}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="link" className={styles.label}>
                  Link
                </label>
                <input
                  id="link"
                  name="link"
                  type="text"
                  defaultValue={defaultValues?.link ?? ""}
                  placeholder="https://..."
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="altText" className={styles.label}>
                  Alt text
                </label>
                <input
                  id="altText"
                  name="altText"
                  type="text"
                  defaultValue={defaultValues?.altText ?? ""}
                  placeholder="Nhập mô tả ảnh"
                  className={styles.input}
                />
              </div>
            </div>

            <aside className={styles.sideColumn}>
              <div className={styles.field}>
                <label htmlFor="image" className={styles.label}>
                  Ảnh slideshow
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.svg"
                  className={styles.inputFile}
                  onChange={handleChangeFile}
                  required={!defaultValues?.imagePath}
                />
              </div>

              <div className={styles.previewBox}>
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview slideshow"
                    width={320}
                    height={180}
                    className={styles.previewImage}
                    unoptimized={preview.startsWith("blob:")}
                  />
                ) : (
                  <span className={styles.placeholder}>Chưa có ảnh</span>
                )}
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
