"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./HowToBookImageField.module.scss";

type Props = {
  name: string;
  label: string;
  defaultImage?: string;
  alt?: string;
};

export default function HowToBookImageField({
  name,
  label,
  defaultImage = "",
  alt = "preview",
}: Props) {
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return defaultImage || "";
    return URL.createObjectURL(file);
  }, [file, defaultImage]);

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return (
    <div className={styles.box}>
      <label className={styles.label}>{label}</label>

      <div className={styles.previewBox}>
        {previewUrl ? (
          <img src={previewUrl} alt={alt} className={styles.previewImage} />
        ) : (
          <div className={styles.emptyPreview}>Chưa có ảnh</div>
        )}
      </div>

      <input
        name={name}
        type="file"
        accept="image/*"
        className={styles.fileInput}
        onChange={(e) => {
          const nextFile = e.target.files?.[0] ?? null;
          setFile(nextFile);
        }}
      />

      <p className={styles.note}>Chọn ảnh để xem trước trước khi lưu.</p>
    </div>
  );
}
