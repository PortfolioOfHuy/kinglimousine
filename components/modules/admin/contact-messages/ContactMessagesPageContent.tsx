import Link from "next/link";
import {
  deleteContactMessage,
  saveContactNote,
  updateContactStatus,
} from "@/app/(admin)/admin/(dashboard)/contacts/action";
import styles from "./ContactMessagesPageContent.module.scss";

type ContactItem = {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  companyName: string | null;
  subject: string | null;
  message: string | null;
  status: "NEW" | "READ" | "REPLIED" | "SPAM";
  sourcePage: string | null;
  noteInternal: string | null;
  sentToZalo: boolean;
  sentToEmail: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type SelectedItem = {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  companyName: string | null;
  subject: string | null;
  message: string | null;
  serviceType: string | null;
  sourcePage: string | null;
  noteInternal: string | null;
  status: "NEW" | "READ" | "REPLIED" | "SPAM";
  sentToZalo: boolean;
  sentToEmail: boolean;
  createdAt: Date;
  updatedAt: Date;
} | null;

type Props = {
  data: {
    filters: {
      status: string;
      q: string;
    };
    counts: {
      ALL: number;
      NEW: number;
      READ: number;
      REPLIED: number;
      SPAM: number;
    };
    items: ContactItem[];
    selectedItem: SelectedItem;
  };
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function getStatusText(status: ContactItem["status"]) {
  switch (status) {
    case "NEW":
      return "Mới";
    case "READ":
      return "Đã xem";
    case "REPLIED":
      return "Đã phản hồi";
    case "SPAM":
      return "Spam";
    default:
      return status;
  }
}

export default function ContactMessagesPageContent({ data }: Props) {
  const { filters, counts, items, selectedItem } = data;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Liên hệ từ website</h1>
          <p className={styles.description}>
            Quản lý các yêu cầu liên hệ được gửi từ trang liên hệ.
          </p>
        </div>
      </div>

      <div className={styles.filterCard}>
        <form method="GET" className={styles.filterForm}>
          <div className={styles.searchField}>
            <input
              type="text"
              name="q"
              defaultValue={filters.q}
              placeholder="Tìm theo tên, số điện thoại, email, chủ đề..."
              className={styles.searchInput}
            />
          </div>

          <div className={styles.statusField}>
            <select
              name="status"
              defaultValue={filters.status}
              className={styles.select}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="NEW">Mới</option>
              <option value="READ">Đã xem</option>
              <option value="REPLIED">Đã phản hồi</option>
              <option value="SPAM">Spam</option>
            </select>
          </div>

          <button type="submit" className={styles.filterButton}>
            Lọc dữ liệu
          </button>

          <Link href="/admin/contact-messages" className={styles.resetButton}>
            Xóa lọc
          </Link>
        </form>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <strong>{counts.ALL}</strong>
            <span>Tất cả</span>
          </div>
          <div className={styles.statItem}>
            <strong>{counts.NEW}</strong>
            <span>Mới</span>
          </div>
          <div className={styles.statItem}>
            <strong>{counts.READ}</strong>
            <span>Đã xem</span>
          </div>
          <div className={styles.statItem}>
            <strong>{counts.REPLIED}</strong>
            <span>Đã phản hồi</span>
          </div>
          <div className={styles.statItem}>
            <strong>{counts.SPAM}</strong>
            <span>Spam</span>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.listCard}>
          <div className={styles.listHeader}>
            <span>Danh sách liên hệ</span>
            <strong>{items.length} mục</strong>
          </div>

          {items.length ? (
            <div className={styles.list}>
              {items.map((item) => {
                const active = selectedItem?.id === item.id;

                return (
                  <Link
                    key={item.id}
                    href={`/admin/contact-messages?id=${item.id}${
                      filters.status !== "ALL" ? `&status=${filters.status}` : ""
                    }${filters.q ? `&q=${encodeURIComponent(filters.q)}` : ""}`}
                    className={`${styles.listItem} ${
                      active ? styles.listItemActive : ""
                    }`}
                  >
                    <div className={styles.listItemTop}>
                      <strong className={styles.name}>{item.fullName}</strong>
                      <span
                        className={`${styles.badge} ${
                          styles[`badge${item.status}`]
                        }`}
                      >
                        {getStatusText(item.status)}
                      </span>
                    </div>

                    <div className={styles.meta}>
                      <span>{item.phone}</span>
                      {item.email ? <span>{item.email}</span> : null}
                    </div>

                    {item.subject ? (
                      <p className={styles.subject}>{item.subject}</p>
                    ) : null}

                    <div className={styles.bottomMeta}>
                      <span>{formatDateTime(item.createdAt)}</span>
                      {item.sourcePage ? <span>{item.sourcePage}</span> : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className={styles.emptyText}>Chưa có liên hệ nào phù hợp.</p>
          )}
        </div>

        <div className={styles.detailCard}>
          {selectedItem ? (
            <>
              <div className={styles.detailHeader}>
                <div>
                  <h2 className={styles.detailTitle}>{selectedItem.fullName}</h2>
                  <p className={styles.detailSub}>
                    Gửi lúc {formatDateTime(selectedItem.createdAt)}
                  </p>
                </div>

                <span
                  className={`${styles.badge} ${
                    styles[`badge${selectedItem.status}`]
                  }`}
                >
                  {getStatusText(selectedItem.status)}
                </span>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Số điện thoại</span>
                  <strong className={styles.infoValue}>{selectedItem.phone}</strong>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email</span>
                  <strong className={styles.infoValue}>
                    {selectedItem.email || "-"}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Công ty</span>
                  <strong className={styles.infoValue}>
                    {selectedItem.companyName || "-"}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Dịch vụ</span>
                  <strong className={styles.infoValue}>
                    {selectedItem.serviceType || "-"}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Nguồn trang</span>
                  <strong className={styles.infoValue}>
                    {selectedItem.sourcePage || "-"}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Gửi Zalo</span>
                  <strong className={styles.infoValue}>
                    {selectedItem.sentToZalo ? "Đã gửi" : "Chưa gửi"}
                  </strong>
                </div>
              </div>

              <div className={styles.contentBlock}>
                <h3 className={styles.blockTitle}>Chủ đề</h3>
                <p className={styles.contentText}>{selectedItem.subject || "-"}</p>
              </div>

              <div className={styles.contentBlock}>
                <h3 className={styles.blockTitle}>Nội dung</h3>
                <p className={styles.contentText}>
                  {selectedItem.message || "Không có nội dung."}
                </p>
              </div>

              <div className={styles.actionBlock}>
                <h3 className={styles.blockTitle}>Cập nhật trạng thái</h3>

                <div className={styles.statusActions}>
                  <form action={updateContactStatus}>
                    <input type="hidden" name="id" value={selectedItem.id} />
                    <input type="hidden" name="status" value="NEW" />
                    <button type="submit" className={styles.actionButton}>
                      Đánh dấu mới
                    </button>
                  </form>

                  <form action={updateContactStatus}>
                    <input type="hidden" name="id" value={selectedItem.id} />
                    <input type="hidden" name="status" value="READ" />
                    <button type="submit" className={styles.actionButton}>
                      Đánh dấu đã xem
                    </button>
                  </form>

                  <form action={updateContactStatus}>
                    <input type="hidden" name="id" value={selectedItem.id} />
                    <input type="hidden" name="status" value="REPLIED" />
                    <button type="submit" className={styles.actionButton}>
                      Đánh dấu đã phản hồi
                    </button>
                  </form>

                  <form action={updateContactStatus}>
                    <input type="hidden" name="id" value={selectedItem.id} />
                    <input type="hidden" name="status" value="SPAM" />
                    <button
                      type="submit"
                      className={`${styles.actionButton} ${styles.warnButton}`}
                    >
                      Chuyển spam
                    </button>
                  </form>
                </div>
              </div>

              <div className={styles.actionBlock}>
                <h3 className={styles.blockTitle}>Ghi chú nội bộ</h3>

                <form action={saveContactNote} className={styles.noteForm}>
                  <input type="hidden" name="id" value={selectedItem.id} />
                  <textarea
                    name="noteInternal"
                    rows={5}
                    defaultValue={selectedItem.noteInternal || ""}
                    className={styles.textarea}
                    placeholder="Nhập ghi chú nội bộ..."
                  />
                  <button type="submit" className={styles.primaryButton}>
                    Lưu ghi chú
                  </button>
                </form>
              </div>

              <div className={styles.deleteWrap}>
                <form action={deleteContactMessage}>
                  <input type="hidden" name="id" value={selectedItem.id} />
                  <button type="submit" className={styles.deleteButton}>
                    Xóa liên hệ này
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className={styles.emptyDetail}>
              Chọn một liên hệ ở bên trái để xem chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}