// services/authService.ts
import axios from 'axios';
import { API_BASE_URL, AUTH_PATHS } from '../lib/config';
import { AuthResponse, LoginRequest, MessageResponse } from '../types/auth';
import { axiosInstance } from 'lib/axiosInstance';

export const authService = {
  //--------------------------------------------------------------------------------------------\\
  signup: async (formData: FormData): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post(AUTH_PATHS.SIGNUP, formData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Kayıt başarısız');
    }
  },
  //--------------------------------------------------------------------------------------------\\
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post(AUTH_PATHS.LOGIN, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Giriş başarısız');
    }
  },

  //--------------------------------------------------------------------------------------------\\
  logout: async (): Promise<MessageResponse> => {
    try {
      const response = await axiosInstance.post(AUTH_PATHS.LOGOUT);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Çıkış başarısız');
    }
  },
  //--------------------------------------------------------------------------------------------\\

  refresh: async (): Promise<AuthResponse['data']> => {
    try {
      const response = await axios.post(`${API_BASE_URL}${AUTH_PATHS.REFRESH}`, {}, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  //--------------------------------------------------------------------------------------------\\
  verifyToken: async (token: string) => {
    try {
      const response = await axiosInstance.get(AUTH_PATHS.VERIFY_EMAIL(token));
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Token doğrulama başarısız');
    }
  },
  //--------------------------------------------------------------------------------------------\\
  forgotPassword: async (data: { email: string }) => {
    try {
      const response = await axiosInstance.post(AUTH_PATHS.FORGOT_PASSWORD, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'İşlem başarısız');
    }
  },
  //--------------------------------------------------------------------------------------------\\
  resetPassword: async (data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post(AUTH_PATHS.RESET_PASSWORD(data.token), {
        token: data.token,
        password: data.newPassword,
        confirm_password: data.confirmPassword,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Şifre sıfırlama başarısız');
    }
  },
  //--------------------------------------------------------------------------------------------\\
  contactMail: async (data: any): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post(AUTH_PATHS.CONTACT, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Mesaj gönderilemedi');
    }
  },
  //--------------------------------------------------------------------------------------------\\
};
