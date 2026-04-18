function StatCard({ label, value, tone = 'indigo', hint }) {
  const tones = {
    indigo: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
  };
  return (
    <div className="card p-4">
      <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br text-white ${tones[tone] ?? tones.indigo}`}>
        <span className="text-xs font-bold">■</span>
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value ?? '—'}</p>
      {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

export default function StatsRow({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard label="Open PRs" value={stats.openPRs} tone="purple" />
      <StatCard label="Assigned Issues" value={stats.openIssues} tone="emerald" />
      <StatCard label="Review Requests" value={stats.reviewRequests} tone="amber" />
      <StatCard label="Current Streak" value={stats.streak} hint="days" tone="indigo" />
    </div>
  );
}
