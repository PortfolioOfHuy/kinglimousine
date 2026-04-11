"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "antd";
import { Search, Check, Minus, Pencil, Trash2 } from "lucide-react";
import styles from "./slideshow-table.module.scss";
import { deleteSlideshow } from "@/app/(admin)/admin/(dashboard)/slideshow/actions";

type SlideshowItem = {
  id: number;
  title: string;
  link: string;
  altText: string;
  sortOrder: number;
  isActive: boolean;
  imagePath: string;
};

type Props = {
  items: SlideshowItem[];
};

function DeleteSlideshowButton({ id, title }: { id: number; title: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <form ref={formRef} action={deleteSlideshow}>
        <input type="hidden" name="id" value={id} />
        <button
          type="button"
          className={styles.iconDangerButton}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          aria-label="Xóa slideshow"
          title="Xóa"
        >
          <Trash2 size={18} strokeWidth={2.2} />
        </button>
      </form>

      <Modal
        open={open}
        centered
        destroyOnHidden
        closable={!submitting}
        onCancel={() => !submitting && setOpen(false)}
        onOk={handleConfirm}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: submitting }}
        cancelButtonProps={{ disabled: submitting }}
        title="Xác nhận xóa slideshow"
      >
        <p style={{ margin: 0 }}>
          Bạn có chắc muốn xóa slideshow <strong>"{title || `#${id}`}"</strong>{" "}
          không?
        </p>
      </Modal>
    </>
  );
}

function ToggleActiveButton({
  id,
  active,
  onChanged,
}: {
  id: number;
  active: boolean;
  onChanged: (id: number, nextValue: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (loading) return;

    const nextValue = !active;
    onChanged(id, nextValue);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/slideshow/toggle-active", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        onChanged(id, active);
        return;
      }

      onChanged(id, result.data.isActive);
    } catch (error) {
      console.error(error);
      onChanged(id, active);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={
        active ? styles.toggleButtonActive : styles.toggleButtonInactive
      }
      aria-label={active ? "Đang hiển thị" : "Đang ẩn"}
      title={active ? "Đang hiển thị" : "Đang ẩn"}
      disabled={loading}
    >
      {active ? (
        <Check size={16} strokeWidth={2.6} />
      ) : (
        <Minus size={16} strokeWidth={2.6} />
      )}
    </button>
  );
}

function SortOrderInput({
  id,
  value,
  onChanged,
}: {
  id: number;
  value: number;
  onChanged: (id: number, nextValue: number) => void;
}) {
  const [localValue, setLocalValue] = useState(String(value));
  const [loading, setLoading] = useState(false);

  const submitValue = async () => {
    const nextValue = Number(localValue);

    if (Number.isNaN(nextValue)) {
      setLocalValue(String(value));
      return;
    }

    onChanged(id, nextValue);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/slideshow/update-sort-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          sortOrder: nextValue,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        onChanged(id, value);
        setLocalValue(String(value));
        return;
      }

      setLocalValue(String(result.data.sortOrder));
      onChanged(id, result.data.sortOrder);
    } catch (error) {
      console.error(error);
      onChanged(id, value);
      setLocalValue(String(value));
    } finally {
      setLoading(false);
    }
  };

  return (
    <input
      type="number"
      value={localValue}
      disabled={loading}
      className={styles.sortInput}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={submitValue}
      onKeyDown={(e) => {
        e.stopPropagation();

        if (e.key === "Enter") {
          e.preventDefault();
          void submitValue();
        }
      }}
    />
  );
}

export default function SlideshowsTable({ items }: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [tableItems, setTableItems] = useState(items);

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return tableItems;

    return tableItems.filter((item) => item.title.toLowerCase().includes(q));
  }, [tableItems, keyword]);

  const goToEdit = (id: number) => {
    router.push(`/admin/slideshow/${id}/edit`);
  };

  const handleChangedActive = (id: number, nextValue: boolean) => {
    setTableItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: nextValue } : item,
      ),
    );
  };

  const handleChangedSortOrder = (id: number, nextValue: number) => {
    setTableItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, sortOrder: nextValue } : item,
        )
        .sort((a, b) => a.sortOrder - b.sortOrder || b.id - a.id),
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.breadcrumb}>
        <Link href="/admin">Bảng điều khiển</Link>
        <span>/</span>
        <span>Quản lý slideshow</span>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>
            <Search size={18} strokeWidth={2.2} />
          </span>

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm slideshow"
            className={styles.searchInput}
          />
        </div>

        <div className={styles.actions}>
          <Link href="/admin/slideshow/new" className={styles.addButton}>
            <span>Thêm mới</span>
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Danh sách slideshow</h2>
            <p>{filteredItems.length} slideshow</p>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Hình ảnh</th>
                <th>Tiêu đề</th>
                <th className={styles.center}>Thứ tự</th>
                <th className={styles.center}>Hiển thị</th>
                <th className={styles.center}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyCell}>
                    Chưa có slideshow nào.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={styles.row}
                    onClick={() => goToEdit(item.id)}
                  >
                    <td>
                      <span className={styles.sttBox}>{index + 1}</span>
                    </td>

                    <td>
                      {item.imagePath ? (
                        <img
                          src={item.imagePath}
                          alt={item.altText || item.title || "slideshow"}
                          className={styles.thumb}
                        />
                      ) : (
                        <div className={styles.noImage}>No image</div>
                      )}
                    </td>

                    <td>
                      <div className={styles.titleText}>
                        {item.title || "—"}
                      </div>
                    </td>

                    <td className={styles.center}>
                      <SortOrderInput
                        id={item.id}
                        value={item.sortOrder}
                        onChanged={handleChangedSortOrder}
                      />
                    </td>

                    <td className={styles.center}>
                      <ToggleActiveButton
                        id={item.id}
                        active={item.isActive}
                        onChanged={handleChangedActive}
                      />
                    </td>

                    <td className={styles.center}>
                      <div
                        className={styles.actionGroup}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/admin/slideshow/${item.id}/edit`}
                          className={styles.iconButton}
                          aria-label="Sửa slideshow"
                          title="Sửa"
                        >
                          <Pencil size={18} strokeWidth={2.2} />
                        </Link>

                        <DeleteSlideshowButton
                          id={item.id}
                          title={item.title}
                        />
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
