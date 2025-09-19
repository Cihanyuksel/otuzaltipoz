export const API_BASE_URL: string = 'http://localhost:4000/api/v1';

interface AuthPaths {
  LOGIN: string;
  LOGOUT: string;
  SIGNUP: string;
  REFRESH: string;
}

interface PhotosPaths {
  GETALL_PHOTOS: string;
  GET_PHOTOS: (id: number | string) => string;
  ADD_PHOTO: string;
  DELETE_PHOTO: (id: number | string) => string;
  UPDATE_PHOTO: (id: number | string) => string;
  GET_PHOTOS_BY_USER_ID: (id: number | string) => string;
  GET_LIKED_PHOTOS: (id: number | string) => string;
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
};

export const PHOTO_PATHS: PhotosPaths = {
  GETALL_PHOTOS: '/photos',
  GET_PHOTOS: (id) => `/photos/${id}`,
  ADD_PHOTO: '/photos/upload',
  DELETE_PHOTO: (id) => `/photos/${id}`,
  UPDATE_PHOTO: (id) => `/photos/${id}`,
  GET_PHOTOS_BY_USER_ID: (id) => `/photos/user/${id}`,
  GET_LIKED_PHOTOS: (id) => `/photos/liked/${id}`,
};

export const COMMENTS_PATH: CommentPaths = {
  GET_COMMENTS: (id) => `/photos/${id}/comments`,
  ADD_COMMENT: (id) => `/photos/${id}/comments`,
  DELETE_COMMENT: (id) => `/photos/${id}/comments`,
};
