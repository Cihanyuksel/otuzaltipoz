export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//----------------------------------------------------------------//
//----------------------------TYPES-------------------------------//
//----------------------------------------------------------------//
interface AuthPaths {
  LOGIN: string;
  LOGOUT: string;
  SIGNUP: string;
  REFRESH: string;
  FORGOT_PASSWORD: string;
  CONTACT: string;
  RESET_PASSWORD: (token: string) => string;
  VERIFY_EMAIL: (token: string) => string;
}

interface UserPaths {
  DELETE_USER: (id: string) => string;
  GET_USER: (id: string) => string;
  UPDATE_USER: (id: string) => string;
  UPDATE_USERNAME: (id: string) => string;
  UPDATE_PASSWORD: (id: string) => string;
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
  UPDATE_COMMENT: (id: string) => string;
}

interface LikePaths {
  GET_LIKES: (id: string) => string;
  TOGGLE_LIKE: (id: string) => string;
}

interface RatingPaths {
  GET_RATINGS: (id: string) => string;
  RATE_PHOTO: (id: string) => string;
}

//----------------------------------------------------------------//
//----------------------------PATH-------------------------------//
//----------------------------------------------------------------//
export const AUTH_PATHS: AuthPaths = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  SIGNUP: '/auth/signup',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  CONTACT: '/auth/contact',
  RESET_PASSWORD: (token: string) => `/auth/reset-password?token=${token}`,
  VERIFY_EMAIL: (token: string) => `/auth/verify-email?token=${token}`,
};

export const USER_PATHS: UserPaths = {
  GET_USER: (id: string) => `/users/${id}`,
  UPDATE_USER: (id: string) => `/users/${id}`,
  UPDATE_USERNAME: (id: string) => `/users/${id}/username`,
  UPDATE_PASSWORD: (id: string) => `/users/${id}/password`,
  DELETE_USER: (id: string) => `/users/${id}`,
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
  GET_COMMENTS: (photoId) => `/photos/comments/${photoId}`,
  ADD_COMMENT: (photoId) => `/photos/comments/${photoId}`,
  UPDATE_COMMENT: (commentId) => `/photos/comments/${commentId}`,
  DELETE_COMMENT: (commentId) => `/photos/comments/${commentId}`,
};

export const LIKE_PATH: LikePaths = {
  GET_LIKES: (id) => `/photos/${id}/likes`,
  TOGGLE_LIKE: (id) => `/photos/${id}/toggle-like`,
};

export const RATING_PATH: RatingPaths = {
  GET_RATINGS: (id) => `/photos/${id}/ratings`,
  RATE_PHOTO: (id) => `/photos/${id}/rate`,
};
