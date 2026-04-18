export default function LoadingSpinner({ label = 'Loading…', className = '' }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 py-8 text-sm text-slate-500 dark:text-slate-400 ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 dark:border-slate-600 dark:border-t-indigo-400" />
      <span>{label}</span>
    </div>
  );
}
