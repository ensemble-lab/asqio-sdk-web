import { useCallback, useState } from 'react';
import { useAsqioClient } from '../context/AsqioContext';
import type { CreateTicketParams, Ticket } from '../types';

export interface UseCreateTicketResult {
  create: (params: CreateTicketParams) => Promise<Ticket>;
  loading: boolean;
  error: Error | null;
}

export function useCreateTicket(): UseCreateTicketResult {
  const client = useAsqioClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (params: CreateTicketParams): Promise<Ticket> => {
      setLoading(true);
      setError(null);
      try {
        const ticket = await client.createTicket(params);
        return ticket;
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

  return { create, loading, error };
}
