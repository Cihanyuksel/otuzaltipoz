import apiFetch from '@/hooks/apiFetch';
import { API_BASE_URL, PHOTO_PATHS } from 'lib/config';
import { ApiResponse, Photo } from 'types/photo';

export const photoService = {
  getAllPhoto: async (searchQuery?: string, accessToken?: string | null): Promise<ApiResponse<Photo[]>> => {
    try {
      let path = PHOTO_PATHS.GETALL_PHOTOS;
      if (searchQuery) {
        path += `?search=${searchQuery}`;
      }

      const options: any = {};

      if (accessToken) {
        options.headers = {
          Authorization: `Bearer ${accessToken}`,
        };
      }

      const response = await apiFetch<ApiResponse<Photo[]>>(path, options);
      return response;
    } catch (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
  },

  getPhoto: async (id: string | number, accessToken?: string | null): Promise<Photo> => {
    try {
      const options: any = {};

      if (accessToken) {
        options.headers = {
          Authorization: `Bearer ${accessToken}`,
        };
      }

      const response = await apiFetch<ApiResponse<Photo>>(PHOTO_PATHS.GET_PHOTOS(id), options);
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

  getPhotoByUserId: async (userId: string, accessToken?: string | null): Promise<ApiResponse<Photo[]>> => {
    try {
      const options: any = {};

      if (accessToken) {
        options.headers = {
          Authorization: `Bearer ${accessToken}`,
        };
      }

      const path = PHOTO_PATHS.GET_PHOTOS_BY_USER_ID(userId);

      const response = await apiFetch<ApiResponse<Photo[]>>(path, options);
      return response;
    } catch (error) {
      console.error('Error fetching user photos:', error);
      throw error;
    }
  },

  getLikedPhotos: async (userId: string, accessToken?: string | null): Promise<ApiResponse<Photo[]>> => {
    try {
      const options: any = {};

      if (accessToken) {
        options.headers = {
          Authorization: `Bearer ${accessToken}`,
        };
      }

      const path = PHOTO_PATHS.GET_LIKED_PHOTOS(userId);

      const response = await apiFetch<ApiResponse<Photo[]>>(path, options);
      return response;
    } catch (error) {
      console.error('Error fetching liked photos:', error);
      throw error;
    }
  },
};
