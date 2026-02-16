import { useState, type FormEvent } from 'react';
import { useCreateTicket } from '../../hooks/useCreateTicket';
import type { Ticket } from '../../types';
import styles from './NewThreadForm.module.css';

export interface NewThreadFormProps {
  context?: Record<string, unknown>;
  onCreated?: (ticket: Ticket) => void;
  onCancel?: () => void;
  className?: string;
}

export function NewThreadForm({
  context,
  onCreated,
  onCancel,
  className,
}: NewThreadFormProps) {
  const { create, loading, error } = useCreateTicket();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    const ticket = await create({
      message: trimmed,
      title: title.trim() || undefined,
      context,
    });
    onCreated?.(ticket);
  };

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <div className={styles.header}>
        {onCancel && (
          <button className={styles.cancelButton} onClick={onCancel}>
            ← 戻る
          </button>
        )}
        <h2 className={styles.title}>新規お問い合わせ</h2>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="タイトル（任意）"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <textarea
          className={styles.textarea}
          placeholder="お問い合わせ内容を入力してください"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          rows={5}
          required
        />
        {error && <div className={styles.error}>送信に失敗しました</div>}
        <button
          className={styles.submitButton}
          type="submit"
          disabled={loading || !message.trim()}
        >
          {loading ? '送信中...' : '送信'}
        </button>
      </form>
    </div>
  );
}
