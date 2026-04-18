import { useMemo } from 'react';
import ReviewCard from './ReviewCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import EmptyState from '../ui/EmptyState';
import { toDate } from '../../utils/dateHelpers';

export default function ReviewList({ prs = [], loading, error, onRetry }) {
  const sorted = useMemo(() => {
    return [...prs].sort((a, b) => {
      const da = toDate(a.created_at)?.getTime() ?? 0;
      const db = toDate(b.created_at)?.getTime() ?? 0;
      return da - db;
    });
  }, [prs]);

  if (loading) return <LoadingSpinner label="Loading review queue…" />;
  if (error) return <ErrorMessage error={error} onRetry={onRetry} />;
  if (sorted.length === 0) {
    return <EmptyState icon="✅" title="You're all caught up" description="No reviews requested." />;
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {sorted.map((pr) => (
        <ReviewCard key={pr.id} pr={pr} />
      ))}
    </div>
  );
}
