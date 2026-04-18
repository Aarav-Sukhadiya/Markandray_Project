import { useCallback } from 'react';
import { getUserEvents } from '../services/github';
import { useGitHub } from './useGitHub';

export function useUserEvents(username, { refreshKey } = {}) {
  const fetcher = useCallback(
    ({ token, ...opts }) => getUserEvents(token, username, opts),
    [username],
  );
  return useGitHub(fetcher, { enabled: Boolean(username), refreshKey });
}
