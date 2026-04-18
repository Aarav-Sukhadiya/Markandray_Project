import Badge from '../ui/Badge';
import { relativeTime } from '../../utils/dateHelpers';
import { repoFullName, prState } from '../../utils/githubHelpers';

const STATE_TONE = { open: 'emerald', merged: 'purple', closed: 'rose' };

export default function PRCard({ pr }) {
  const state = prState(pr);
  const repo = repoFullName(pr);

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
        <Badge tone={STATE_TONE[state] ?? 'slate'}>{state}</Badge>
      </div>
      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">{pr.title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Opened {relativeTime(pr.created_at)} · Updated {relativeTime(pr.updated_at)}
      </p>
    </a>
  );
}
