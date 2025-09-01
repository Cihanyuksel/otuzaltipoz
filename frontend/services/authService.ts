import { apiFetch } from '../hooks/apiFetch';
import { AUTH_PATHS } from '../lib/config';
import {
  AuthResponse,
  LoginRequest,
  MessageResponse,
  SignupRequest,
} from '../types/auth';

export const authService = {
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    return apiFetch(AUTH_PATHS.SIGNUP, { method: 'POST', body: JSON.stringify({
      username: data.username,
      full_name: data.fullname,
      email: data.email,
      password: data.password,
    }) });
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
};
