import { useState, useEffect, useCallback } from 'react';

export const useDataLoader = <T = any>(
  loadDataFn: (...params: any[]) => Promise<T>,
  initialParams?: any[],
  deps?: any[]
): {
  loaded?: boolean;
  loading?: boolean;
  data: T;
  error?: Error;
  reload: (...params: any[]) => Promise<void>;
} => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState<any>(undefined);

  const loadData = useCallback(
    async (...params: any[]) => {
      if (loading) {
        return;
      }
      setLoading(true);
      setLoaded(false);
      try {
        const _data = await loadDataFn(...params);
        setData(_data);
      } catch (e) {
        setError(e);
      }

      setLoaded(true);
      setLoading(false);
    },
    [loadDataFn]
  );

  useEffect(() => {
    if (!loading && !loaded && !error) {
      loadData(...(initialParams || []));
    }
  }, [loadData, loading, loaded, error, ...(deps || [])]);

  const reload = (...params: any[]) => loadData(...params);

  return {
    loaded,
    loading,
    data,
    error,
    reload
  };
};
