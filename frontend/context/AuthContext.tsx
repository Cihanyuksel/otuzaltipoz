'use client';
import { useLogin, useLogout, useSignup } from '@/hooks/useAuthApi';
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshPromise = useRef<Promise<boolean> | null>(null);
  const tokenExpiry = useRef<number | null>(null);

  const setAuth = useCallback((authData: AuthResponse['data'] | null) => {
    if (authData) {
      setUser(authData.user);
      setAccessToken(authData.accessToken);
      const expiryTime = Date.now() + 30 * 60 * 1000;
      tokenExpiry.current = expiryTime;
      localStorage.setItem('tokenExpiry', expiryTime.toString());
    } else {
      setUser(null);
      setAccessToken(null);
      tokenExpiry.current = null;
      localStorage.removeItem('tokenExpiry');
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

  const shouldRefreshToken = useCallback((): boolean => {
    if (!tokenExpiry.current) return false;

    const now = Date.now();
    const timeUntilExpiry = tokenExpiry.current - now;
    const REFRESH_THRESHOLD = 5 * 60 * 1000;

    return timeUntilExpiry <= REFRESH_THRESHOLD;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedExpiry = localStorage.getItem('tokenExpiry');
      if (savedExpiry) {
        tokenExpiry.current = parseInt(savedExpiry);
      }

      const hasCookieOrLocalStorageToken = document.cookie.includes('refreshToken') || !!localStorage.getItem('tokenExpiry');

      if (hasCookieOrLocalStorageToken) {
        try {
          const refreshData = await authService.refresh();
          setAuth(refreshData);
        } catch (error: any) {
          setAuth(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setAuth]);

  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && shouldRefreshToken()) {
        refreshToken();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [accessToken, shouldRefreshToken, refreshToken]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && accessToken && shouldRefreshToken()) {
        refreshToken();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [accessToken, shouldRefreshToken, refreshToken]);

  const login = useLogin();
  const signup = useSignup();
  const logout = useLogout(setAuth);

  useEffect(() => {
    (window as any).__accessToken = accessToken;
    (window as any).__refreshToken = refreshToken;
    (window as any).__shouldRefreshToken = shouldRefreshToken;
  }, [accessToken, refreshToken, shouldRefreshToken]);

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
