import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, AUTH_PATHS } from './config';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

let currentAccessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

export const setAxiosAccessToken = (token: string | null) => {
  currentAccessToken = token;
};

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/signup',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
];

const VALIDATION_ENDPOINTS = ['/password', '/auth/login', '/username'];

const isPublicEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

const isValidationEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return VALIDATION_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (currentAccessToken && config.headers) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (
    error: AxiosError<{
      message?: string;
      errors?: Array<{ field: string; message: string }>;
    }>
  ) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // ==================== TOKEN REFRESH LOGIC ====================
    const isPublic = isPublicEndpoint(originalRequest?.url);
    const isValidation = isValidationEndpoint(originalRequest?.url);

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isPublic) {
      if (isValidation) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Validation error - not refreshing token:', error.response?.data?.message);
        }

        const errorMessage = error.response?.data?.message || 'Bir hata oluştu';
        const errorDetails = error.response?.data?.errors;
        const statusCode = error.response?.status;

        const apiError = {
          message: errorMessage,
          status: statusCode,
          details: errorDetails,
          isNetworkError: false,
          isServerError: false,
          isClientError: true,
        };

        return Promise.reject(apiError);
      }

      // Token refresh için queue mantığı
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Access token refresh
        const response = await axios.post(`${API_BASE_URL}${AUTH_PATHS.REFRESH}`, {}, { withCredentials: true });

        const newAccessToken = response.data.accessToken;

        // Token update
        currentAccessToken = newAccessToken;

        // Header update
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);

        window.dispatchEvent(
          new CustomEvent('auth:tokenRefreshed', {
            detail: response.data,
          })
        );

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        currentAccessToken = null;
        processQueue(refreshError as AxiosError, null);
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ==================== ERROR HANDLING ====================
    if (error.response?.status === 401 && !isPublic && !isValidation) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    const errorMessage = error.response?.data?.message || 'Bir hata oluştu';
    const errorDetails = error.response?.data?.errors;
    const statusCode = error.response?.status;

    if (process.env.NODE_ENV === 'development') {
      console.error('🔴 API Error:', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: statusCode,
        message: errorMessage,
        details: errorDetails,
        isPublic,
        isValidation,
      });
    }

    const apiError = {
      message: errorMessage,
      status: statusCode,
      details: errorDetails,
      isNetworkError: !error.response,
      isServerError: statusCode ? statusCode >= 500 : false,
      isClientError: statusCode ? statusCode >= 400 && statusCode < 500 : false,
    };

    if (!error.response) {
      apiError.message = 'İnternet bağlantınızı kontrol edin';
    }

    if (apiError.isServerError) {
      apiError.message = errorMessage || 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
    }

    return Promise.reject(apiError);
  }
);
