export function parseRepoFromUrl(url) {
  if (!url) return { owner: '', repo: '' };
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    return { owner: parts[0] ?? '', repo: parts[1] ?? '' };
  } catch {
    return { owner: '', repo: '' };
  }
}

export function repoFullName(issueOrPr) {
  if (!issueOrPr) return '';
  if (issueOrPr.repository?.full_name) return issueOrPr.repository.full_name;
  if (issueOrPr.repository_url) {
    const m = /repos\/([^/]+\/[^/]+)$/.exec(issueOrPr.repository_url);
    if (m) return m[1];
  }
  if (issueOrPr.html_url) {
    const { owner, repo } = parseRepoFromUrl(issueOrPr.html_url);
    if (owner && repo) return `${owner}/${repo}`;
  }
  return '';
}

export function isPullRequest(issue) {
  return Boolean(issue?.pull_request);
}

export function prState(pr) {
  if (!pr) return 'unknown';
  if (pr.pull_request?.merged_at || pr.merged_at) return 'merged';
  if (pr.state === 'closed') return 'closed';
  return 'open';
}

export function itemIdentity(item) {
  const repo = repoFullName(item);
  return `${repo}#${item?.number ?? ''}`;
}

export function ghItemType(item) {
  return isPullRequest(item) ? 'pr' : 'issue';
}
