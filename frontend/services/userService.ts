import axios from 'axios';
import { USER_PATHS } from 'lib/config';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  getUser: async (userId: string) => {
    try {
      const response = await apiClient.get(USER_PATHS.GET_USERS(userId));
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
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete user',
        status: error.response?.status || error.status || 500,
      };
    }
  },
};
