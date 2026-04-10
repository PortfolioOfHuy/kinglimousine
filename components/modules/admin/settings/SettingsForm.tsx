"use client";

import { useActionState, useMemo, useState } from "react";
import styles from "./SettingsForm.module.scss";

export type SettingsActionState = {
  success: boolean;
  message: string;
};

type SettingsFormValues = {
  siteName: string;
  address: string;
  email: string;
  hotline: string;
  phone: string;
  zaloPhone: string;
  zaloOaId: string;
  websiteUrl: string;
  facebookUrl: string;
  googleMapCoordinates: string;
  googleMapIframe: string;
  googleAnalytics: string;
  googleWebmasterTool: string;
  headerScripts: string;
  bodyScripts: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  primaryKeyword: string;
};

type Props = {
  initialValues: SettingsFormValues;
  action: (
    state: SettingsActionState,
    formData: FormData,
  ) => Promise<SettingsActionState>;
};

const initialState: SettingsActionState = {
  success: false,
  message: "",
};

function normalizePreviewUrl(input: string) {
  const value = input.trim();
  if (!value) return "https://your-domain.com/";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export default function SettingsForm({ initialValues, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [values, setValues] = useState(initialValues);

  function updateField<K extends keyof SettingsFormValues>(
    key: K,
    value: SettingsFormValues[K],
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const seoStats = useMemo(() => {
    const title = values.metaTitle.trim();
    const description = values.metaDescription.trim();
    const keywords = values.metaKeywords.trim().toLowerCase();
    const primaryKeyword = values.primaryKeyword.trim().toLowerCase();

    const titleLength = title.length;
    const descriptionLength = description.length;

    const hasKeyword = Boolean(primaryKeyword) || Boolean(keywords);

    const keywordInTitle =
      primaryKeyword.length > 0 && title.toLowerCase().includes(primaryKeyword);

    const keywordInDescription =
      primaryKeyword.length > 0 &&
      description.toLowerCase().includes(primaryKeyword);

    const keywordInKeywords =
      primaryKeyword.length > 0 && keywords.includes(primaryKeyword);

    return {
      titleLength,
      descriptionLength,
      titleOk: titleLength >= 30 && titleLength <= 65,
      descriptionOk: descriptionLength >= 120 && descriptionLength <= 160,
      keywordOk:
        hasKeyword &&
        (primaryKeyword.length === 0 ||
          keywordInTitle ||
          keywordInDescription ||
          keywordInKeywords),
    };
  }, [
    values.metaTitle,
    values.metaDescription,
    values.metaKeywords,
    values.primaryKeyword,
  ]);

  const previewUrl = normalizePreviewUrl(values.websiteUrl);
  const previewTitle =
    values.metaTitle.trim() || values.siteName.trim() || "Tiêu đề SEO";
  const previewDescription =
    values.metaDescription.trim() || "Mô tả SEO sẽ hiển thị ở đây.";

  return (
    <form action={formAction} className={styles.settingsForm}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Cài đặt website</h1>
          <p className={styles.pageDesc}>
            Quản lý thông tin liên hệ, script và SEO trang chủ
          </p>
        </div>

        <button
          type="submit"
          className={styles.saveButton}
          disabled={isPending}
        >
          {isPending ? "Đang lưu..." : "Lưu cài đặt"}
        </button>
      </div>

      {state.message ? (
        <div
          className={`${styles.alert} ${
            state.success ? styles.alertSuccess : styles.alertError
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Thông tin chung</h2>

        <div className={styles.grid1}>
          <Field label="Tiêu đề (vi)">
            <input
              name="siteName"
              className={styles.input}
              placeholder="Nhập tiêu đề website"
              value={values.siteName}
              onChange={(e) => updateField("siteName", e.target.value)}
            />
          </Field>
        </div>

        <div className={styles.grid3}>
          <Field label="Địa chỉ">
            <input
              name="address"
              className={styles.input}
              placeholder="Địa chỉ công ty"
              value={values.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </Field>

          <Field label="Email">
            <input
              name="email"
              className={styles.input}
              placeholder="contact@domain.com"
              value={values.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </Field>

          <Field label="Hotline">
            <input
              name="hotline"
              className={styles.input}
              placeholder="Hotline"
              value={values.hotline}
              onChange={(e) => updateField("hotline", e.target.value)}
            />
          </Field>

          <Field label="Điện thoại">
            <input
              name="phone"
              className={styles.input}
              placeholder="Điện thoại hiển thị"
              value={values.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </Field>

          <Field label="Zalo">
            <input
              name="zaloPhone"
              className={styles.input}
              placeholder="Số Zalo"
              value={values.zaloPhone}
              onChange={(e) => updateField("zaloPhone", e.target.value)}
            />
          </Field>

          <Field label="OAID Zalo">
            <input
              name="zaloOaId"
              className={styles.input}
              placeholder="OAID Zalo"
              value={values.zaloOaId}
              onChange={(e) => updateField("zaloOaId", e.target.value)}
            />
          </Field>

          <Field label="Website">
            <input
              name="websiteUrl"
              className={styles.input}
              placeholder="https://your-domain.com"
              value={values.websiteUrl}
              onChange={(e) => updateField("websiteUrl", e.target.value)}
            />
          </Field>

          <Field label="Fanpage">
            <input
              name="facebookUrl"
              className={styles.input}
              placeholder="https://facebook.com/your-page"
              value={values.facebookUrl}
              onChange={(e) => updateField("facebookUrl", e.target.value)}
            />
          </Field>

          <Field label="Tọa độ google map">
            <input
              name="googleMapCoordinates"
              className={styles.input}
              placeholder="10.123456, 106.123456"
              value={values.googleMapCoordinates}
              onChange={(e) =>
                updateField("googleMapCoordinates", e.target.value)
              }
            />
          </Field>
        </div>

        <div className={styles.grid1}>
          <Field label="Tọa độ google map iframe">
            <textarea
              name="googleMapIframe"
              className={`${styles.textarea} ${styles.textareaMd}`}
              placeholder='<iframe src="..."></iframe>'
              value={values.googleMapIframe}
              onChange={(e) => updateField("googleMapIframe", e.target.value)}
            />
          </Field>
        </div>

        <div className={styles.grid1}>
          <Field label="Google analytics">
            <textarea
              name="googleAnalytics"
              className={`${styles.textarea} ${styles.textareaSm}`}
              placeholder="G-XXXXXXXXXX hoặc đoạn mã analytics"
              value={values.googleAnalytics}
              onChange={(e) => updateField("googleAnalytics", e.target.value)}
            />
          </Field>

          <Field label="Google Webmaster Tool">
            <textarea
              name="googleWebmasterTool"
              className={`${styles.textarea} ${styles.textareaSm}`}
              placeholder="Mã xác minh hoặc nội dung liên quan"
              value={values.googleWebmasterTool}
              onChange={(e) =>
                updateField("googleWebmasterTool", e.target.value)
              }
            />
          </Field>

          <Field label="Head JS">
            <textarea
              name="headerScripts"
              className={`${styles.textarea} ${styles.textareaSm}`}
              placeholder="<meta ...> hoặc <script ...>"
              value={values.headerScripts}
              onChange={(e) => updateField("headerScripts", e.target.value)}
            />
          </Field>

          <Field label="Body JS">
            <textarea
              name="bodyScripts"
              className={`${styles.textarea} ${styles.textareaSm}`}
              placeholder="<script>...</script>"
              value={values.bodyScripts}
              onChange={(e) => updateField("bodyScripts", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>SEO trang chủ</h2>

        <div className={styles.grid1}>
          <Field label="SEO Title (vi)">
            <input
              name="metaTitle"
              className={styles.input}
              placeholder="SEO title"
              value={values.metaTitle}
              onChange={(e) => updateField("metaTitle", e.target.value)}
            />
          </Field>

          <Field label="SEO Keywords (vi)">
            <input
              name="metaKeywords"
              className={styles.input}
              placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
              value={values.metaKeywords}
              onChange={(e) => updateField("metaKeywords", e.target.value)}
            />
          </Field>

          <Field label="SEO Description (vi)">
            <textarea
              name="metaDescription"
              className={`${styles.textarea} ${styles.textareaMd}`}
              placeholder="Mô tả SEO"
              value={values.metaDescription}
              onChange={(e) => updateField("metaDescription", e.target.value)}
            />
          </Field>

          <Field label="Keyword chính (vi)">
            <input
              name="primaryKeyword"
              className={styles.input}
              placeholder="Keyword chính"
              value={values.primaryKeyword}
              onChange={(e) => updateField("primaryKeyword", e.target.value)}
            />
          </Field>
        </div>

        <div className={styles.seoChecks}>
          <SeoCheckItem
            ok={seoStats.titleOk}
            label={`Độ dài tiêu đề phù hợp (${seoStats.titleLength}/65)`}
          />
          <SeoCheckItem ok={seoStats.keywordOk} label="Đã có từ khóa" />
          <SeoCheckItem
            ok={seoStats.descriptionOk}
            label={`Độ dài mô tả phù hợp (${seoStats.descriptionLength}/160)`}
          />
        </div>

        <div className={styles.previewBox}>
          <div className={styles.previewLabel}>
            Khi lên top, page này sẽ hiển thị theo dạng mẫu như sau:
          </div>

          <div className={styles.previewUrl}>{previewUrl}</div>
          <div className={styles.previewTitle}>{previewTitle}</div>
          <div className={styles.previewDescription}>{previewDescription}</div>
        </div>
      </section>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}:</span>
      {children}
    </label>
  );
}

function SeoCheckItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`${styles.seoCheckItem} ${
        ok ? styles.seoCheckSuccess : styles.seoCheckError
      }`}
    >
      <span className={styles.seoCheckIcon}>{ok ? "✓" : "!"}</span>
      <span>{label}</span>
    </div>
  );
}
