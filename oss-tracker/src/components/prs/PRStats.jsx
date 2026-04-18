import { useMemo } from 'react';
import { prState } from '../../utils/githubHelpers';
import { toDate } from '../../utils/dateHelpers';

function formatHours(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '—';
  const hours = ms / (1000 * 60 * 60);
  if (hours < 48) return `${Math.round(hours)}h`;
  const days = hours / 24;
  return `${days.toFixed(1)}d`;
}

export default function PRStats({ prs = [] }) {
  const { merged, closedCount, open, mergeRate, avgTimeToMerge } = useMemo(() => {
    const merged = prs.filter((p) => prState(p) === 'merged');
    const closedCount = prs.filter((p) => prState(p) === 'closed').length;
    const open = prs.filter((p) => prState(p) === 'open').length;
    const total = prs.length;
    const mergeRate = total > 0 ? Math.round((merged.length / total) * 100) : 0;

    let totalMs = 0;
    let sampleCount = 0;
    merged.forEach((p) => {
      const created = toDate(p.created_at);
      const mergedAt = toDate(p.pull_request?.merged_at ?? p.closed_at);
      if (created && mergedAt) {
        totalMs += mergedAt.getTime() - created.getTime();
        sampleCount += 1;
      }
    });
    const avgTimeToMerge = sampleCount > 0 ? totalMs / sampleCount : 0;

    return {
      merged: merged.length,
      closedCount,
      open,
      mergeRate,
      avgTimeToMerge,
    };
  }, [prs]);

  const cards = [
    { label: 'Open', value: open, tone: 'text-emerald-600' },
    { label: 'Merged', value: merged, tone: 'text-purple-600' },
    { label: 'Closed', value: closedCount, tone: 'text-rose-600' },
    { label: 'Merge rate', value: `${mergeRate}%`, tone: 'text-indigo-600' },
    { label: 'Avg time to merge', value: formatHours(avgTimeToMerge), tone: 'text-slate-600 dark:text-slate-300' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="card p-3 text-center">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{card.label}</p>
          <p className={`mt-1 text-xl font-semibold ${card.tone}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
