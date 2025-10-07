import { axiosInstance } from 'lib/axiosInstance';

export const likeService = {
  toggleLike: async (photoId: string, accessToken: string | null | undefined) => {
    try {
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axiosInstance.post(`/${photoId}/like`, {}, { headers });
      return response.data;
      
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getLikes: async (photoId: string, accessToken?: string) => {
    try {
      const headers: Record<string, string> = {};

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await axiosInstance.get(`/${photoId}/likes`, {
        headers,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
