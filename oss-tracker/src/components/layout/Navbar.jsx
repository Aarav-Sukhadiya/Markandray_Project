import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGitHubContext } from '../../hooks/useGitHub';
import Logout from '../auth/Logout';

const MAIN_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/issues', label: 'Issues' },
  { to: '/prs', label: 'PRs' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/goals', label: 'Goals' },
  { to: '/notes', label: 'Notes' },
  { to: '/pinned', label: 'Pinned' },
];

export default function Navbar({ onToggleSidebar }) {
  const { user } = useAuth();
  const { githubUser } = useGitHubContext();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle navigation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            ◆
          </span>
          <span className="text-base font-semibold text-slate-900 dark:text-slate-100">OSS Tracker</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {MAIN_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {user && (
            <Link to="/profile" className="flex items-center gap-2">
              <img
                src={user.photoURL || githubUser?.avatar_url || 'https://avatars.githubusercontent.com/u/9919?v=4'}
                alt={user.displayName || 'User avatar'}
                className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700"
              />
              <span className="hidden text-sm font-medium text-slate-700 sm:inline dark:text-slate-200">
                {githubUser?.login ?? user.displayName ?? 'Profile'}
              </span>
            </Link>
          )}
          {user && <Logout />}
        </div>
      </div>
    </header>
  );
}
