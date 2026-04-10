"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "antd";
import styles from "./ProductsTable.module.scss";
import {
  deleteProduct,
  toggleProductActive,
  toggleProductFeatured,
} from "@/app/(admin)/admin/(dashboard)/products/actions";

type ProductItem = {
  id: number;
  title: string;
  categoryName: string;
  price: string | null;
  isFeatured: boolean;
  isActive: boolean;
  thumbnailPath: string | null;
};

type Props = {
  items: ProductItem[];
};

function formatPrice(value: string | null) {
  if (!value) return "—";

  const num = Number(value);
  if (Number.isNaN(num)) return "—";

  return new Intl.NumberFormat("vi-VN").format(num) + " đ";
}

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

function ToggleStatusButton({
  id,
  active,
  action,
  label,
}: {
  id: number;
  active: boolean;
  action: (formData: FormData) => void | Promise<void>;
  label: string;
}) {
  return (
    <form
      action={action}
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
        aria-label={label}
        title={label}
      >
        {active ? <CheckIcon /> : <MinusIcon />}
      </button>
    </form>
  );
}

function DeleteProductButton({ id, title }: { id: number; title: string }) {
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
        action={deleteProduct}
        onClick={(e) => e.stopPropagation()}
      >
        <input type="hidden" name="id" value={id} />

        <button
          type="button"
          className={`${styles.iconButton} ${styles.deleteButton}`}
          title="Xóa"
          aria-label={`Xóa ${title}`}
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
        title="Xác nhận xóa sản phẩm"
      >
        <p style={{ margin: 0 }}>
          Bạn có chắc muốn xóa sản phẩm <strong>"{title}"</strong> không?
        </p>
      </Modal>
    </>
  );
}

export default function ProductsTable({ items }: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return items;

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q),
    );
  }, [items, keyword]);

  const goToEdit = (id: number) => {
    router.push(`/admin/products/${id}/edit`);
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
        <span>Quản lý sản phẩm</span>
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
          <Link href="/admin/products/new" className={styles.addButton}>
            <PlusIcon />
            <span>Thêm mới</span>
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Danh sách sản phẩm</h2>
            <p>{filteredItems.length} sản phẩm</p>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.sttHead}>STT</th>
                <th className={styles.imageHead}>Hình</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th className={styles.center}>Giá</th>
                <th className={styles.center}>Nổi bật</th>
                <th className={styles.center}>Hiển thị</th>
                <th className={styles.center}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyCell}>
                    Chưa có sản phẩm nào.
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
                    aria-label={`Chỉnh sửa sản phẩm ${item.title}`}
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

                    <td className={styles.categoryCell}>{item.categoryName}</td>

                    <td className={styles.center}>
                      <span className={styles.priceValue}>
                        {formatPrice(item.price)}
                      </span>
                    </td>

                    <td className={styles.center}>
                      <ToggleStatusButton
                        id={item.id}
                        active={item.isFeatured}
                        action={toggleProductFeatured}
                        label={item.isFeatured ? "Bỏ nổi bật" : "Đặt nổi bật"}
                      />
                    </td>

                    <td className={styles.center}>
                      <ToggleStatusButton
                        id={item.id}
                        active={item.isActive}
                        action={toggleProductActive}
                        label={
                          item.isActive ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"
                        }
                      />
                    </td>

                    <td className={styles.center}>
                      <div
                        className={styles.actionGroup}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/admin/products/${item.id}/edit`}
                          className={styles.iconButton}
                          title="Sửa"
                          aria-label={`Sửa ${item.title}`}
                        >
                          <EditIcon />
                        </Link>

                        <DeleteProductButton id={item.id} title={item.title} />
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
