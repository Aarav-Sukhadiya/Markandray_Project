import { Link, Navigate } from 'react-router-dom';
import GitHubLoginButton from '../components/auth/GitHubLoginButton';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <div className="card w-full max-w-md p-8">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">◆</span>
          <span className="text-base font-semibold text-slate-900 dark:text-white">OSS Tracker</span>
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Sign in with GitHub to see your personal contribution dashboard.
        </p>
        <div className="mt-6">
          <GitHubLoginButton />
        </div>
        <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
          We request <code>read:user</code>, <code>repo</code>, and <code>read:org</code> scopes to read your GitHub activity. The access token lives only in memory for the session — we never persist it.
        </p>
      </div>
    </div>
  );
}
