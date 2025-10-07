import axios from 'axios';
import { API_BASE_URL, PHOTO_PATHS } from 'lib/config';
import { ApiResponse, Photo, PopularPhoto } from 'types/photo';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

type Timeframe = 'all' | 'month' | 'week' | 'day';

export const photoService = {
  //GET ALL PHOTO

  getAllPhoto: async (
    searchQuery?: string,
    accessToken?: string | null,
    categories?: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<ApiResponse<Photo[]>> => {
    try {
      let path = PHOTO_PATHS.GETALL_PHOTOS;
      const params = new URLSearchParams();

      if (searchQuery) params.append('search', searchQuery);
      if (categories) params.append('categories', categories);

      params.append('limit', limit.toString());
      params.append('offset', offset.toString());

      path += `?${params.toString()}`;

      const headers: Record<string, string> = {};

      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const response = await apiClient.get<ApiResponse<Photo[]>>(path, { headers });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  //GET PHOTO
  getPhoto: async (id: string | number, accessToken?: string | null): Promise<Photo | null> => {
    try {
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await apiClient.get<ApiResponse<Photo>>(PHOTO_PATHS.GET_PHOTOS(id), {
        headers,
      });

      if (!response.data || !response.data.data) {
        return null;
      }

      return response.data.data;
    } catch (error: any) {
      console.warn('Photo could not be fetched (likely deleted):', error);
      return null;
    }
  },

  //ADD PHOTO
  addPhoto: async (formData: FormData, accessToken: string) => {
    try {
      const response = await apiClient.post(PHOTO_PATHS.ADD_PHOTO, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'API request failed';
      throw new Error(errorMessage);
    }
  },

  //USER PHOTOS
  getPhotoByUserId: async (userId: string, accessToken?: string | null): Promise<ApiResponse<Photo[]>> => {
    try {
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const path = PHOTO_PATHS.GET_PHOTOS_BY_USER_ID(userId);
      const response = await apiClient.get<ApiResponse<Photo[]>>(path, {
        headers,
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching user photos:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  //LIKED PHOTOS
  getLikedPhotos: async (userId: string, accessToken?: string | null): Promise<ApiResponse<Photo[]>> => {
    try {
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const path = PHOTO_PATHS.GET_LIKED_PHOTOS(userId);
      const response = await apiClient.get<ApiResponse<Photo[]>>(path, {
        headers,
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching liked photos:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // UPDATE PHOTO
  updatePhoto: async (
    id: string,
    updatedData: Partial<Photo>,
    accessToken?: string | null
  ): Promise<ApiResponse<Photo>> => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await apiClient.put<ApiResponse<Photo>>(PHOTO_PATHS.UPDATE_PHOTO(id), updatedData, { headers });

      return response.data;
    } catch (error: any) {
      console.error('Error updating photo:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  //DELETE PHOTO
  deletePhoto: async (id: string, accessToken?: string | null): Promise<ApiResponse<null>> => {
    try {
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await apiClient.delete<ApiResponse<null>>(PHOTO_PATHS.DELETE_PHOTO(id), {
        headers,
      });

      return response.data;
    } catch (error: any) {
      console.error(`Error deleting photo with ID ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  //GET RANDOM PHOTO
  getRandomPhoto: async (limit: number): Promise<ApiResponse<Photo[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Photo[]>>(PHOTO_PATHS.GET_RANDOM_PHOTOS(limit));
      return response.data;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  //Popular Photos
  getPopularPhotos: async (limit: number, timeframe: Timeframe): Promise<ApiResponse<PopularPhoto[]>> => {
    try {
      const path = PHOTO_PATHS.POPULAR_PHOTOS(limit, timeframe);
      const response = await apiClient.get<ApiResponse<PopularPhoto[]>>(path);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching popular photos:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
