# OSS Tracker

A personal command center for open source contributors. Sign in with GitHub, see your live issues, pull requests, review requests, and recent activity in one place, and layer on personal data (goals, notes, pinned items) stored in Firestore.

**Live demo:** https://markandray-project.vercel.app

---

## Problem Statement

Open source contributors juggle assigned issues, open PRs, pending review requests, and personal goals across multiple tabs and repos. GitHub's UI is repo-centric; there is no single dashboard that answers *"what should I work on next?"*

OSS Tracker fixes that by combining:
- **Live GitHub data** (REST API) — issues, PRs, reviews, events
- **Personal data** (Firestore) — goals, notes, pinned items
- **A unified dashboard** with filtering, search, and activity visualization

---

## Features

- **GitHub OAuth sign-in** via Firebase Authentication
- **Dashboard** — assigned issues, your open PRs, requested reviews, recent events
- **Search & filter** — debounced search across issues/PRs with state and label filters
- **Goals** — set contribution targets (e.g. "5 PRs this month") with live progress re-derived from GitHub
- **Notes** — per-repo or per-issue notes stored in Firestore
- **Pinned items** — save any issue/PR for quick access
- **Contribution heatmap** — 365-day activity grid built from GitHub events
- **Rate-limit aware** — tracks `X-RateLimit-Remaining`, caches GitHub responses for 60s
- **Lazy-loaded routes** — heavy pages (heatmap, goals, notes) split into separate chunks

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v3 |
| Routing | React Router v7 |
| Auth | Firebase Authentication (GitHub provider) |
| Database | Cloud Firestore |
| Data source | GitHub REST API v3 |
| Dates | date-fns |
| Deployment | Vercel |

---

## React Concepts Used

| Concept | Where |
|---------|-------|
| Functional components + JSX | all of [src/components/](src/components/) |
| Props & composition | [src/components/layout/](src/components/layout/) |
| `useState` / `useEffect` | every page + hook |
| `useMemo` / `useCallback` | [src/context/GitHubContext.jsx](src/context/GitHubContext.jsx) |
| `useRef` | [src/hooks/useDebounce.js](src/hooks/useDebounce.js) |
| Context API | [src/context/AuthContext.jsx](src/context/AuthContext.jsx), [src/context/GitHubContext.jsx](src/context/GitHubContext.jsx) |
| Custom hooks | [src/hooks/](src/hooks/) — useAuth, useGitHub, useGoals, useNotes, usePinned, useDebounce, useRateLimit |
| `React.lazy` + `Suspense` | [src/App.jsx](src/App.jsx) |
| React Router (BrowserRouter, Outlet, Navigate, dynamic params) | [src/App.jsx](src/App.jsx) |
| Conditional rendering & lists | [src/components/dashboard/](src/components/dashboard/) |
| Controlled forms | [src/pages/GoalsPage.jsx](src/pages/GoalsPage.jsx), [src/pages/NotesPage.jsx](src/pages/NotesPage.jsx) |
| Error boundary | [src/components/ui/ErrorBoundary.jsx](src/components/ui/ErrorBoundary.jsx) |

---

## Project Structure

```
src/
  components/
    auth/         GitHub sign-in button, protected route wrapper
    dashboard/    Assigned issues, your PRs, review requests, recent activity
    issues/       Issue list + filters
    prs/          PR list + filters
    reviews/      Review request list
    goals/        Goal card, create form
    notes/        Note editor, note list
    pinned/       Pinned item card
    charts/       Contribution heatmap
    layout/       Nav, sidebar, page shell
    ui/           Button, input, card, error boundary
  context/        AuthContext, GitHubContext
  hooks/          Custom hooks (see table above)
  pages/          LoginPage, DashboardPage, IssuesPage, PRsPage, ReviewsPage,
                  GoalsPage, NotesPage, PinnedPage, RepoPage
  services/       firebase.js, github.js
  utils/          date helpers, filter helpers
App.jsx
main.jsx
index.css
```

---

## Firestore Data Model

```
users/{userId}
  ├── goals/{goalId}       { title, target, metric, dueDate }
  ├── notes/{noteId}       { body, repo, issueNumber, updatedAt }
  ├── pinned/{pinId}       { type, url, title, repo, addedAt }
  └── activity/{eventId}   { type, payload, ts }
```

Goal progress (`current`) is **not** stored — it is re-derived from GitHub on load so it never drifts.

---

## Local Setup

```bash
git clone https://github.com/Aarav-Sukhadiya/Markandray_Project.git
cd Markandray_Project
npm install
npm run dev
```

The Firebase config is hardcoded as a fallback in [src/services/firebase.js](src/services/firebase.js), so the app runs out of the box. To point it at your own Firebase project, copy `.env.local.example` to `.env.local` and fill in your values.

See [instructions.md](instructions.md) (local only) for the full Firebase + GitHub OAuth setup walkthrough.

---

## Deployment (Vercel)

1. Import the GitHub repo into Vercel — framework auto-detects as Vite.
2. Deploy. The included [vercel.json](vercel.json) adds an SPA rewrite so deep links don't 404.
3. In the Firebase Console → Authentication → Settings → **Authorized domains**, add your Vercel domain (e.g. `markandray-project.vercel.app`).
4. In the GitHub OAuth app settings, set the **Authorization callback URL** to the Firebase auth handler: `https://<your-project>.firebaseapp.com/__/auth/handler`.

No redeploy is needed after Firebase console changes — they take effect immediately.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Credits

Built as the end-term project for **Building Web Applications with React** — Batch 2029, Group A.
