import Badge from '../ui/Badge';
import Button from '../ui/Button';
import GoalProgressBar from './GoalProgressBar';
import { formatDate } from '../../utils/dateHelpers';

const TYPE_LABELS = {
  prs_merged: 'PRs merged',
  issues_closed: 'Issues closed',
  reviews_given: 'Reviews given',
  custom: 'Custom',
};

const STATUS_TONE = {
  active: 'indigo',
  completed: 'emerald',
  expired: 'rose',
};

export default function GoalCard({ goal, githubData, onEdit, onDelete }) {
  return (
    <article className="card flex flex-col gap-3 p-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="slate">{TYPE_LABELS[goal.type] ?? goal.type}</Badge>
            <Badge tone={STATUS_TONE[goal.status] ?? 'slate'}>{goal.status ?? 'active'}</Badge>
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{goal.title}</h3>
          {goal.description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{goal.description}</p>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" onClick={() => onEdit?.(goal)}>Edit</Button>
          <Button variant="ghost" onClick={() => onDelete?.(goal)}>Delete</Button>
        </div>
      </header>

      <GoalProgressBar goal={goal} githubData={githubData} />

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {formatDate(goal.startDate)} → {formatDate(goal.endDate)}
      </p>
    </article>
  );
}
