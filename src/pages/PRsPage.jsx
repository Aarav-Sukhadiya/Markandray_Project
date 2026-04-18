import { useMemo, useState } from 'react';
import PRFilters from '../components/prs/PRFilters';
import PRList from '../components/prs/PRList';
import PRStats from '../components/prs/PRStats';
import Button from '../components/ui/Button';
import { useAuthoredPRs } from '../hooks/useAuthoredPRs';
import { useGitHubContext } from '../hooks/useGitHub';
import { useDebounce } from '../hooks/useDebounce';

export default function PRsPage() {
  const { githubUser } = useGitHubContext();
  const [repo, setRepo] = useState('');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const debouncedSearch = useDebounce(search, 250);

  const { data, loading, error, refetch } = useAuthoredPRs(githubUser?.login, { refreshKey });
  const prs = useMemo(() => data?.items ?? [], [data]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Pull requests</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{prs.length} authored by you</p>
        </div>
        <Button variant="secondary" onClick={() => setRefreshKey((k) => k + 1)}>Refresh</Button>
      </header>

      <PRStats prs={prs} />

      <PRFilters
        prs={prs}
        repo={repo}
        onRepoChange={setRepo}
        status={status}
        onStatusChange={setStatus}
        search={search}
        onSearchChange={setSearch}
      />

      <PRList
        prs={prs}
        loading={loading}
        error={error}
        onRetry={refetch}
        repo={repo}
        status={status}
        search={debouncedSearch}
      />
    </div>
  );
}
