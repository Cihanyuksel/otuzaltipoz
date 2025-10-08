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
    } else {
      setUser(null);
      setAccessToken(null);
      setAxiosAccessToken(null);
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
      try {
        const refreshData = await authService.refresh();
        setAuth(refreshData);
      } catch (error) {
        setAuth(null);
      } finally {
        setLoading(false);
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