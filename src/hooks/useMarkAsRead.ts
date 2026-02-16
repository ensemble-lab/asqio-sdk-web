import { useCallback, useState } from 'react';
import { useAsqioClient } from '../context/AsqioContext';

export interface UseMarkAsReadResult {
  markAsRead: (ticketId: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export function useMarkAsRead(): UseMarkAsReadResult {
  const client = useAsqioClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const markAsRead = useCallback(
    async (ticketId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await client.markAsRead(ticketId);
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

  return { markAsRead, loading, error };
}
