import { useEffect } from 'react';
import { useTicket } from '../../hooks/useTicket';
import { useMarkAsRead } from '../../hooks/useMarkAsRead';
import { useSendMessage } from '../../hooks/useSendMessage';
import { MessageBubble } from '../MessageBubble/MessageBubble';
import { MessageInput } from '../MessageInput/MessageInput';
import styles from './ThreadDetail.module.css';

export interface ThreadDetailProps {
  ticketId: string;
  onBack?: () => void;
  className?: string;
}

export function ThreadDetail({ ticketId, onBack, className }: ThreadDetailProps) {
  const { ticket, loading, error, refetch } = useTicket(ticketId);
  const { markAsRead } = useMarkAsRead();
  const { send, loading: sending } = useSendMessage();

  useEffect(() => {
    markAsRead(ticketId).catch(() => {});
  }, [markAsRead, ticketId]);

  const handleSend = async (body: string) => {
    await send(ticketId, body);
    await refetch();
  };

  if (loading && !ticket) {
    return <div className={`${styles.container} ${className ?? ''}`}><div className={styles.loading}>読み込み中...</div></div>;
  }

  if (error) {
    return <div className={`${styles.container} ${className ?? ''}`}><div className={styles.error}>エラーが発生しました</div></div>;
  }

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            ← 戻る
          </button>
        )}
        <h2 className={styles.title}>{ticket?.title || '(無題)'}</h2>
      </div>
      <div className={styles.messages}>
        {ticket?.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
      <MessageInput onSend={handleSend} disabled={sending} />
    </div>
  );
}
