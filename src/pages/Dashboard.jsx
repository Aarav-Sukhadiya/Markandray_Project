import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import StatsRow from '../components/dashboard/StatsRow';
import ActiveGoalsWidget from '../components/dashboard/ActiveGoalsWidget';
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed';
import PinnedWidget from '../components/dashboard/PinnedWidget';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useAssignedIssues } from '../hooks/useAssignedIssues';
import { useAuthoredPRs } from '../hooks/useAuthoredPRs';
import { useReviewQueue } from '../hooks/useReviewQueue';
import { useUserEvents } from '../hooks/useUserEvents';
import { useGoals } from '../hooks/useGoals';
import { usePinned } from '../hooks/usePinned';
import { useGitHubContext } from '../hooks/useGitHub';
import { prState } from '../utils/githubHelpers';
import { relativeTime } from '../utils/dateHelpers';

const ContributionHeatmap = lazy(() => import('../components/charts/ContributionHeatmap'));

function computeStreak(events = []) {
  if (!events.length) return 0;
  const days = new Set();
  events.forEach((e) => {
    const d = new Date(e.created_at);
    if (!Number.isNaN(d.getTime())) {
      days.add(d.toISOString().slice(0, 10));
    }
  });
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (streak === 0) {
      cursor.setDate(cursor.getDate() - 1);
      const key2 = cursor.toISOString().slice(0, 10);
      if (days.has(key2)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return streak;
}

export default function Dashboard() {
  const { githubUser } = useGitHubContext();
  const username = githubUser?.login;
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const issuesQ = useAssignedIssues({ refreshKey });
  const prsQ = useAuthoredPRs(username, { refreshKey });
  const reviewsQ = useReviewQueue(username, { refreshKey });
  const eventsQ = useUserEvents(username, { refreshKey });
  const { goals } = useGoals();
  const { pinned } = usePinned();

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setLastRefreshed(new Date());
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setRefreshKey((k) => k + 1);
      setLastRefreshed(new Date());
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const prs = prsQ.data?.items ?? [];
  const reviews = reviewsQ.data?.items ?? [];
  const issues = Array.isArray(issuesQ.data) ? issuesQ.data : [];
  const events = Array.isArray(eventsQ.data) ? eventsQ.data : [];

  const stats = useMemo(
    () => ({
      openPRs: prs.filter((p) => prState(p) === 'open').length,
      openIssues: issues.length,
      reviewRequests: reviews.length,
      streak: computeStreak(events),
    }),
    [prs, issues, reviews, events],
  );

  const githubData = useMemo(
    () => ({ authoredPRs: prs, assignedIssues: issues }),
    [prs, issues],
  );

  const anyLoading = issuesQ.loading || prsQ.loading || reviewsQ.loading || eventsQ.loading;
  const anyError = issuesQ.error || prsQ.error || reviewsQ.error || eventsQ.error;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Hey{githubUser?.name ? `, ${githubUser.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last refreshed {relativeTime(lastRefreshed)} · auto-refresh every 5 min
          </p>
        </div>
        <Button variant="secondary" onClick={refresh} disabled={anyLoading}>
          {anyLoading ? 'Refreshing…' : 'Refresh'}
        </Button>
      </header>

      <StatsRow stats={stats} />

      {anyError && <ErrorMessage error={anyError} onRetry={refresh} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="card col-span-1 p-5 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Recent activity</h2>
          {eventsQ.loading ? <LoadingSpinner label="Loading activity…" /> : <RecentActivityFeed events={events} />}
        </section>

        <section className="card p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Active goals</h2>
          <ActiveGoalsWidget goals={goals} githubData={githubData} />
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="card col-span-1 p-5 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Contribution heatmap</h2>
          <Suspense fallback={<LoadingSpinner label="Loading heatmap…" />}>
            <ContributionHeatmap events={events} />
          </Suspense>
        </section>
        <section className="card p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Pinned</h2>
          <PinnedWidget pinned={pinned} />
        </section>
      </div>
    </div>
  );
}
