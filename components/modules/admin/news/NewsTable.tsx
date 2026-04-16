"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "antd";
import styles from "./NewsTable.module.scss";
import {
  deleteNews,
  toggleNewsActive,
} from "@/app/(admin)/admin/(dashboard)/news/actions";

type NewsItem = {
  id: number;
  title: string;
  summary: string | null;
  isActive: boolean;
  thumbnailPath: string | null;
};

type Props = {
  items: NewsItem[];
};

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.iconSvg}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.iconSvg}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.iconSvg}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.iconSvg}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.toggleIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.toggleIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
    >
      <path d="M6 12h12" />
    </svg>
  );
}

function ToggleActiveButton({ id, active }: { id: number; active: boolean }) {
  return (
    <form
      action={toggleNewsActive}
      className={styles.toggleForm}
      onClick={(e) => e.stopPropagation()}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="currentValue" value={String(active)} />
      <button
        type="submit"
        className={
          active ? styles.toggleButtonActive : styles.toggleButtonInactive
        }
        aria-label={active ? "Ẩn tin tức" : "Hiển thị tin tức"}
        title={active ? "Ẩn tin tức" : "Hiển thị tin tức"}
      >
        {active ? <CheckIcon /> : <MinusIcon />}
      </button>
    </form>
  );
}

function DeleteNewsButton({ id, title }: { id: number; title: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <form
        ref={formRef}
        action={deleteNews}
        onClick={(e) => e.stopPropagation()}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="button"
          className={`${styles.iconButton} ${styles.deleteButton}`}
          title="Xóa"
          aria-label={`Xóa ${title}`}
          onClick={() => setOpen(true)}
        >
          <TrashIcon />
        </button>
      </form>

      <Modal
        open={open}
        centered
        destroyOnHidden
        closable={!submitting}
        onCancel={() => !submitting && setOpen(false)}
        onOk={() => {
          setSubmitting(true);
          formRef.current?.requestSubmit();
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: submitting }}
        cancelButtonProps={{ disabled: submitting }}
        title="Xác nhận xóa tin tức"
      >
        <p style={{ margin: 0 }}>
          Bạn có chắc muốn xóa tin tức <strong>"{title}"</strong> không?
        </p>
      </Modal>
    </>
  );
}

export default function NewsTable({ items }: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return items;

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.summary || "").toLowerCase().includes(q),
    );
  }, [items, keyword]);

  const goToEdit = (id: number) => {
    router.push(`/admin/news/${id}/edit`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.breadcrumb}>
        <Link href="/admin">Bảng điều khiển</Link>
        <span>/</span>
        <span>Tin tức</span>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm nhanh"
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>
            <SearchIcon />
          </span>
        </div>

        <div className={styles.actions}>
          <Link href="/admin/news/new" className={styles.addButton}>
            <PlusIcon />
            <span>Thêm mới</span>
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Danh sách tin tức</h2>
            <p>{filteredItems.length} tin tức</p>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.sttHead}>STT</th>
                <th className={styles.imageHead}>Hình</th>
                <th>Tiêu đề</th>
                <th className={styles.center}>Hiển thị</th>
                <th className={styles.center}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyCell}>
                    Chưa có tin tức nào.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={styles.row}
                    onClick={() => goToEdit(item.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Chỉnh sửa tin tức ${item.title}`}
                  >
                    <td>
                      <span className={styles.sttBox}>{index + 1}</span>
                    </td>

                    <td>
                      {item.thumbnailPath ? (
                        <img
                          src={item.thumbnailPath}
                          alt={item.title}
                          className={styles.thumb}
                        />
                      ) : (
                        <div className={styles.noImage}>No image</div>
                      )}
                    </td>

                    <td className={styles.titleCell}>
                      <span className={styles.titleText}>{item.title}</span>
                    </td>

                    <td className={styles.center}>
                      <ToggleActiveButton id={item.id} active={item.isActive} />
                    </td>

                    <td className={styles.center}>
                      <div
                        className={styles.actionGroup}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/admin/news/${item.id}/edit`}
                          className={styles.iconButton}
                          title="Sửa"
                          aria-label={`Sửa ${item.title}`}
                        >
                          <EditIcon />
                        </Link>

                        <DeleteNewsButton id={item.id} title={item.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
