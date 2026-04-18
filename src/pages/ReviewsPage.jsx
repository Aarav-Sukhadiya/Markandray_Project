import { useMemo, useState } from 'react';
import ReviewList from '../components/reviews/ReviewList';
import Button from '../components/ui/Button';
import { useReviewQueue } from '../hooks/useReviewQueue';
import { useGitHubContext } from '../hooks/useGitHub';

export default function ReviewsPage() {
  const { githubUser } = useGitHubContext();
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, loading, error, refetch } = useReviewQueue(githubUser?.login, { refreshKey });
  const prs = useMemo(() => data?.items ?? [], [data]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Review queue</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{prs.length} awaiting your review</p>
        </div>
        <Button variant="secondary" onClick={() => setRefreshKey((k) => k + 1)}>Refresh</Button>
      </header>

      <ReviewList prs={prs} loading={loading} error={error} onRetry={refetch} />
    </div>
  );
}
