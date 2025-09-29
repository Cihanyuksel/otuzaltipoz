import axios from 'axios';
import { API_BASE_URL, AUTH_PATHS } from '../lib/config';
import { AuthResponse, LoginRequest, MessageResponse } from '../types/auth';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

export const authService = {
  //--------------------------------------------------------------------------------------------\\
  signup: async (formData: FormData): Promise<AuthResponse> => {
    try {
      const response = await authClient.post(AUTH_PATHS.SIGNUP, formData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'API request failed';
      throw new Error(errorMessage);
    }
  },
  //--------------------------------------------------------------------------------------------\\
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await authClient.post(AUTH_PATHS.LOGIN, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'API request failed';
      throw new Error(errorMessage);
    }
  },
  //--------------------------------------------------------------------------------------------\\
  logout: async (): Promise<MessageResponse> => {
    try {
      const response = await authClient.post(AUTH_PATHS.LOGOUT);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'API request failed';
      throw new Error(errorMessage);
    }
  },
  //--------------------------------------------------------------------------------------------\\
  refresh: async (): Promise<AuthResponse['data']> => {
    try {
      const response = await authClient.post(AUTH_PATHS.REFRESH);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'API request failed';
      throw new Error(errorMessage);
    }
  },
  //--------------------------------------------------------------------------------------------\\
  verifyToken: async (token: string) => {
    try {
      const response = await authClient.get(AUTH_PATHS.VERIFY_EMAIL(token));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'API request failed';
      throw new Error(errorMessage);
    }
  },
  //--------------------------------------------------------------------------------------------\\
  forgotPassword: async (data: { email: string }) => {
    try {
      const response = await authClient.post(AUTH_PATHS.FORGOT_PASSWORD, data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'API request failed';
      throw new Error(errorMessage);
    }
  },
  //--------------------------------------------------------------------------------------------\\
  resetPassword: async (data: { token: string; newPassword: string }): Promise<AuthResponse> => {
    try {
      const response = await authClient.post(AUTH_PATHS.RESET_PASSWORD(data.token), {
        token: data.token,
        newPassword: data.newPassword,
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Şifre sıfırlama başarısız oldu.';
      throw new Error(errorMessage);
    }
  },
  //--------------------------------------------------------------------------------------------\\
};
