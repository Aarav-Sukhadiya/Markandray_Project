import Badge from '../ui/Badge';
import { relativeTime } from '../../utils/dateHelpers';
import { repoFullName, isPullRequest } from '../../utils/githubHelpers';

export default function IssueCard({ issue, hasNote = false, onOpen }) {
  const repo = repoFullName(issue);
  const stateColor = issue.state === 'open' ? 'emerald' : 'rose';

  return (
    <button
      type="button"
      onClick={() => onOpen?.(issue)}
      className="card flex w-full flex-col gap-2 p-4 text-left transition hover:border-indigo-300 hover:shadow-md dark:hover:border-indigo-500"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-mono">{repo}</span>
        <span>#{issue.number}</span>
        <Badge tone={stateColor}>{issue.state}</Badge>
        {isPullRequest(issue) && <Badge tone="purple">PR</Badge>}
        {hasNote && <Badge tone="amber">📝 note</Badge>}
      </div>
      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
        {issue.title}
      </h3>
      <div className="flex flex-wrap gap-1">
        {(issue.labels ?? []).slice(0, 5).map((label) => (
          <Badge key={label.id ?? label.name} tone="slate">{label.name}</Badge>
        ))}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Updated {relativeTime(issue.updated_at)}
      </p>
    </button>
  );
}
