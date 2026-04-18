import { NavLink } from 'react-router-dom';
import { usePinned } from '../../hooks/usePinned';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/issues', label: 'Issues', icon: '🐛' },
  { to: '/prs', label: 'Pull Requests', icon: '🔀' },
  { to: '/reviews', label: 'Reviews', icon: '👀' },
  { to: '/goals', label: 'Goals', icon: '🎯' },
  { to: '/notes', label: 'Notes', icon: '📝' },
  { to: '/pinned', label: 'Pinned', icon: '📌' },
];

export default function Sidebar({ open, onClose }) {
  const { pinned } = usePinned();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-30 h-full w-64 transform border-r border-slate-200 bg-white p-4 transition-transform dark:border-slate-700 dark:bg-slate-900 md:sticky md:top-16 md:z-10 md:h-[calc(100vh-4rem)] md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <nav className="flex flex-col gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <span aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {pinned.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Pinned
            </p>
            <ul className="flex flex-col gap-1">
              {pinned.slice(0, 8).map((pin) => (
                <li key={pin.id}>
                  <a
                    href={pin.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate rounded-md px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    title={pin.cachedTitle}
                  >
                    📌 {pin.customLabel || pin.cachedTitle || pin.githubUrl}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </>
  );
}
