import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

export default function PinnedWidget({ pinned = [] }) {
  if (pinned.length === 0) {
    return (
      <EmptyState
        icon="📌"
        title="Nothing pinned yet"
        description="Pin issues, PRs, or repos for quick access."
        action={
          <Link to="/pinned" className="btn-primary">
            Manage pinned
          </Link>
        }
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {pinned.slice(0, 6).map((pin) => (
        <li key={pin.id}>
          <a
            href={pin.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-2 text-sm hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500 dark:hover:bg-slate-700"
          >
            <Badge tone="indigo">{pin.itemType}</Badge>
            <span className="truncate flex-1 text-slate-800 dark:text-slate-100">
              {pin.customLabel || pin.cachedTitle || pin.githubUrl}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
