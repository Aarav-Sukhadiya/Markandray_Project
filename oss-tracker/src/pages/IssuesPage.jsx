import { useEffect, useMemo, useRef, useState } from 'react';
import IssueFilters from '../components/issues/IssueFilters';
import IssueList from '../components/issues/IssueList';
import IssueDetailModal from '../components/issues/IssueDetailModal';
import Button from '../components/ui/Button';
import { useAssignedIssues } from '../hooks/useAssignedIssues';
import { useDebounce } from '../hooks/useDebounce';
import { useNotes } from '../hooks/useNotes';

export default function IssuesPage() {
  const [search, setSearch] = useState('');
  const [repo, setRepo] = useState('');
  const [state, setState] = useState('all');
  const [label, setLabel] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState(null);
  const searchInputRef = useRef(null);

  const debouncedSearch = useDebounce(search, 250);
  const { data, loading, error, refetch } = useAssignedIssues({ refreshKey });
  const { notes } = useNotes();

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const issues = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const noteKeys = useMemo(() => new Set(notes.map((n) => n.githubUrl)), [notes]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Assigned issues</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{issues.length} open across your repos</p>
        </div>
        <Button variant="secondary" onClick={() => setRefreshKey((k) => k + 1)}>
          Refresh
        </Button>
      </header>

      <IssueFilters
        search={search}
        onSearchChange={setSearch}
        repo={repo}
        onRepoChange={setRepo}
        state={state}
        onStateChange={setState}
        label={label}
        onLabelChange={setLabel}
        issues={issues}
        searchInputRef={searchInputRef}
      />

      <IssueList
        issues={issues}
        loading={loading}
        error={error}
        onRetry={refetch}
        onOpen={setSelected}
        search={debouncedSearch}
        repo={repo}
        state={state}
        label={label}
        noteKeys={noteKeys}
      />

      <IssueDetailModal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        issue={selected}
      />
    </div>
  );
}
