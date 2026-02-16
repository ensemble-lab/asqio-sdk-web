import { useCallback, useState } from 'react';
import { useAsqioClient } from '../context/AsqioContext';
import type { Message } from '../types';

export interface UseSendMessageResult {
  send: (ticketId: string, body: string) => Promise<Message>;
  loading: boolean;
  error: Error | null;
}

export function useSendMessage(): UseSendMessageResult {
  const client = useAsqioClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const send = useCallback(
    async (ticketId: string, body: string): Promise<Message> => {
      setLoading(true);
      setError(null);
      try {
        const message = await client.sendMessage(ticketId, { body });
        return message;
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client],
  );

  return { send, loading, error };
}
