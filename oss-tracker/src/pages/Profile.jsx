import { useAuth } from '../hooks/useAuth';
import { useGitHubContext } from '../hooks/useGitHub';
import Logout from '../components/auth/Logout';
import Badge from '../components/ui/Badge';
import { useRateLimit } from '../hooks/useRateLimit';

export default function Profile() {
  const { user, isConfigured } = useAuth();
  const { githubUser, token } = useGitHubContext();
  const { remaining, limit, resetDate } = useRateLimit();

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Profile</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Account and session details.</p>
      </header>

      <section className="card flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center">
        <img
          src={user?.photoURL || githubUser?.avatar_url || 'https://avatars.githubusercontent.com/u/9919?v=4'}
          alt="avatar"
          className="h-16 w-16 rounded-full border border-slate-200 dark:border-slate-700"
        />
        <div>
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            {githubUser?.name ?? user?.displayName ?? 'GitHub user'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            @{githubUser?.login ?? 'unknown'} · {user?.email ?? 'no email'}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone={isConfigured ? 'emerald' : 'amber'}>
              {isConfigured ? 'Firebase configured' : 'Demo mode (no Firebase)'}
            </Badge>
            <Badge tone={token ? 'emerald' : 'rose'}>
              {token ? 'GitHub token in session' : 'No GitHub token'}
            </Badge>
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          GitHub API rate limit
        </h2>
        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
          {remaining ?? '—'} / {limit ?? '—'}
          <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">remaining this hour</span>
        </p>
        {resetDate && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Resets at {resetDate.toLocaleTimeString()}.
          </p>
        )}
      </section>

      <section className="card flex items-center justify-between p-5">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Sign out</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ends this session and forgets your GitHub token.</p>
        </div>
        <Logout variant="danger" />
      </section>
    </div>
  );
}
