export const API_BASE_URL: string = 'http://localhost:4000/api/v1';

interface AuthPaths {
  LOGIN: string;
  LOGOUT: string;
  SIGNUP: string;
  REFRESH: string;
  FORGOT_PASSWORD: string;
  RESET_PASSWORD: (token: string) => string;
  VERIFY_EMAIL: (token: string) => string;
}

interface UserPaths {
  DELETE_USER: (id: string) => string;
  GET_USER: (id: string) => string;
}

interface PhotosPaths {
  GETALL_PHOTOS: string;
  GET_PHOTOS: (id: number | string) => string;
  ADD_PHOTO: string;
  DELETE_PHOTO: (id: number | string) => string;
  UPDATE_PHOTO: (id: number | string) => string;
  GET_PHOTOS_BY_USER_ID: (id: number | string) => string;
  GET_LIKED_PHOTOS: (id: number | string) => string;
  GET_RANDOM_PHOTOS: (limit: number) => string;
  POPULAR_PHOTOS: (limit: number, timeframe: 'all' | 'week' | 'month' | 'day') => string;
}

interface CommentPaths {
  GET_COMMENTS: (id: string) => string;
  ADD_COMMENT: (id: string) => string;
  DELETE_COMMENT: (id: string) => string;
}

export const AUTH_PATHS: AuthPaths = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  SIGNUP: '/auth/signup',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: (token: string) => `/auth/reset-password?token=${token}`,
  VERIFY_EMAIL: (token: string) => `/auth/verify-email?token=${token}`,
};

export const USER_PATHS: UserPaths = {
  DELETE_USER: (id: string) => `/users/${id}`,
  GET_USER: (id: string) => `/users/${id}`,
};

export const PHOTO_PATHS: PhotosPaths = {
  GETALL_PHOTOS: '/photos',
  ADD_PHOTO: '/photos/upload',
  GET_PHOTOS: (id) => `/photos/${id}`,
  DELETE_PHOTO: (id) => `/photos/${id}`,
  UPDATE_PHOTO: (id) => `/photos/${id}`,
  GET_PHOTOS_BY_USER_ID: (id) => `/photos/user/${id}`,
  GET_LIKED_PHOTOS: (id) => `/photos/liked/${id}`,
  GET_RANDOM_PHOTOS: (limit) => `/photos?sort=random&limit=${limit}`,
  POPULAR_PHOTOS: (limit, timeframe) => `/photos/popular?limit=${limit}&timeframe=${timeframe}`,
};

export const COMMENTS_PATH: CommentPaths = {
  GET_COMMENTS: (id) => `/photos/${id}/comments`,
  ADD_COMMENT: (id) => `/photos/${id}/comments`,
  DELETE_COMMENT: (id) => `/photos/${id}/comments`,
};
