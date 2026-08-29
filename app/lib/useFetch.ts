"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (showLoading?: boolean) => void;
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[] = []
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const fetchData = useCallback(async (showLoading = false) => {
    // Only trigger skeleton loading on initial load or if explicitly requested
    if (!hasLoadedRef.current || showLoading) {
      setLoading(true);
    }
    setError(null);
    try {
      const result = await fetcherRef.current();
      hasLoadedRef.current = true;
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    hasLoadedRef.current = false;
    void fetchData(true);
  }, [fetchData, depsKey]);

  return { data, loading, error, refetch: fetchData };
}
