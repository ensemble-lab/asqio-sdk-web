import type { Message } from '../../types';
import styles from './MessageBubble.module.css';

export interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export function MessageBubble({ message, className }: MessageBubbleProps) {
  const isUser = message.sender_type === 'user';
  const time = new Date(message.created_at).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`${styles.bubble} ${isUser ? styles.user : styles.operator} ${className ?? ''}`}
    >
      <div className={styles.body}>{message.body}</div>
      <div className={styles.time}>{time}</div>
    </div>
  );
}
