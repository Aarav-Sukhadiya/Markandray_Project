import { useMemo } from 'react';
import { relativeTime } from '../../utils/dateHelpers';
import EmptyState from '../ui/EmptyState';

const TYPE_LABELS = {
  PushEvent: { label: 'Pushed commits', icon: '⬆️' },
  PullRequestEvent: { label: 'PR activity', icon: '🔀' },
  IssuesEvent: { label: 'Issue activity', icon: '🐛' },
  IssueCommentEvent: { label: 'Commented', icon: '💬' },
  PullRequestReviewEvent: { label: 'Reviewed PR', icon: '👀' },
  CreateEvent: { label: 'Created', icon: '✨' },
  WatchEvent: { label: 'Starred', icon: '⭐' },
  ForkEvent: { label: 'Forked', icon: '🍴' },
};

function describeEvent(event) {
  const meta = TYPE_LABELS[event.type] ?? { label: event.type, icon: '•' };
  const repo = event.repo?.name ?? '';
  let detail = '';

  if (event.type === 'PushEvent') {
    const commits = event.payload?.commits?.length ?? 0;
    detail = `${commits} commit${commits === 1 ? '' : 's'}`;
  } else if (event.type === 'PullRequestEvent') {
    const action = event.payload?.action;
    const title = event.payload?.pull_request?.title;
    detail = title ? `${action ?? ''} — ${title}` : action ?? '';
  } else if (event.type === 'IssuesEvent') {
    const action = event.payload?.action;
    const title = event.payload?.issue?.title;
    detail = title ? `${action ?? ''} — ${title}` : action ?? '';
  } else if (event.type === 'IssueCommentEvent') {
    detail = event.payload?.issue?.title ?? '';
  } else if (event.type === 'PullRequestReviewEvent') {
    detail = event.payload?.pull_request?.title ?? '';
  } else if (event.type === 'CreateEvent') {
    detail = event.payload?.ref_type ?? '';
  }

  return { ...meta, repo, detail };
}

export default function RecentActivityFeed({ events = [], loading }) {
  const items = useMemo(() => events.slice(0, 10).map((e) => ({ ...e, ...describeEvent(e) })), [events]);

  if (!loading && items.length === 0) {
    return <EmptyState icon="🌱" title="No recent activity" description="Push some commits, open an issue, or review a PR to see activity here." />;
  }

  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
      {items.map((event) => (
        <li key={event.id} className="flex gap-3 py-3">
          <span className="text-base" aria-hidden="true">{event.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-slate-800 dark:text-slate-100">
              <span className="font-medium">{event.label}</span>
              {event.detail && <span className="text-slate-500 dark:text-slate-400"> · {event.detail}</span>}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              {event.repo} · {relativeTime(event.created_at)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
