import Badge from '../ui/Badge';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import { relativeTime } from '../../utils/dateHelpers';

export default function PinnedList({ pinned = [], loading, onRemove, onRelabel }) {
  if (loading) return <LoadingSpinner label="Loading pinned items…" />;
  if (pinned.length === 0) {
    return <EmptyState icon="📌" title="Nothing pinned yet" description="Pin issues or PRs to keep them handy." />;
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {pinned.map((pin) => (
        <article key={pin.id} className="card flex flex-col gap-2 p-4">
          <header className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Badge tone="indigo">{pin.itemType}</Badge>
            {pin.cachedRepo && <span className="font-mono">{pin.cachedRepo}</span>}
            <span className="ml-auto">{relativeTime(pin.pinnedAt)}</span>
          </header>
          <a
            href={pin.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate-900 hover:underline dark:text-slate-100"
          >
            {pin.customLabel || pin.cachedTitle || pin.githubUrl}
          </a>
          <div className="mt-1 flex items-center gap-2">
            <Button variant="ghost" onClick={() => onRelabel?.(pin)}>Rename</Button>
            <Button variant="ghost" onClick={() => onRemove?.(pin)}>Unpin</Button>
          </div>
        </article>
      ))}
    </div>
  );
}
