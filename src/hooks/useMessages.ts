import { useCallback, useEffect, useState } from 'react';
import { useAsqioClient } from '../context/AsqioContext';
import type { Message, PaginationMeta, PaginationParams } from '../types';

export interface UseMessagesResult {
  messages: Message[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  fetchPage: (page: number) => Promise<void>;
}

export function useMessages(ticketId: string, params?: PaginationParams): UseMessagesResult {
  const client = useAsqioClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentParams, setCurrentParams] = useState(params);

  const fetchMessages = useCallback(
    async (p?: PaginationParams) => {
      setLoading(true);
      setError(null);
      try {
        const res = await client.getMessages(ticketId, p);
        setMessages(res.messages);
        setMeta(res.meta);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setLoading(false);
      }
    },
    [client, ticketId],
  );

  useEffect(() => {
    fetchMessages(currentParams);
  }, [fetchMessages, currentParams]);

  const refetch = useCallback(async () => {
    await fetchMessages(currentParams);
  }, [fetchMessages, currentParams]);

  const fetchPage = useCallback(
    async (page: number) => {
      const newParams = { ...currentParams, page };
      setCurrentParams(newParams);
      await fetchMessages(newParams);
    },
    [currentParams, fetchMessages],
  );

  return { messages, meta, loading, error, refetch, fetchPage };
}
