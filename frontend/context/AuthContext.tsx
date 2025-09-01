'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLogin, useLogout, useSignup, useRefresh } from '../hooks/useAuthApi';
import { AuthResponse, User } from '../types/auth';

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: ReturnType<typeof useLogin>;
  signup: ReturnType<typeof useSignup>;
  logout: ReturnType<typeof useLogout>;
  setAuth: (data: AuthResponse['data'] | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const { data: refreshData, isLoading } = useRefresh();

  const login = useLogin();
  const signup = useSignup();
  const logout = useLogout();

  const setAuth = (authData: AuthResponse['data'] | null) => {
    console.log(authData)
    if (authData) {
      setUser(authData.user);
      setAccessToken(authData.accessToken);
    } else {
      setUser(null);
      setAccessToken(null);
    }
  };

  useEffect(() => {
    if (refreshData) {
      setAuth(refreshData);
    }
  }, [refreshData]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading: isLoading,
        login,
        signup,
        logout,
        setAuth,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
