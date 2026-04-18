import { useMemo } from 'react';
import PRCard from './PRCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import EmptyState from '../ui/EmptyState';
import { prState, repoFullName } from '../../utils/githubHelpers';

const STATE_TITLE = { open: 'Open', merged: 'Merged', closed: 'Closed' };

export default function PRList({ prs = [], loading, error, onRetry, repo, status, search }) {
  const filtered = useMemo(() => {
    const q = (search ?? '').toLowerCase().trim();
    return prs.filter((pr) => {
      if (repo && repoFullName(pr) !== repo) return false;
      if (status && status !== 'all' && prState(pr) !== status) return false;
      if (q) {
        const haystack = `${pr.title} ${repoFullName(pr)}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [prs, repo, status, search]);

  const groups = useMemo(() => {
    const groups = { open: [], merged: [], closed: [] };
    filtered.forEach((pr) => {
      groups[prState(pr)]?.push(pr);
    });
    return groups;
  }, [filtered]);

  if (loading) return <LoadingSpinner label="Loading pull requests…" />;
  if (error) return <ErrorMessage error={error} onRetry={onRetry} />;
  if (filtered.length === 0) {
    return <EmptyState icon="🔀" title="No pull requests" description="Open a PR to see it here." />;
  }

  return (
    <div className="flex flex-col gap-6">
      {['open', 'merged', 'closed'].map((state) => {
        const list = groups[state];
        if (!list || list.length === 0) return null;
        return (
          <section key={state}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {STATE_TITLE[state]} ({list.length})
            </h2>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {list.map((pr) => (
                <PRCard key={pr.id} pr={pr} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
