import { ApiResponse, Photo } from 'types/photo';
import { apiFetch } from '../hooks/apiFetch';
import { API_BASE_URL, PHOTO_PATHS } from '../lib/config';

export const photoService = {
  getAllPhoto: async (searchQuery?: string): Promise<ApiResponse<Photo[]>> => {
    try {
      let path = PHOTO_PATHS.GETALL_PHOTOS;
      if (searchQuery) {
        path += `?search=${searchQuery}`;
      }
      const response = await apiFetch<ApiResponse<Photo[]>>(path, {});
      return response;
    } catch (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
  },

  getPhoto: async (id: string | number): Promise<Photo> => {
    try {
      const response = await apiFetch<ApiResponse<Photo>>(PHOTO_PATHS.GET_PHOTOS(id), {});
      const photo = response.data;
      return photo;
    } catch (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
  },

  addPhoto: async (formData: FormData, accessToken: string) => {
    const res = await fetch(`${API_BASE_URL}${PHOTO_PATHS.ADD_PHOTO}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  },
};
