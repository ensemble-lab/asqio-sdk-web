import { useTickets } from '../../hooks/useTickets';
import type { PaginationParams, Ticket } from '../../types';
import styles from './ThreadList.module.css';

export interface ThreadListProps {
  onSelectTicket: (ticket: Ticket) => void;
  onNewThread?: () => void;
  paginationParams?: PaginationParams;
  className?: string;
}

export function ThreadList({
  onSelectTicket,
  onNewThread,
  paginationParams,
  className,
}: ThreadListProps) {
  const { tickets, meta, loading, error, fetchPage } = useTickets(paginationParams);

  if (loading && tickets.length === 0) {
    return <div className={`${styles.container} ${className ?? ''}`}><div className={styles.loading}>読み込み中...</div></div>;
  }

  if (error) {
    return <div className={`${styles.container} ${className ?? ''}`}><div className={styles.error}>エラーが発生しました</div></div>;
  }

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>お問い合わせ</h2>
        {onNewThread && (
          <button className={styles.newButton} onClick={onNewThread}>
            新規作成
          </button>
        )}
      </div>
      {tickets.length === 0 ? (
        <div className={styles.empty}>問い合わせはありません</div>
      ) : (
        <ul className={styles.list}>
          {tickets.map((ticket) => (
            <li key={ticket.id} className={styles.item}>
              <button
                className={styles.itemButton}
                onClick={() => onSelectTicket(ticket)}
              >
                <div className={styles.itemHeader}>
                  <span className={styles.itemTitle}>
                    {ticket.title || '(無題)'}
                  </span>
                  {ticket.unread && <span className={styles.unreadBadge} />}
                </div>
                <div className={styles.itemDate}>
                  {new Date(ticket.updated_at).toLocaleDateString()}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {meta && meta.total_pages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            disabled={meta.current_page <= 1}
            onClick={() => fetchPage(meta.current_page - 1)}
          >
            前へ
          </button>
          <span className={styles.pageInfo}>
            {meta.current_page} / {meta.total_pages}
          </span>
          <button
            className={styles.pageButton}
            disabled={meta.current_page >= meta.total_pages}
            onClick={() => fetchPage(meta.current_page + 1)}
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}
