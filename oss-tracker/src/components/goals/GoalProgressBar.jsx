import { useMemo } from 'react';
import { computeGoalProgress } from '../../utils/goalProgressCalculator';

export default function GoalProgressBar({ goal, githubData }) {
  const progress = useMemo(() => computeGoalProgress(goal, githubData), [goal, githubData]);
  const color =
    progress.status === 'completed'
      ? 'bg-emerald-500'
      : progress.status === 'expired'
        ? 'bg-rose-500'
        : 'bg-indigo-500';

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>
          {progress.current}/{goal.target}
          {progress.daysLeft !== null && progress.status === 'active' && (
            <span className="ml-2 text-slate-500 dark:text-slate-400">· {progress.daysLeft}d left</span>
          )}
        </span>
        <span className="font-semibold">{progress.percentage}%</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  );
}
