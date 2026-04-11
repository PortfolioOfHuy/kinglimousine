"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import styles from "./favicon-form.module.scss";
import type { SaveWebsiteFaviconState } from "@/app/(admin)/admin/(dashboard)/favicon/actions";

type FaviconFormProps = {
  initialValues: {
    siteName: string;
    faviconId: number | null;
    faviconPath: string;
    faviconAltText: string;
  };
  action: (
    prevState: SaveWebsiteFaviconState,
    formData: FormData,
  ) => Promise<SaveWebsiteFaviconState>;
};

const initialState: SaveWebsiteFaviconState = {
  success: false,
  message: "",
};

export default function FaviconForm({
  initialValues,
  action,
}: FaviconFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [preview, setPreview] = useState(initialValues.faviconPath || "");

  useEffect(() => {
    setPreview(initialValues.faviconPath || "");
  }, [initialValues.faviconPath]);

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý favicon</h1>
          <p className={styles.description}>Cập nhật favicon cho website.</p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="submit"
            form="favicon-form"
            className={styles.submitButton}
            disabled={isPending}
          >
            {isPending ? "Đang lưu..." : "Lưu favicon"}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <form id="favicon-form" action={formAction} className={styles.form}>
          <div className={styles.contentLayout}>
            <div className={styles.mainColumn}>
              <div className={styles.field}>
                <label className={styles.label}>Xem trước favicon</label>

                <div className={styles.previewBox}>
                  {preview ? (
                    <Image
                      src={preview}
                      alt={initialValues.faviconAltText || "Favicon website"}
                      width={96}
                      height={96}
                      className={styles.previewImage}
                      unoptimized={preview.startsWith("blob:")}
                    />
                  ) : (
                    <span className={styles.placeholder}>Chưa có favicon</span>
                  )}
                </div>

                {initialValues.faviconPath ? (
                  <div className={styles.currentPath}>
                    Đường dẫn hiện tại: {initialValues.faviconPath}
                  </div>
                ) : null}
              </div>

              <div className={styles.field}>
                <label htmlFor="favicon" className={styles.label}>
                  Chọn file favicon
                </label>
                <input
                  id="favicon"
                  name="favicon"
                  type="file"
                  accept=".png,.ico,.svg,.webp"
                  className={styles.inputFile}
                  onChange={handleChangeFile}
                  required
                />
                <div className={styles.helpText}>
                  Hỗ trợ PNG, ICO, SVG, WEBP. Nên dùng kích thước 32x32 hoặc
                  48x48.
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="altText" className={styles.label}>
                  Alt text favicon
                </label>
                <input
                  id="altText"
                  name="altText"
                  type="text"
                  defaultValue={initialValues.faviconAltText}
                  placeholder="Nhập mô tả favicon"
                  className={styles.input}
                />
              </div>

              {state.message ? (
                <div
                  className={
                    state.success ? styles.successMessage : styles.errorMessage
                  }
                >
                  {state.message}
                </div>
              ) : null}
            </div>

            <aside className={styles.sideColumn}>
              <div className={styles.noteCard}>
                <div className={styles.noteTitle}>Gợi ý</div>
                <div className={styles.noteText}>
                  Favicon nên là ảnh vuông, nền đơn giản, rõ nét ở kích thước
                  nhỏ.
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
