import axios from 'axios';
import { USER_PATHS } from 'lib/config';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const userService = {
  getUser: async (userId: string) => {
    try {
      const response = await apiClient.get(USER_PATHS.GET_USER(userId));
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`HTTP error! status: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('No response received from server');
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await apiClient.delete(USER_PATHS.DELETE_USER(userId));
      return response.data;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },
};
