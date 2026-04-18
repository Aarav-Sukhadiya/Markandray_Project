import { useMemo } from 'react';
import { repoFullName } from '../../utils/githubHelpers';

export default function PRFilters({ prs = [], repo, onRepoChange, status, onStatusChange, search, onSearchChange }) {
  const repos = useMemo(() => {
    const set = new Set();
    prs.forEach((p) => {
      const r = repoFullName(p);
      if (r) set.add(r);
    });
    return Array.from(set).sort();
  }, [prs]);

  return (
    <div className="card grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
      <div>
        <label className="label" htmlFor="pr-search">Search</label>
        <input
          id="pr-search"
          type="text"
          className="input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Title or repo…"
        />
      </div>
      <div>
        <label className="label" htmlFor="pr-repo">Repo</label>
        <select id="pr-repo" className="input" value={repo} onChange={(e) => onRepoChange(e.target.value)}>
          <option value="">All repos</option>
          {repos.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="pr-status">Status</label>
        <select id="pr-status" className="input" value={status} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="merged">Merged</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>
  );
}
