import { apiFetch } from '@/hooks/apiFetch';

export const likeService = {
  toggleLike: async (photoId: string, accessToken: string | null) => {
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await apiFetch(`/${photoId}/like`, {
        method: 'POST',
        headers,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getLikes: async (photoId: string, accessToken?: string) => {
    try {
      const headers: HeadersInit = {};

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await apiFetch(`/${photoId}/likes`, {
        method: 'GET',
        headers,
      });

      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
