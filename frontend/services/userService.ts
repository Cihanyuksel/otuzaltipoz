import { axiosInstance } from 'lib/axiosInstance';
import { USER_PATHS } from 'lib/config';

export const userService = {
  // Get user by ID
  getUser: async (userId: string) => {
    const response = await axiosInstance.get(USER_PATHS.GET_USER(userId));
    return response.data;
  },

  // Update user profile (bio, full_name)
  updateUser: async (userId: string, data: { bio?: string; full_name?: string }) => {
    const response = await axiosInstance.put(USER_PATHS.UPDATE_USER(userId), data);
    return response.data;
  },

  // Update username
  updateUsername: async (userId: string, username: string) => {
    const response = await axiosInstance.put(USER_PATHS.UPDATE_USERNAME(userId), { username });
    return response.data;
  },

  // Update password
  updatePassword: async (userId: string, currentPassword: string, newPassword: string, confirmPassword: string) => {
    const response = await axiosInstance.put(USER_PATHS.UPDATE_PASSWORD(userId), {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  // Delete user
  deleteUser: async (userId: string) => {
    const response = await axiosInstance.delete(USER_PATHS.DELETE_USER(userId));
    return response.data;
  },
};
