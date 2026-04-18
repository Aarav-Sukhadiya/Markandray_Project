import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GitHubProvider } from './context/GitHubContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IssuesPage from './pages/IssuesPage';
import IssueDetail from './pages/IssueDetail';
import PRsPage from './pages/PRsPage';
import ReviewsPage from './pages/ReviewsPage';
import Profile from './pages/Profile';

const GoalsPage = lazy(() => import('./pages/GoalsPage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const PinnedPage = lazy(() => import('./pages/PinnedPage'));

export default function App() {
  return (
    <BrowserRouter>
      <GitHubProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner label="Loading…" />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/issues" element={<IssuesPage />} />
                <Route path="/issues/:owner/:repo/:number" element={<IssueDetail />} />
                <Route path="/prs" element={<PRsPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/goals" element={<GoalsPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/pinned" element={<PinnedPage />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </GitHubProvider>
    </BrowserRouter>
  );
}
