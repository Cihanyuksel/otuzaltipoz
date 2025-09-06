import { ApiResponse, Photo } from 'types/photo';
import { apiFetch } from '../hooks/apiFetch';
import { PHOTO_PATHS } from '../lib/config';


type PhotoResponse = {
  status: boolean;
  data: Photo;
};

export const photoService = {
  getAllPhoto: async (): Promise<ApiResponse<Photo[]>> => {
    try {
      const response = await apiFetch<ApiResponse<Photo[]>>(PHOTO_PATHS.GETALL_PHOTOS, {});
      return response
      
    } catch (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
  },

  getPhoto: async (id: string | number): Promise<Photo> => {
    try {
      const response = await apiFetch<ApiResponse<Photo>>(PHOTO_PATHS.GET_PHOTOS(id), {})       
      const photo = response.data
      return photo
    } catch (error) {
      console.error('Error fetching photos:', error)
      throw error
    }
}
};
