export const API_BASE_URL: string = 'http://localhost:4000/api/v1';

export type AuthPaths = {
  LOGIN: string;
  LOGOUT: string;
  SIGNUP: string;
  REFRESH: string;
};

export const AUTH_PATHS: AuthPaths = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  SIGNUP: '/auth/signup',
  REFRESH: '/auth/refresh',
};
