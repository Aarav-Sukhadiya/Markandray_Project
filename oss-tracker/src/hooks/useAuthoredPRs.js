import { useCallback } from 'react';
import { getAuthoredPRs } from '../services/github';
import { useGitHub } from './useGitHub';

export function useAuthoredPRs(username, { refreshKey } = {}) {
  const fetcher = useCallback(
    ({ token, ...opts }) => getAuthoredPRs(token, username, opts),
    [username],
  );
  return useGitHub(fetcher, { enabled: Boolean(username), refreshKey });
}
