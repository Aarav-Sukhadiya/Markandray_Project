import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import IssueDetailModal from '../components/issues/IssueDetailModal';
import { githubFetch } from '../services/github';
import { useGitHubContext } from '../hooks/useGitHub';

export default function IssueDetail() {
  const { owner, repo, number } = useParams();
  const { token, updateRateLimit } = useGitHubContext();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    if (!token || !owner || !repo || !number) return;
    setLoading(true);
    setError(null);
    githubFetch(token, `/repos/${owner}/${repo}/issues/${number}`, { onRateLimit: updateRateLimit })
      .then(setIssue)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [token, owner, repo, number, updateRateLimit]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            {owner}/{repo} #{number}
          </h1>
        </div>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </header>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} onRetry={load} />}
      {issue && (
        <IssueDetailModal open={true} onClose={() => navigate(-1)} issue={issue} />
      )}
    </div>
  );
}
