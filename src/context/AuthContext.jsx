import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, githubProvider, isFirebaseConfigured } from '../services/firebase';
import { createOrUpdateUserProfile } from '../services/userService';
import { GitHubContext } from './GitHubContext';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const github = useContext(GitHubContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async () => {
    setAuthError(null);

    if (!isFirebaseConfigured || !auth || !githubProvider) {
      const demoUser = {
        uid: 'demo-user',
        displayName: 'Demo User',
        email: 'demo@example.com',
        photoURL: 'https://avatars.githubusercontent.com/u/9919?v=4',
        reloadUserInfo: { screenName: 'octocat' },
        isDemo: true,
      };
      setUser(demoUser);
      github?.setToken('demo-token');
      github?.setGithubUser({
        login: 'octocat',
        id: 1,
        name: 'Demo User',
        avatar_url: demoUser.photoURL,
      });
      return demoUser;
    }

    try {
      const result = await signInWithPopup(auth, githubProvider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken ?? null;

      github?.setToken(accessToken);

      let githubProfile = null;
      if (accessToken) {
        try {
          const resp = await fetch('https://api.github.com/user', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
            },
          });
          if (resp.ok) {
            githubProfile = await resp.json();
            github?.setGithubUser(githubProfile);
          }
        } catch (err) {
          console.error('[auth] failed to fetch github profile', err);
        }
      }

      try {
        await createOrUpdateUserProfile(result.user, githubProfile);
      } catch (err) {
        console.error('[auth] profile sync failed', err);
      }

      return result.user;
    } catch (err) {
      console.error('[auth] login error', err);
      setAuthError(err.message || 'Login failed');
      throw err;
    }
  }, [github]);

  const logout = useCallback(async () => {
    github?.clear();
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      return;
    }
    await signOut(auth);
    setUser(null);
  }, [github]);

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      login,
      logout,
      isConfigured: isFirebaseConfigured,
    }),
    [user, loading, authError, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
