# 🔨 BUILD PROMPT — Open Source Contribution Tracker

## Who I Am
I am a freshman CS student (Batch 2029, Group A) building my end-term project for a **"Building Web Applications with React"** course. I need you to help me build this project **step by step**, explaining decisions as we go. I should be able to explain every part of the code in a viva.

---

## 🧰 Tech Stack (Non-Negotiable)

| Layer | Tool |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Language | JavaScript (NOT TypeScript) |
| Styling | Tailwind CSS |
| Auth | Firebase Authentication with **GitHub OAuth provider** |
| User Data DB | Cloud Firestore (for goals, notes, pins, streaks) |
| External API | **GitHub REST API v3** (`https://api.github.com`) |
| Routing | React Router v6 |
| Charts | Recharts (for contribution heatmap + stats) |
| Deployment | Vercel |

**Why this split?** GitHub is the source of truth for issues, PRs, and reviews — we **fetch** those on demand, we never duplicate them in Firestore. Firestore stores only **user-owned data** that GitHub doesn't track: personal goals, private notes on issues, pinned items, and streak history. This separation is important and I need to be able to defend it in viva.

---

## 🎯 The Problem

Serious open source contributors juggle their workflow across **three disconnected surfaces**:

1. **GitHub's native dashboard** — shows issues/PRs but is noisy, not customizable, and has no goal tracking.
2. **Sticky notes / Notion / spreadsheets** — where contributors manually track what they're working on, TODO notes on issues, review queues.
3. **Nothing** — they just forget about issues they claimed, PRs rot waiting for review, and they lose momentum.

There is **no single tool that combines GitHub's live data with personal tracking**: goals ("10 PRs merged this month"), private notes on specific issues ("need to ask maintainer about X"), pinned watchlists, and streak tracking.

This app solves that. It's a personal command center for open source contributions — powered by the GitHub API for live data, backed by Firestore for private user data.

---

## 👥 Target Users

1. **Student contributors** — participating in GSoC, Hacktoberfest, LFX Mentorship, or just building a portfolio.
2. **Active maintainers** — tracking review queues and their own authored PRs across many repos.
3. **Career-building devs** — setting monthly/weekly contribution goals and tracking streaks.

---

## ✨ Core Features

### 1. GitHub OAuth Authentication
- Firebase Auth with **GitHub provider only** (no email/password — the whole app requires a GitHub identity).
- On first login, capture the GitHub access token (scopes: `read:user`, `repo`, `read:org`) and store it in memory via Context (NOT in localStorage — token lives for the session).
- Create/update the user's Firestore profile document on each login.
- **Protected Routes**: Dashboard, Issues, PRs, Reviews, Goals, Notes, Pinned — all require auth.
- **Public Routes**: Landing Page, Login.
- Global auth + GitHub token state via **AuthContext** using React Context API.

### 2. Dashboard (Main Screen)
Live overview fetched from GitHub on mount:
- **Stats row**: Open PRs authored, Open issues assigned, Pending review requests, Current streak (days).
- **Active Goals widget**: progress bars for each active goal.
- **Recent Activity feed**: last 10 events from the GitHub Events API.
- **Pinned Items widget**: issues/PRs/repos the user pinned.
- All data refreshes on a manual "Refresh" button + auto-refresh every 5 minutes (via `useEffect` + `setInterval`).

### 3. Issues Tracker — Read from GitHub + Notes CRUD in Firestore
- List of all issues **assigned to the current user** across all their repos (GitHub: `GET /issues?filter=assigned`).
- Filters: repo, state (open/closed), label, search text.
- Each issue row shows: repo, title, labels, age, linked PR (if any), and a "Notes" indicator if the user has a Firestore note on it.
- Click → Issue Detail Modal → opens GitHub in new tab + shows your private Firestore notes for that issue with Add/Edit/Delete.

### 4. Pull Requests Tracker — Read from GitHub
- List of PRs **authored by the current user** (GitHub: `GET /search/issues?q=is:pr+author:{username}`).
- Group by status: Open / Merged / Closed.
- Stats: merge rate, average time to merge (computed from `created_at` and `merged_at` via `useMemo`).
- Filters: repo, status, date range.

### 5. Review Queue — Read from GitHub
- List of PRs where the user is a **requested reviewer** (GitHub: `GET /search/issues?q=is:pr+is:open+review-requested:{username}`).
- Sorted by age (oldest first — prioritize stale reviews).
- Each row has a "Review on GitHub" link.

### 6. Goals System — Full CRUD in Firestore
Goals are the primary Firestore CRUD entity.
- Create a goal: title, type (`prs_merged`, `issues_closed`, `reviews_given`, `custom`), target number, deadline.
- Read: list of active, completed, expired goals with live progress bars.
- Progress is **computed** by querying GitHub (e.g., PRs merged between `startDate` and now) — not stored, re-derived on mount.
- Update: edit target, deadline, title.
- Delete: confirmation modal.

### 7. Notes System — Full CRUD in Firestore
Notes are the secondary Firestore CRUD entity — personal annotations on GitHub issues/PRs.
- Add a note while viewing an issue/PR (rich textarea with markdown support).
- Tag notes (`blocked`, `idea`, `ask-maintainer`, custom tags).
- View all notes on a dedicated `/notes` page with tag filtering.
- Edit / delete from the notes page or the issue detail modal.

### 8. Pinned Items — Full CRUD in Firestore
- Pin any issue, PR, or repo to the sidebar for quick access.
- Custom label per pin.
- Unpin from sidebar or pinned page.

### 9. Contribution Heatmap (Visualization)
- GitHub-style 365-day contribution heatmap built from the user's events.
- Lazy-loaded with `React.lazy` + `Suspense` (chart library is heavy).
- Hover for daily breakdown.

---

## 🗂️ Firestore Data Model

### Collection: `users/{userId}`
```
{
  uid: string                    // Firebase Auth UID
  githubUsername: string         // e.g., "aarav2029"
  githubId: number               // GitHub numeric ID (stable identifier)
  displayName: string
  avatarUrl: string
  email: string
  createdAt: Timestamp
  lastLogin: Timestamp
}
```

### Subcollection: `users/{userId}/goals/{goalId}`
```
{
  id: string                     // auto-generated
  title: string                  // "Merge 5 PRs in May"
  description: string            // optional longer text
  type: string                   // "prs_merged" | "issues_closed" | "reviews_given" | "custom"
  target: number                 // 5
  startDate: Timestamp
  endDate: Timestamp             // deadline
  status: string                 // "active" | "completed" | "expired"
  createdAt: Timestamp
  updatedAt: Timestamp
}
```
**Note:** `current` progress is NOT stored — it is re-derived from GitHub on load. This is a deliberate design decision (source of truth = GitHub).

### Subcollection: `users/{userId}/notes/{noteId}`
```
{
  id: string
  githubUrl: string              // "https://github.com/facebook/react/issues/12345"
  itemType: string               // "issue" | "pr"
  repo: string                   // "facebook/react"
  itemNumber: number             // 12345
  itemTitle: string              // cached title for display without re-fetching
  content: string                // markdown body
  tags: string[]                 // ["blocked", "ask-maintainer"]
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Subcollection: `users/{userId}/pinned/{pinnedId}`
```
{
  id: string
  githubUrl: string
  itemType: string               // "issue" | "pr" | "repo"
  customLabel: string            // user-assigned label
  cachedTitle: string
  cachedRepo: string
  pinnedAt: Timestamp
}
```

### Subcollection: `users/{userId}/activity/{YYYY-MM-DD}`
```
{
  date: string                   // "2026-04-18"
  contributions: number
  breakdown: {
    commits: number
    prs: number
    issues: number
    reviews: number
  }
  lastUpdated: Timestamp
}
```
Used for the contribution heatmap. Populated/updated when the user loads the dashboard (compared against GitHub's events API).

---

## 🌐 GitHub API Endpoints Used

| Endpoint | Purpose | Used In |
|---|---|---|
| `GET /user` | Current user profile | AuthContext (on login) |
| `GET /issues?filter=assigned&state=open` | Assigned issues | Issues page, Dashboard |
| `GET /search/issues?q=is:pr+author:{username}` | Authored PRs | PRs page, Dashboard, Goals (for `prs_merged` progress) |
| `GET /search/issues?q=is:pr+is:open+review-requested:{username}` | Review queue | Reviews page, Dashboard |
| `GET /users/{username}/events` | Recent activity | Dashboard activity feed, Heatmap |
| `GET /repos/{owner}/{repo}` | Repo metadata | Issue/PR detail, Pinned items |
| `GET /user/repos` | User's repos | Repo filter dropdowns |

**Rate limit:** 5,000 requests/hour when authenticated. Must handle `X-RateLimit-Remaining` header and show a warning if below 100. Cache responses for 60 seconds in-memory to avoid redundant calls.

---

## 🗺️ Pages & Routes

| Route | Component | Access | Description |
|---|---|---|---|
| `/` | `Landing` | Public | Hero, features, "Login with GitHub" CTA |
| `/login` | `Login` | Public | GitHub OAuth button |
| `/dashboard` | `Dashboard` | Protected | Stats, goals, activity, pinned |
| `/issues` | `IssuesPage` | Protected | Assigned issues with filters |
| `/issues/:owner/:repo/:number` | `IssueDetail` | Protected | Issue detail + notes (modal or page) |
| `/prs` | `PRsPage` | Protected | Authored PRs with filters |
| `/reviews` | `ReviewsPage` | Protected | Review queue |
| `/goals` | `GoalsPage` | Protected | Goals CRUD |
| `/notes` | `NotesPage` | Protected | All notes with tag filter |
| `/pinned` | `PinnedPage` | Protected | Pinned items grid |
| `/profile` | `Profile` | Protected | User info, logout, disconnect GitHub |

---

## 📁 Folder Structure (EXACT)

```
src/
├── components/
│   ├── auth/
│   │   ├── GitHubLoginButton.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Logout.jsx
│   ├── dashboard/
│   │   ├── StatsRow.jsx
│   │   ├── ActiveGoalsWidget.jsx
│   │   ├── RecentActivityFeed.jsx
│   │   └── PinnedWidget.jsx
│   ├── issues/
│   │   ├── IssueList.jsx
│   │   ├── IssueCard.jsx
│   │   ├── IssueFilters.jsx
│   │   └── IssueDetailModal.jsx
│   ├── prs/
│   │   ├── PRList.jsx
│   │   ├── PRCard.jsx
│   │   ├── PRStats.jsx
│   │   └── PRFilters.jsx
│   ├── reviews/
│   │   ├── ReviewList.jsx
│   │   └── ReviewCard.jsx
│   ├── goals/
│   │   ├── GoalCard.jsx
│   │   ├── GoalForm.jsx
│   │   ├── GoalList.jsx
│   │   └── GoalProgressBar.jsx
│   ├── notes/
│   │   ├── NoteCard.jsx
│   │   ├── NoteForm.jsx
│   │   ├── NoteList.jsx
│   │   └── TagFilter.jsx
│   ├── pinned/
│   │   ├── PinButton.jsx
│   │   └── PinnedList.jsx
│   ├── charts/
│   │   └── ContributionHeatmap.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
│   └── ui/
│       ├── Modal.jsx
│       ├── Button.jsx
│       ├── LoadingSpinner.jsx
│       ├── ErrorMessage.jsx
│       ├── EmptyState.jsx
│       ├── RateLimitWarning.jsx
│       └── Badge.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── IssuesPage.jsx
│   ├── IssueDetail.jsx
│   ├── PRsPage.jsx
│   ├── ReviewsPage.jsx
│   ├── GoalsPage.jsx
│   ├── NotesPage.jsx
│   ├── PinnedPage.jsx
│   └── Profile.jsx
├── context/
│   ├── AuthContext.jsx
│   └── GitHubContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useGitHub.js
│   ├── useAssignedIssues.js
│   ├── useAuthoredPRs.js
│   ├── useReviewQueue.js
│   ├── useGoals.js
│   ├── useNotes.js
│   ├── usePinned.js
│   ├── useDebounce.js
│   └── useRateLimit.js
├── services/
│   ├── firebase.js
│   ├── github.js
│   ├── goalsService.js
│   ├── notesService.js
│   ├── pinnedService.js
│   └── userService.js
├── utils/
│   ├── dateHelpers.js
│   ├── githubHelpers.js
│   └── goalProgressCalculator.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🧠 React Concepts Map (Viva Cheat Sheet)

Every concept the rubric grades → where it appears in this project.

### Core Concepts (Compulsory)

| Concept | Where It's Used |
|---|---|
| Functional Components | Every file in `/components` and `/pages` |
| Props & Composition | `<IssueCard issue={...} />`, `<Modal>{children}</Modal>`, `<GoalProgressBar goal={...} />` |
| `useState` | Filter values, search queries, modal open/close, form inputs, loading/error flags |
| `useEffect` | Every GitHub API fetch on mount, auth state listener, auto-refresh interval, cleanup on unmount |
| Conditional Rendering | Login vs Dashboard nav, empty states, rate-limit warning banner, owner-only edit buttons on notes |
| Lists & Keys | `issues.map(i => <IssueCard key={i.id} ... />)`, goals list, notes list, etc. |

### Intermediate Concepts (Must Include)

| Concept | Where It's Used |
|---|---|
| Lifting State Up | Filters on `IssuesPage` lift to parent, passed down to `IssueFilters` + `IssueList` |
| Controlled Components | Every form input (GoalForm, NoteForm, filter dropdowns, search) controlled via `useState` |
| React Router v6 | All routes above, including dynamic `/issues/:owner/:repo/:number` |
| Context API | `AuthContext` (user + Firebase auth state), `GitHubContext` (GitHub access token + rate limit state) |

### Advanced Concepts (Highly Recommended)

| Concept | Where It's Used | Why |
|---|---|---|
| `useMemo` | `PRStats` computing merge rate & avg-time-to-merge, `IssueList` filtering+sorting the assigned issues array, `GoalProgressBar` computing % complete | These computations iterate large arrays — memo prevents recomputation on every render |
| `useCallback` | `onDelete` and `onEdit` handlers passed from `GoalsPage` to `GoalCard`, `onPin`/`onUnpin` passed to all pinnable components | Prevents child re-renders when parent re-renders |
| `useRef` | Search input focus on `IssuesPage` mount, scroll-to-top button on long lists, storing the last-refresh timestamp without triggering re-render | Mutable value without re-render trigger |
| `React.lazy` + `Suspense` | `ContributionHeatmap` (Recharts is heavy), `GoalsPage`, `NotesPage` — route-level splitting | Reduces initial bundle size |
| Custom Hooks | `useDebounce` for search, `useGitHub` wrapping all API calls with rate-limit tracking, `useGoals`/`useNotes`/`usePinned` wrapping Firestore subscriptions | Reusability + separation of concerns |

---

## 🔨 Phased Build Order (Build In This Exact Sequence)

Do **not** dump everything at once. Complete each phase, I confirm, then move to the next.

### Phase 1 — Project Scaffolding
1. Create Vite project: `npm create vite@latest oss-tracker -- --template react`
2. Install deps: `react-router-dom`, `firebase`, `tailwindcss`, `postcss`, `autoprefixer`, `recharts`, `date-fns`
3. Configure Tailwind (`tailwind.config.js`, `index.css`)
4. Create the exact folder structure above (empty files are fine)
5. Set up `.env.local` with `VITE_FIREBASE_*` vars + `VITE_GITHUB_OAUTH_CLIENT_ID` placeholder

### Phase 2 — Firebase + GitHub OAuth Setup
6. Create Firebase project, enable Firestore + GitHub Auth provider
7. Register a **GitHub OAuth App** at `https://github.com/settings/developers` — set callback URL to Firebase's auth handler URL (instructions on Firebase console)
8. Paste GitHub Client ID + Secret into Firebase console
9. Write `services/firebase.js` — initialize Firebase app, export `auth`, `db`, `GithubAuthProvider`
10. Request correct scopes in provider: `read:user`, `repo`, `read:org`

### Phase 3 — Auth System
11. Write `context/AuthContext.jsx` with `onAuthStateChanged` listener, exposing `{ user, loading, login, logout }`
12. Write `context/GitHubContext.jsx` — stores GitHub access token captured from `GithubAuthProvider.credentialFromResult()`, exposes rate-limit info
13. Write `components/auth/GitHubLoginButton.jsx`
14. Write `components/auth/ProtectedRoute.jsx` — redirects to `/login` if not authed
15. Write `services/userService.js` — `createOrUpdateUserProfile(user)` writes to `users/{userId}` on login
16. Build `pages/Login.jsx` and `pages/Landing.jsx`
17. Wire up routes in `App.jsx`

### Phase 4 — GitHub API Service Layer
18. Write `services/github.js` — a single `githubFetch(token, endpoint, options)` helper that:
    - Adds `Authorization: Bearer {token}` header
    - Reads `X-RateLimit-Remaining` and updates `GitHubContext`
    - Throws typed errors for 401 / 403 / 404 / rate-limit
19. Write wrapper functions: `getAssignedIssues()`, `getAuthoredPRs()`, `getReviewQueue()`, `getUserEvents()`, `getUser()`
20. Write `hooks/useGitHub.js` — generic hook that takes a GitHub fetcher function and returns `{ data, loading, error, refetch }`
21. Write `hooks/useRateLimit.js`

### Phase 5 — Dashboard
22. Write `hooks/useAssignedIssues.js`, `hooks/useAuthoredPRs.js`, `hooks/useReviewQueue.js`
23. Build `components/dashboard/StatsRow.jsx` — four stat cards
24. Build `components/dashboard/RecentActivityFeed.jsx`
25. Build `pages/Dashboard.jsx` — compose the widgets
26. Add auto-refresh every 5 minutes via `useEffect` + `setInterval` (remember cleanup!)

### Phase 6 — Issues Tracker
27. Build `pages/IssuesPage.jsx` with `IssueFilters` + `IssueList`
28. Implement `useMemo` for filtered list
29. Implement debounced search via `useDebounce`
30. Build `IssueDetailModal.jsx`

### Phase 7 — PRs + Reviews
31. Build `pages/PRsPage.jsx` with status grouping + `PRStats` (uses `useMemo`)
32. Build `pages/ReviewsPage.jsx`

### Phase 8 — Goals CRUD (First Firestore Feature)
33. Write `services/goalsService.js` — `createGoal`, `getGoals`, `updateGoal`, `deleteGoal` (using Firestore subcollection under `users/{userId}/goals`)
34. Write `hooks/useGoals.js` with `onSnapshot` subscription
35. Write `utils/goalProgressCalculator.js` — takes a goal + GitHub data, returns `{ current, percentage, status }`
36. Build `GoalForm`, `GoalCard`, `GoalList`, `GoalProgressBar`
37. Build `pages/GoalsPage.jsx`

### Phase 9 — Notes CRUD
38. Write `services/notesService.js`
39. Write `hooks/useNotes.js`
40. Build `NoteForm`, `NoteCard`, `NoteList`, `TagFilter`
41. Build `pages/NotesPage.jsx`
42. Integrate notes into `IssueDetailModal`

### Phase 10 — Pinned Items CRUD
43. Write `services/pinnedService.js`
44. Write `hooks/usePinned.js`
45. Build `PinButton` + `PinnedList`
46. Build `pages/PinnedPage.jsx`
47. Add pinned widget to Sidebar

### Phase 11 — Charts & Heatmap
48. Build `components/charts/ContributionHeatmap.jsx` using Recharts
49. Wrap it in `React.lazy` + `Suspense` inside Dashboard
50. Compute heatmap data from `/users/{username}/events`

### Phase 12 — Polish
51. Loading states everywhere (spinners)
52. Error boundaries on each route
53. Empty states for all lists
54. Rate-limit warning banner (global)
55. Mobile responsive pass (Tailwind breakpoints)
56. Profile page + logout flow

### Phase 13 — Deploy
57. Push to GitHub
58. Deploy to Vercel
59. Add Vercel domain to Firebase Auth authorized domains
60. Add Vercel domain to GitHub OAuth app callback URLs

---

## 🔒 Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /goals/{goalId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /notes/{noteId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /pinned/{pinnedId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /activity/{date} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```
All user data is private. No cross-user reads anywhere.

---

## 🎨 UI/UX Spec

**Design language:** developer-tool minimal — think Linear / GitHub dark-mode aesthetic. Dense but not cluttered.

**Color palette (Tailwind classes):**
- Background: `bg-slate-50` (light) / `bg-slate-900` (dark)
- Cards: `bg-white border border-slate-200` / `bg-slate-800 border border-slate-700`
- Primary action: `bg-indigo-600 hover:bg-indigo-700 text-white`
- Success (merged PRs, completed goals): `text-emerald-600 bg-emerald-50`
- Warning (rate limit low, expiring goals): `text-amber-600 bg-amber-50`
- Error: `text-rose-600 bg-rose-50`
- Open issue: `text-emerald-600`
- Closed issue: `text-rose-600`
- Merged PR: `text-purple-600`

**Every list must have all four states:**
1. Loading (skeleton or spinner)
2. Error (with retry button)
3. Empty (with CTA — e.g., "No assigned issues. Browse good-first-issues on GitHub →")
4. Populated

**Responsive breakpoints:**
- Mobile (`<sm`): single column, sidebar becomes hamburger
- Tablet (`sm` to `lg`): two-column where it makes sense
- Desktop (`≥lg`): full three-column layout (sidebar + main + right rail)

---

## 🛡️ Rules for the AI Assistant

1. **Build step by step.** Don't dump the entire project at once. Follow the Phase order above. Wait for my confirmation between phases.
3. **No TypeScript.** JavaScript only.
4. **No unnecessary libraries.** Only use what's in the tech stack unless I ask.
5. **All forms must be controlled components** — no uncontrolled inputs.
6. **All service functions go in `/services`** — components should never call Firebase or `fetch` directly.
7. **All Firestore reads and GitHub API reads go through custom hooks** in `/hooks`.
8. **Auth and GitHub token state must go through Context** — no prop-drilling user or token.
9. **Use Tailwind classes only** — no inline styles, no CSS modules, no styled-components.
10. **Every component in its own file** — one component per file.
11. **Follow the exact folder structure** defined above.
12. **No comments in code** unless I specifically ask.
13. **Don't remove lines of code** unless I ask.
14. **If fixing an error:** explain what the error is, how we'll fix it, and what the fix code does.
15. **Never store the GitHub access token in localStorage.** Keep it in Context only (session lifetime). Document this as a conscious security choice.
16. **Always clean up `useEffect` subscriptions** — `setInterval` clears, `onSnapshot` unsubscribes, AbortController on fetches.
17. **Respect GitHub rate limits.** Always check `X-RateLimit-Remaining` and surface warnings to the user at <100.

---

## 🏁 Start Here

Begin with **Phase 1, Step 1**: Scaffold the Vite project and install all dependencies. Then proceed to Firebase + GitHub OAuth setup. Wait for my confirmation before moving to Phase 3.