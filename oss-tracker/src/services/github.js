const GITHUB_API = 'https://api.github.com';
const CACHE_TTL_MS = 60 * 1000;

const cache = new Map();

class GitHubError extends Error {
  constructor(message, { status, code, rateLimit } = {}) {
    super(message);
    this.name = 'GitHubError';
    this.status = status;
    this.code = code;
    this.rateLimit = rateLimit;
  }
}

function cacheKey(endpoint, token) {
  return `${token ? token.slice(0, 8) : 'anon'}::${endpoint}`;
}

function readCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function writeCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearGitHubCache() {
  cache.clear();
}

export async function githubFetch(
  token,
  endpoint,
  { onRateLimit, skipCache = false, signal } = {},
) {
  if (!token) {
    throw new GitHubError('GitHub access token is required', { code: 'NO_TOKEN' });
  }

  const key = cacheKey(endpoint, token);
  if (!skipCache) {
    const cached = readCache(key);
    if (cached) return cached;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${GITHUB_API}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    signal,
  });

  const remaining = Number(response.headers.get('X-RateLimit-Remaining'));
  const limit = Number(response.headers.get('X-RateLimit-Limit'));
  const reset = Number(response.headers.get('X-RateLimit-Reset'));
  const rateLimit = {
    remaining: Number.isFinite(remaining) ? remaining : null,
    limit: Number.isFinite(limit) ? limit : null,
    reset: Number.isFinite(reset) ? reset : null,
  };

  if (onRateLimit) onRateLimit(rateLimit);

  if (!response.ok) {
    let code = 'UNKNOWN';
    if (response.status === 401) code = 'UNAUTHORIZED';
    else if (response.status === 403) {
      code = rateLimit.remaining === 0 ? 'RATE_LIMITED' : 'FORBIDDEN';
    } else if (response.status === 404) code = 'NOT_FOUND';

    let message = `GitHub API error ${response.status}`;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      // ignore
    }
    throw new GitHubError(message, { status: response.status, code, rateLimit });
  }

  const data = await response.json();
  writeCache(key, data);
  return data;
}

export function getUser(token, opts) {
  return githubFetch(token, '/user', opts);
}

export function getAssignedIssues(token, opts) {
  return githubFetch(
    token,
    '/issues?filter=assigned&state=open&per_page=100',
    opts,
  );
}

export async function getAuthoredPRs(token, username, opts) {
  if (!username) return { items: [] };
  const q = encodeURIComponent(`is:pr author:${username}`);
  return githubFetch(
    token,
    `/search/issues?q=${q}&sort=updated&order=desc&per_page=100`,
    opts,
  );
}

export async function getReviewQueue(token, username, opts) {
  if (!username) return { items: [] };
  const q = encodeURIComponent(`is:pr is:open review-requested:${username}`);
  return githubFetch(
    token,
    `/search/issues?q=${q}&sort=created&order=asc&per_page=100`,
    opts,
  );
}

export function getUserEvents(token, username, opts) {
  if (!username) return [];
  return githubFetch(
    token,
    `/users/${username}/events?per_page=100`,
    opts,
  );
}

export function getUserRepos(token, opts) {
  return githubFetch(
    token,
    '/user/repos?per_page=100&sort=updated',
    opts,
  );
}

export function getRepo(token, owner, repo, opts) {
  return githubFetch(token, `/repos/${owner}/${repo}`, opts);
}

export { GitHubError };
