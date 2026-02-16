import { useState, type KeyboardEvent, type FormEvent } from 'react';
import styles from './MessageInput.module.css';

export interface MessageInputProps {
  onSend: (body: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = 'メッセージを入力...',
  className,
}: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed) return;
      onSend(trimmed);
      setText('');
    }
  };

  return (
    <form
      className={`${styles.container} ${className ?? ''}`}
      onSubmit={handleSubmit}
    >
      <textarea
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
      />
      <button
        className={styles.button}
        type="submit"
        disabled={disabled || !text.trim()}
      >
        送信
      </button>
    </form>
  );
}
