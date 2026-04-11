"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import styles from "./logo-form.module.scss";
import type { SaveWebsiteLogoState } from "@/app/(admin)/admin/(dashboard)/logo/actions";

type LogoFormProps = {
  initialValues: {
    siteName: string;

    headerLogoId: number | null;
    headerLogoPath: string;
    headerLogoAltText: string;

    footerLogoId: number | null;
    footerLogoPath: string;
    footerLogoAltText: string;
  };
  action: (
    prevState: SaveWebsiteLogoState,
    formData: FormData,
  ) => Promise<SaveWebsiteLogoState>;
};

const initialState: SaveWebsiteLogoState = {
  success: false,
  message: "",
};

export default function LogoForm({ initialValues, action }: LogoFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  const [headerPreview, setHeaderPreview] = useState(
    initialValues.headerLogoPath || "",
  );
  const [footerPreview, setFooterPreview] = useState(
    initialValues.footerLogoPath || "",
  );

  useEffect(() => {
    setHeaderPreview(initialValues.headerLogoPath || "");
  }, [initialValues.headerLogoPath]);

  useEffect(() => {
    setFooterPreview(initialValues.footerLogoPath || "");
  }, [initialValues.footerLogoPath]);

  const handleChangeHeaderFile = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setHeaderPreview(URL.createObjectURL(file));
  };

  const handleChangeFooterFile = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFooterPreview(URL.createObjectURL(file));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý logo</h1>
          <p className={styles.description}>
            Cập nhật logo header và logo footer cho website.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="submit"
            form="logo-form"
            className={styles.submitButton}
            disabled={isPending}
          >
            {isPending ? "Đang lưu..." : "Lưu logo"}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <form id="logo-form" action={formAction} className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Logo header</h2>

            <div className={styles.logoGrid}>
              <div className={styles.previewCol}>
                <label className={styles.label}>Xem trước logo header</label>

                <div className={styles.previewBox}>
                  {headerPreview ? (
                    <Image
                      src={headerPreview}
                      alt={initialValues.headerLogoAltText || "Header logo"}
                      width={220}
                      height={120}
                      className={styles.previewImage}
                      unoptimized={headerPreview.startsWith("blob:")}
                    />
                  ) : (
                    <span className={styles.placeholder}>
                      Chưa có logo header
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.inputCol}>
                <div className={styles.field}>
                  <label htmlFor="headerLogo" className={styles.label}>
                    Chọn file logo header
                  </label>
                  <input
                    id="headerLogo"
                    name="headerLogo"
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.svg"
                    className={styles.inputFile}
                    onChange={handleChangeHeaderFile}
                  />
                  <div className={styles.helpText}>
                    Hỗ trợ PNG, JPG, JPEG, WEBP, SVG. Tối đa 5MB.
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="headerAltText" className={styles.label}>
                    Alt text logo header
                  </label>
                  <input
                    id="headerAltText"
                    name="headerAltText"
                    type="text"
                    defaultValue={initialValues.headerLogoAltText}
                    placeholder="Nhập mô tả logo header"
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Logo footer</h2>

            <div className={styles.logoGrid}>
              <div className={styles.previewCol}>
                <label className={styles.label}>Xem trước logo footer</label>

                <div className={styles.previewBox}>
                  {footerPreview ? (
                    <Image
                      src={footerPreview}
                      alt={initialValues.footerLogoAltText || "Footer logo"}
                      width={220}
                      height={120}
                      className={styles.previewImage}
                      unoptimized={footerPreview.startsWith("blob:")}
                    />
                  ) : (
                    <span className={styles.placeholder}>
                      Chưa có logo footer
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.inputCol}>
                <div className={styles.field}>
                  <label htmlFor="footerLogo" className={styles.label}>
                    Chọn file logo footer
                  </label>
                  <input
                    id="footerLogo"
                    name="footerLogo"
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.svg"
                    className={styles.inputFile}
                    onChange={handleChangeFooterFile}
                  />
                  <div className={styles.helpText}>
                    Hỗ trợ PNG, JPG, JPEG, WEBP, SVG. Tối đa 5MB.
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="footerAltText" className={styles.label}>
                    Alt text logo footer
                  </label>
                  <input
                    id="footerAltText"
                    name="footerAltText"
                    type="text"
                    defaultValue={initialValues.footerLogoAltText}
                    placeholder="Nhập mô tả logo footer"
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
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
        </form>
      </div>
    </div>
  );
}
