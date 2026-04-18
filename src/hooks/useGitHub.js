import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GitHubContext } from '../context/GitHubContext';

export function useGitHubContext() {
  const ctx = useContext(GitHubContext);
  if (!ctx) throw new Error('useGitHubContext must be used inside GitHubProvider');
  return ctx;
}

export function useGitHub(fetcher, { enabled = true, refreshKey = 0 } = {}) {
  const { token, updateRateLimit } = useGitHubContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const run = useCallback(
    async ({ skipCache = false } = {}) => {
      if (!fetcher) return;
      if (!token) {
        setData(null);
        return;
      }

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const result = await fetcher({
          token,
          onRateLimit: updateRateLimit,
          signal: controller.signal,
          skipCache,
        });
        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [fetcher, token, updateRateLimit],
  );

  useEffect(() => {
    if (!enabled) return undefined;
    run();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, token, enabled, refreshKey]);

  const refetch = useCallback(() => run({ skipCache: true }), [run]);

  return { data, loading, error, refetch };
}
