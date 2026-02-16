import { useCallback, useEffect, useState } from 'react';
import { useAsqioClient } from '../context/AsqioContext';
import type { Ticket, PaginationMeta, PaginationParams } from '../types';

export interface UseTicketsResult {
  tickets: Ticket[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  fetchPage: (page: number) => Promise<void>;
}

export function useTickets(params?: PaginationParams): UseTicketsResult {
  const client = useAsqioClient();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentParams, setCurrentParams] = useState(params);

  const fetchTickets = useCallback(
    async (p?: PaginationParams) => {
      setLoading(true);
      setError(null);
      try {
        const res = await client.getTickets(p);
        setTickets(res.tickets);
        setMeta(res.meta);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setLoading(false);
      }
    },
    [client],
  );

  useEffect(() => {
    fetchTickets(currentParams);
  }, [fetchTickets, currentParams]);

  const refetch = useCallback(async () => {
    await fetchTickets(currentParams);
  }, [fetchTickets, currentParams]);

  const fetchPage = useCallback(
    async (page: number) => {
      const newParams = { ...currentParams, page };
      setCurrentParams(newParams);
      await fetchTickets(newParams);
    },
    [currentParams, fetchTickets],
  );

  return { tickets, meta, loading, error, refetch, fetchPage };
}
