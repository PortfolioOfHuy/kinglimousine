"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "antd";
import styles from "./TagsTable.module.scss";
import { deleteTag } from "@/app/(admin)/admin/(dashboard)/tags/actions";

type TagItem = {
  id: number;
  name: string;
  slug: string;
  productCount: number;
};

type Props = {
  items: TagItem[];
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

function DeleteTagButton({ id, name }: { id: number; name: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleCancel = () => {
    if (submitting) return;
    setOpen(false);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <form
        ref={formRef}
        action={deleteTag}
        onClick={(e) => e.stopPropagation()}
      >
        <input type="hidden" name="id" value={id} />

        <button
          type="button"
          className={`${styles.iconButton} ${styles.deleteButton}`}
          title="Xóa"
          aria-label={`Xóa ${name}`}
          onClick={handleOpen}
        >
          <TrashIcon />
        </button>
      </form>

      <Modal
        open={open}
        centered
        destroyOnHidden
        closable={!submitting}
        onCancel={handleCancel}
        onOk={handleConfirm}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: submitting }}
        cancelButtonProps={{ disabled: submitting }}
        title="Xác nhận xóa tag"
      >
        <p style={{ margin: 0 }}>
          Bạn có chắc muốn xóa tag <strong>"{name}"</strong> không?
        </p>
      </Modal>
    </>
  );
}

export default function TagsTable({ items }: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return items;

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q),
    );
  }, [items, keyword]);

  const goToEdit = (id: number) => {
    router.push(`/admin/tags/${id}/edit`);
  };

  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    id: number,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToEdit(id);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.breadcrumb}>
        <Link href="/admin">Bảng điều khiển</Link>
        <span>/</span>
        <span>Quản lý tag</span>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm tag"
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>
            <SearchIcon />
          </span>
        </div>

        <div className={styles.actions}>
          <Link href="/admin/tags/new" className={styles.addButton}>
            <PlusIcon />
            <span>Thêm mới</span>
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Danh sách tag</h2>
            <p>{filteredItems.length} tag</p>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.sttHead}>STT</th>
                <th>Tên tag</th>
                <th>Slug</th>
                <th className={styles.center}>Sản phẩm</th>
                <th className={styles.center}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyCell}>
                    Chưa có tag nào.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={styles.row}
                    onClick={() => goToEdit(item.id)}
                    onKeyDown={(event) => handleRowKeyDown(event, item.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Chỉnh sửa tag ${item.name}`}
                  >
                    <td>
                      <span className={styles.sttBox}>{index + 1}</span>
                    </td>

                    <td className={styles.nameCell}>
                      <span className={styles.nameText}>{item.name}</span>
                    </td>

                    <td className={styles.slugCell}>{item.slug}</td>

                    <td className={styles.center}>
                      <span className={styles.countBox}>
                        {item.productCount}
                      </span>
                    </td>

                    <td className={styles.center}>
                      <div
                        className={styles.actionGroup}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/admin/tags/${item.id}/edit`}
                          className={styles.iconButton}
                          title="Sửa"
                          aria-label={`Sửa ${item.name}`}
                        >
                          <EditIcon />
                        </Link>

                        <DeleteTagButton id={item.id} name={item.name} />
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
