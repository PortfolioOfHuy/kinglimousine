"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactForm } from "@/app/(site)/lien-he/actions";
import styles from "./ContactPageSection.module.scss";

const initialState = {
  success: false,
  message: "",
};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className={styles.form}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label htmlFor="fullName" className={styles.label}>
            Họ và tên
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className={styles.input}
            placeholder="Nhập họ và tên"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="phone" className={styles.label}>
            Số điện thoại
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={styles.input}
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            placeholder="Nhập email"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="companyName" className={styles.label}>
            Công ty
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            className={styles.input}
            placeholder="Tên công ty của bạn"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="subject" className={styles.label}>
          Chủ đề
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className={styles.input}
          placeholder="Nhập chủ đề cần tư vấn"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>
          Nội dung
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className={styles.textarea}
          placeholder="Nhập nội dung cần hỗ trợ"
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={pending}>
        {pending ? "Đang gửi..." : "Gửi thông tin"}
      </button>

      {state.message ? (
        <p
          className={state.success ? styles.successMessage : styles.errorMessage}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}