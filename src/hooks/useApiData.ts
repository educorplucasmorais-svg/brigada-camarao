import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiDataResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isLive: boolean;
}

/**
 * Generic hook: tries API call first, falls back to mock data if offline.
 */
export function useApiData<T>(
  apiFn: () => Promise<T>,
  fallback: T,
): UseApiDataResult<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const fallbackRef = useRef(fallback);
  const apiFnRef = useRef(apiFn);
  apiFnRef.current = apiFn;
  fallbackRef.current = fallback;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFnRef.current();
      setData(result);
      setIsLive(true);
    } catch (err) {
      setData(fallbackRef.current);
      setIsLive(false);
      setError(err instanceof Error ? err.message : 'API offline — dados demo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData, isLive };
}
