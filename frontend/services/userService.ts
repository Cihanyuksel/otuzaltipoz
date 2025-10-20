import { axiosInstance } from 'lib/axiosInstance';
import { USER_PATHS } from 'lib/config';

export const userService = {
  getUser: async (userId: string) => {
    const response = await axiosInstance.get(USER_PATHS.GET_USER(userId));
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await axiosInstance.delete(USER_PATHS.DELETE_USER(userId));
    return response.data;
  },
};
