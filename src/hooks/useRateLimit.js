import { useGitHubContext } from './useGitHub';

export function useRateLimit() {
  const { rateLimit } = useGitHubContext();
  const { remaining, limit, reset } = rateLimit;
  const isLow = typeof remaining === 'number' && remaining < 100;
  const isExhausted = remaining === 0;
  const resetDate = reset ? new Date(reset * 1000) : null;
  return { remaining, limit, reset, resetDate, isLow, isExhausted };
}
