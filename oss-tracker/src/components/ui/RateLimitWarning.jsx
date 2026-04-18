import { useRateLimit } from '../../hooks/useRateLimit';

export default function RateLimitWarning() {
  const { remaining, limit, resetDate, isLow, isExhausted } = useRateLimit();
  if (!isLow || remaining === null) return null;

  const tone = isExhausted
    ? 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200'
    : 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200';

  return (
    <div className={`border-b px-4 py-2 text-xs ${tone}`} role="status">
      <span className="font-semibold">GitHub rate limit:</span>{' '}
      {remaining}/{limit ?? '?'} remaining.{' '}
      {resetDate && (
        <span>
          Resets at {resetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
        </span>
      )}
    </div>
  );
}
