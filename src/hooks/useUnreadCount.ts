import { useCallback, useEffect, useRef, useState } from 'react';
import { useAsqioClient } from '../context/AsqioContext';

export interface UseUnreadCountOptions {
  pollInterval?: number;
}

export interface UseUnreadCountResult {
  count: number;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUnreadCount(options?: UseUnreadCountOptions): UseUnreadCountResult {
  const client = useAsqioClient();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const c = await client.getUnreadCount();
      setCount(c);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  useEffect(() => {
    const interval = options?.pollInterval;
    if (interval && interval > 0) {
      intervalRef.current = setInterval(fetchCount, interval);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [fetchCount, options?.pollInterval]);

  return { count, loading, error, refetch: fetchCount };
}
