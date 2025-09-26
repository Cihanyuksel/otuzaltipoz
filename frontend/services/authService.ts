import { apiFetch } from '@/hooks/apiFetch';
import { API_BASE_URL, AUTH_PATHS } from '../lib/config';
import { AuthResponse, LoginRequest, MessageResponse } from '../types/auth';

export const authService = {
  signup: async (formData: FormData): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE_URL}${AUTH_PATHS.SIGNUP}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiFetch(AUTH_PATHS.LOGIN, { method: 'POST', body: JSON.stringify(data) });
  },

  logout: async (): Promise<MessageResponse> => {
    return apiFetch(AUTH_PATHS.LOGOUT, { method: 'POST' });
  },

  refresh: async (): Promise<AuthResponse['data']> => {
    return apiFetch(AUTH_PATHS.REFRESH, { method: 'POST' });
  },

  verifyToken: async (token: string) => {
    return apiFetch(AUTH_PATHS.VERIFY_EMAIL(token));
  },
};
