import { useCallback, useEffect, useState } from 'react';
import { useAsqioClient } from '../context/AsqioContext';
import type { TicketWithMessages } from '../types';

export interface UseTicketResult {
  ticket: TicketWithMessages | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useTicket(ticketId: string): UseTicketResult {
  const client = useAsqioClient();
  const [ticket, setTicket] = useState<TicketWithMessages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTicket = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await client.getTicket(ticketId);
      setTicket(res);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [client, ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  return { ticket, loading, error, refetch: fetchTicket };
}
