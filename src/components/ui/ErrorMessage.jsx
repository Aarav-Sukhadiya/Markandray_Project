import Button from './Button';

export default function ErrorMessage({ error, onRetry, className = '' }) {
  const message =
    typeof error === 'string'
      ? error
      : error?.message ?? 'Something went wrong.';

  return (
    <div
      className={`flex flex-col items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200 ${className}`}
      role="alert"
    >
      <div>
        <p className="font-semibold">Something went wrong</p>
        <p className="mt-1 text-rose-700 dark:text-rose-300">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
