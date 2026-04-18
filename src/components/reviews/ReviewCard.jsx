import Badge from '../ui/Badge';
import { relativeTime, daysBetween } from '../../utils/dateHelpers';
import { repoFullName } from '../../utils/githubHelpers';

export default function ReviewCard({ pr }) {
  const repo = repoFullName(pr);
  const ageDays = daysBetween(pr.created_at, new Date());
  const isStale = ageDays > 7;

  return (
    <a
      href={pr.html_url}
      target="_blank"
      rel="noreferrer"
      className="card flex flex-col gap-2 p-4 transition hover:border-indigo-300 hover:shadow-md dark:hover:border-indigo-500"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-mono">{repo}</span>
        <span>#{pr.number}</span>
        {isStale && <Badge tone="rose">Stale · {ageDays}d</Badge>}
      </div>
      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">{pr.title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Requested {relativeTime(pr.created_at)} · By {pr.user?.login ?? 'unknown'}
      </p>
    </a>
  );
}
