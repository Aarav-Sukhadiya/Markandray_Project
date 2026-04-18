import { useMemo } from 'react';
import IssueCard from './IssueCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import ErrorMessage from '../ui/ErrorMessage';
import { repoFullName } from '../../utils/githubHelpers';

export default function IssueList({
  issues = [],
  loading,
  error,
  onRetry,
  onOpen,
  search,
  repo,
  state,
  label,
  noteKeys = new Set(),
}) {
  const filtered = useMemo(() => {
    const q = (search ?? '').toLowerCase().trim();
    return issues.filter((issue) => {
      const repoName = repoFullName(issue);
      if (repo && repoName !== repo) return false;
      if (state && state !== 'all' && issue.state !== state) return false;
      if (label && !(issue.labels ?? []).some((l) => l.name === label)) return false;
      if (q) {
        const haystack = `${issue.title} ${repoName}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [issues, search, repo, state, label]);

  if (loading) return <LoadingSpinner label="Loading issues…" />;
  if (error) return <ErrorMessage error={error} onRetry={onRetry} />;
  if (filtered.length === 0) {
    return (
      <EmptyState
        icon="🎉"
        title="No issues match your filters"
        description="Try clearing filters or browse new good-first-issues on GitHub."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {filtered.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          hasNote={noteKeys.has(issue.html_url)}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
