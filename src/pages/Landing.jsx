import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const FEATURES = [
  {
    icon: '🎯',
    title: 'Goals with live progress',
    body: 'Set PR/issue/review targets and watch progress update from GitHub in real time.',
  },
  {
    icon: '🐛',
    title: 'Assigned issues in one feed',
    body: 'Every issue across every repo, with filters, search, and your private notes.',
  },
  {
    icon: '👀',
    title: 'Never miss a review',
    body: 'Stale review requests highlighted so they never rot.',
  },
  {
    icon: '📝',
    title: 'Private notes per issue/PR',
    body: 'Annotate anything on GitHub with markdown notes that only you see.',
  },
  {
    icon: '📌',
    title: 'Pin your watchlist',
    body: 'Keep your important items one click away in the sidebar.',
  },
  {
    icon: '🔥',
    title: 'Contribution heatmap',
    body: 'See your 365-day momentum at a glance.',
  },
];

export default function Landing() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">◆</span>
          <span className="text-base font-semibold">OSS Tracker</span>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <a href="#features" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Features</a>
          {user ? (
            <Link to="/dashboard" className="btn-primary">Open dashboard</Link>
          ) : (
            <Link to="/login" className="btn-primary">Sign in</Link>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <section className="py-16 text-center">
          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
            For open source contributors
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Your command center for<br />open source work.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Track issues, PRs, review requests, personal goals, and notes — powered by live data from the GitHub API. Stop juggling tabs and Notion docs.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/login" className="btn-primary">Sign in with GitHub</Link>
            <a href="#features" className="btn-secondary">See features</a>
          </div>
        </section>

        <section id="features" className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="card p-5">
              <div className="text-2xl" aria-hidden="true">{f.icon}</div>
              <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{f.body}</p>
            </article>
          ))}
        </section>

        <section className="card mt-16 p-8 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Data you own. Data GitHub owns.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Issues, PRs, reviews, and events stay on GitHub — we fetch them on demand and never duplicate them.
            Your goals, notes, and pins live in your own Firestore — private by default.
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Built for the React end-term project · Powered by React + Vite + Tailwind + Firebase + GitHub API
      </footer>
    </div>
  );
}
