import apiFetch from '@/hooks/apiFetch';
import { API_BASE_URL, PHOTO_PATHS } from 'lib/config';
import { ApiResponse, Photo } from 'types/photo';

export const photoService = {
  //GET ALL PHOTO
  getAllPhoto: async (
    searchQuery?: string,
    accessToken?: string | null
  ): Promise<ApiResponse<Photo[]>> => {
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

  //GET PHOTO
  getPhoto: async (id: string | number, accessToken?: string | null): Promise<Photo | null> => {
    try {
      const options: any = {};

      if (accessToken) {
        options.headers = {
          Authorization: `Bearer ${accessToken}`,
        };
      }

      const response = await apiFetch<ApiResponse<Photo>>(PHOTO_PATHS.GET_PHOTOS(id), options);

      if (!response || !response.data || response.success === false) {
        return null;
      }

      const photo = response.data;
      return photo;
    } catch (error) {
      console.warn('Photo could not be fetched (likely deleted):', error);
      return null;
    }
  },

  //ADD PHOTO
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

  //USER PHOTOS
  getPhotoByUserId: async (
    userId: string,
    accessToken?: string | null
  ): Promise<ApiResponse<Photo[]>> => {
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

  //LIKED PHOTOS
  getLikedPhotos: async (
    userId: string,
    accessToken?: string | null
  ): Promise<ApiResponse<Photo[]>> => {
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

  // UPDATE PHOTO
  updatePhoto: async (
    id: string,
    updatedData: Partial<Photo>,
    accessToken?: string | null
  ): Promise<ApiResponse<Photo>> => {
    try {
      const response = await apiFetch<ApiResponse<Photo>>(PHOTO_PATHS.UPDATE_PHOTO(id), {
        method: 'PUT',
        body: JSON.stringify(updatedData),
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      return response;
    } catch (error) {
      console.error('Error updating photo:', error);
      throw error;
    }
  },

  //DELETE PHOTO
  deletePhoto: async (id: string, accessToken?: string | null): Promise<ApiResponse<null>> => {
    try {
      const response = await apiFetch<ApiResponse<null>>(PHOTO_PATHS.DELETE_PHOTO(id), {
        method: 'DELETE',
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      return response;
    } catch (error) {
      console.error(`Error deleting photo with ID ${id}:`, error);
      throw error;
    }
  },

  //GET RANDOM PHOTO
  getRandomPhoto: async (limit: number) => {
    try {
      const response = await apiFetch<ApiResponse<null>>(PHOTO_PATHS.GET_RANDOM_PHOTOS(limit), {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
