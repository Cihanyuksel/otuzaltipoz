'use client';
import { useLogin, useLogout, useSignup } from '@/hooks/api/useAuthApi';
import { setAxiosAccessToken } from 'lib/axiosInstance';
import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { authService } from 'services/authService';
import { AuthResponse, User } from 'types/auth';

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: ReturnType<typeof useLogin>;
  signup: ReturnType<typeof useSignup>;
  logout: ReturnType<typeof useLogout>;
  setAuth: (data: AuthResponse['data'] | null) => void;
  refreshToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_SESSION_KEY = 'has_auth_session';

const hasAuthSession = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(AUTH_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
};

const setAuthSession = (exists: boolean) => {
  if (typeof window === 'undefined') return;
  try {
    if (exists) {
      localStorage.setItem(AUTH_SESSION_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
  } catch {}
};

let globalRefreshAttempted = false;
let globalRefreshPromise: Promise<AuthResponse['data'] | null> | null = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshPromise = useRef<Promise<boolean> | null>(null);
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);

  const setAuth = useCallback((authData: AuthResponse['data'] | null) => {
    if (authData) {
      setUser(authData.user);
      setAccessToken(authData.accessToken);
      setAxiosAccessToken(authData.accessToken);
      setAuthSession(true);
    } else {
      setUser(null);
      setAccessToken(null);
      setAxiosAccessToken(null);
      setAuthSession(false);
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (refreshPromise.current) {
      return refreshPromise.current;
    }

    refreshPromise.current = (async () => {
      try {
        const refreshData = await authService.refresh();
        setAuth(refreshData);
        return true;
      } catch (error) {
        setAuth(null);
        return false;
      } finally {
        refreshPromise.current = null;
      }
    })();

    return refreshPromise.current;
  }, [setAuth]);

  useEffect(() => {
    if (!accessToken) return;
    if (refreshTimer.current) return;

    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresAt = payload.exp * 1000;
      const now = Date.now();
      const refreshTime = expiresAt - now - 5 * 60 * 1000;

      if (refreshTime > 0) {
        refreshTimer.current = setTimeout(async () => {
          refreshTimer.current = null;
          await refreshToken();
        }, refreshTime);
      } else {
        refreshTimer.current = null;
        refreshToken();
      }
    } catch (error) {
      console.error('JWT decode error:', error);
      refreshToken();
    }

    return () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
        refreshTimer.current = null;
      }
    };
  }, [accessToken, refreshToken]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!hasAuthSession()) {
        setAuth(null);
        setLoading(false);
        return;
      }

      if (globalRefreshAttempted) {
        if (globalRefreshPromise) {
          try {
            const result = await globalRefreshPromise;
            if (result) {
              setAuth(result);
            } else {
              setAuth(null);
            }
          } catch (error) {
            setAuth(null);
          }
        }
        setLoading(false);
        return;
      }

      globalRefreshAttempted = true;

      globalRefreshPromise = (async () => {
        try {
          const refreshData = await authService.refresh();
          return refreshData;
        } catch (error: any) {
          return null;
        }
      })();

      try {
        const result = await globalRefreshPromise;
        if (result) {
          setAuth(result);
        } else {
          setAuth(null);
        }
      } finally {
        setLoading(false);
        globalRefreshPromise = null;
      }
    };

    initializeAuth();
  }, [setAuth]);

  useEffect(() => {
    const handleTokenRefreshed = (event: CustomEvent) => {
      const authData = event.detail;
      if (authData) {
        setAuth(authData);
      }
    };

    const handleUnauthorized = () => {
      setAuth(null);
    };

    window.addEventListener('auth:tokenRefreshed', handleTokenRefreshed as EventListener);
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:tokenRefreshed', handleTokenRefreshed as EventListener);
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [setAuth]);

  const login = useLogin();
  const signup = useSignup();
  const logout = useLogout(setAuth);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        signup,
        logout,
        setAuth,
        refreshToken,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
