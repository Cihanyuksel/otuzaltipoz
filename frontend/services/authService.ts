import axios from 'axios';
import { API_BASE_URL, AUTH_PATHS } from '../lib/config';
import { axiosInstance } from 'lib/axiosInstance';
import { AuthResponse, ContactData, LoginCredentials, MessageResponse } from 'types/auth';

export const authService = {
  signup: async (formData: FormData): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post(AUTH_PATHS.SIGNUP, formData);
    return data;
  },

  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const { data: response } = await axiosInstance.post(AUTH_PATHS.LOGIN, data);
    return response;
  },

  logout: async (): Promise<MessageResponse> => {
    const { data } = await axiosInstance.post(AUTH_PATHS.LOGOUT);
    return data;
  },

  refresh: async (): Promise<AuthResponse['data']> => {
    const { data } = await axios.post(`${API_BASE_URL}${AUTH_PATHS.REFRESH}`, {}, { withCredentials: true });
    return data;
  },

  verifyToken: async (token: string) => {
    const { data } = await axiosInstance.get(AUTH_PATHS.VERIFY_EMAIL(token));
    return data;
  },

  forgotPassword: async (data: { email: string }) => {
    const { data: response } = await axiosInstance.post(AUTH_PATHS.FORGOT_PASSWORD, data);
    return response;
  },

  resetPassword: async (data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<AuthResponse> => {
    const { data: response } = await axiosInstance.post(AUTH_PATHS.RESET_PASSWORD(data.token), {
      token: data.token,
      password: data.newPassword,
      confirm_password: data.confirmPassword,
    });
    return response;
  },

  contactMail: async (data: ContactData): Promise<MessageResponse> => {
    const { data: response } = await axiosInstance.post(AUTH_PATHS.CONTACT, data);
    return response;
  },
};
