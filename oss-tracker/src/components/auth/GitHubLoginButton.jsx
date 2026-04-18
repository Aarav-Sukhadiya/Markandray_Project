import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

export default function GitHubLoginButton({ redirectTo = '/dashboard', className = '' }) {
  const { login, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login();
      navigate(redirectTo);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <Button onClick={handleLogin} disabled={loading} className="bg-slate-900 hover:bg-slate-800">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .296C5.372.296 0 5.668 0 12.296c0 5.302 3.438 9.8 8.205 11.386.6.111.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.334-1.756-1.334-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.998.108-.776.42-1.305.763-1.605-2.665-.303-5.467-1.333-5.467-5.932 0-1.31.468-2.382 1.235-3.222-.124-.303-.535-1.525.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.65.244 2.873.12 3.176.77.84 1.233 1.911 1.233 3.222 0 4.61-2.806 5.625-5.48 5.923.432.37.818 1.102.818 2.222 0 1.606-.014 2.898-.014 3.293 0 .32.216.694.825.576C20.565 22.092 24 17.592 24 12.296 24 5.668 18.627.296 12 .296z" />
        </svg>
        {loading ? 'Signing in…' : 'Continue with GitHub'}
      </Button>
      {!isConfigured && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Firebase is not configured — demo mode only. See <code>instructions.md</code>.
        </p>
      )}
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
