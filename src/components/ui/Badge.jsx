const TONES = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200',
  slate: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100',
};

export default function Badge({ tone = 'default', children, className = '' }) {
  const toneClass = TONES[tone] ?? TONES.default;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${toneClass} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
