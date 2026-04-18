import { useCallback } from 'react';
import { getReviewQueue } from '../services/github';
import { useGitHub } from './useGitHub';

export function useReviewQueue(username, { refreshKey } = {}) {
  const fetcher = useCallback(
    ({ token, ...opts }) => getReviewQueue(token, username, opts),
    [username],
  );
  return useGitHub(fetcher, { enabled: Boolean(username), refreshKey });
}
