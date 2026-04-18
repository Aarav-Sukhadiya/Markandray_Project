import { useCallback } from 'react';
import { getAssignedIssues } from '../services/github';
import { useGitHub } from './useGitHub';

export function useAssignedIssues({ refreshKey } = {}) {
  const fetcher = useCallback(
    ({ token, ...opts }) => getAssignedIssues(token, opts),
    [],
  );
  return useGitHub(fetcher, { refreshKey });
}
