import { useMemo } from 'react';

export default function IssueFilters({
  search,
  onSearchChange,
  repo,
  onRepoChange,
  state,
  onStateChange,
  label,
  onLabelChange,
  issues = [],
  searchInputRef,
}) {
  const repos = useMemo(() => {
    const set = new Set();
    issues.forEach((i) => {
      const full = i.repository?.full_name;
      if (full) set.add(full);
    });
    return Array.from(set).sort();
  }, [issues]);

  const labels = useMemo(() => {
    const set = new Set();
    issues.forEach((i) => (i.labels ?? []).forEach((l) => set.add(l.name)));
    return Array.from(set).sort();
  }, [issues]);

  return (
    <div className="card grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label className="label" htmlFor="issue-search">Search</label>
        <input
          id="issue-search"
          ref={searchInputRef}
          type="text"
          className="input"
          placeholder="Search title or repo…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="issue-repo">Repo</label>
        <select
          id="issue-repo"
          className="input"
          value={repo}
          onChange={(e) => onRepoChange(e.target.value)}
        >
          <option value="">All repos</option>
          {repos.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="issue-state">State</label>
        <select
          id="issue-state"
          className="input"
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="issue-label">Label</label>
        <select
          id="issue-label"
          className="input"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
        >
          <option value="">All labels</option>
          {labels.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
