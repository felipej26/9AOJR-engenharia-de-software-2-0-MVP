import { useCallback, useEffect, useRef, useState } from 'react';
import { parseApiError } from '../utils/parse-api-error';

/**
 * Carrega um recurso assíncrono e expõe estado + reload.
 * @param {() => Promise<unknown>} fetcher
 * @param {unknown[]} [deps]
 */
export function useAsyncResource(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const seqRef = useRef(0);

  const reload = useCallback(async () => {
    const seq = ++seqRef.current;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      if (seq !== seqRef.current) return;
      setData(result);
    } catch (err) {
      if (seq !== seqRef.current) return;
      setError(parseApiError(err).message);
    } finally {
      if (seq === seqRef.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps vêm do chamador para identificar o recurso
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}
