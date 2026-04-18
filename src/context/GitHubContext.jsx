import { createContext, useCallback, useMemo, useState } from 'react';

export const GitHubContext = createContext(null);

export function GitHubProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [githubUser, setGithubUser] = useState(null);
  const [rateLimit, setRateLimit] = useState({
    remaining: null,
    limit: null,
    reset: null,
  });

  const setToken = useCallback((next) => {
    setTokenState(next);
  }, []);

  const updateRateLimit = useCallback((info) => {
    if (!info) return;
    setRateLimit((prev) => ({ ...prev, ...info }));
  }, []);

  const clear = useCallback(() => {
    setTokenState(null);
    setGithubUser(null);
    setRateLimit({ remaining: null, limit: null, reset: null });
  }, []);

  const value = useMemo(
    () => ({
      token,
      setToken,
      githubUser,
      setGithubUser,
      rateLimit,
      updateRateLimit,
      clear,
    }),
    [token, setToken, githubUser, rateLimit, updateRateLimit, clear],
  );

  return <GitHubContext.Provider value={value}>{children}</GitHubContext.Provider>;
}
