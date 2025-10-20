import { axiosInstance } from 'lib/axiosInstance';
import { PHOTO_PATHS } from 'lib/config';
import { ApiResponse, Photo, PopularPhoto } from 'types/photo';

type Timeframe = 'all' | 'month' | 'week' | 'day';

export const photoService = {
  //GET ALL PHOTO
  getAllPhoto: async ({
    searchQuery = '',
    categories = '',
    limit = 10,
    offset = 0,
  }: {
    searchQuery?: string;
    categories?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<Photo[]>> => {
    let path = PHOTO_PATHS.GETALL_PHOTOS;
    const params = new URLSearchParams();

    if (searchQuery) params.append('search', searchQuery);
    if (categories) params.append('categories', categories);

    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    path += `?${params.toString()}`;

    const response = await axiosInstance.get<ApiResponse<Photo[]>>(path);
    return response.data;
  },

  //GET PHOTO
  getPhoto: async (id: string | number): Promise<Photo | null> => {
    const response = await axiosInstance.get<ApiResponse<Photo>>(PHOTO_PATHS.GET_PHOTOS(id));
    return response.data.data;
  },

  //ADD PHOTO
  addPhoto: async (formData: FormData) => {
    const response = await axiosInstance.post(PHOTO_PATHS.ADD_PHOTO, formData);
    return response.data;
  },

  //USER PHOTOS
  getPhotoByUserId: async (userId: string): Promise<ApiResponse<Photo[]>> => {
    const response = await axiosInstance.get<ApiResponse<Photo[]>>(PHOTO_PATHS.GET_PHOTOS_BY_USER_ID(userId));
    return response.data;
  },

  //LIKED PHOTOS
  getLikedPhotos: async (userId: string): Promise<ApiResponse<Photo[]>> => {
    const response = await axiosInstance.get<ApiResponse<Photo[]>>(PHOTO_PATHS.GET_LIKED_PHOTOS(userId));
    return response.data;
  },

  // UPDATE PHOTO
  updatePhoto: async (id: string, updatedData: Partial<Photo>): Promise<ApiResponse<Photo>> => {
    const response = await axiosInstance.put<ApiResponse<Photo>>(PHOTO_PATHS.UPDATE_PHOTO(id), updatedData);
    return response.data;
  },

  //DELETE PHOTO
  deletePhoto: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(PHOTO_PATHS.DELETE_PHOTO(id));
    return response.data;
  },

  //GET RANDOM PHOTO
  getRandomPhoto: async (limit: number): Promise<ApiResponse<Photo[]>> => {
    const response = await axiosInstance.get<ApiResponse<Photo[]>>(PHOTO_PATHS.GET_RANDOM_PHOTOS(limit));
    return response.data;
  },

  //Popular Photos
  getPopularPhotos: async (limit: number, timeframe: Timeframe): Promise<ApiResponse<PopularPhoto[]>> => {
    const path = PHOTO_PATHS.POPULAR_PHOTOS(limit, timeframe);
    const response = await axiosInstance.get<ApiResponse<PopularPhoto[]>>(path);
    return response.data;
  },
};
