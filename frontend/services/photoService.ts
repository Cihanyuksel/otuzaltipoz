import { apiFetch } from '../hooks/apiFetch';
import { PHOTO_PATHS } from '../lib/config';


type PhotoResponse = {
  status: boolean;
  data: PhotoDocument;
};

export const photoService = {
  getAllPhoto: async (): Promise<PhotoDocument[]> => {
    try {
      const response = await apiFetch<PhotoDocument[]>(PHOTO_PATHS.GETALL_PHOTOS, {});
      return response
      
    } catch (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
  },

  getPhoto: async (id: string | number): Promise<PhotoDocument> => {
    try {
      const response = await apiFetch<PhotoResponse>(PHOTO_PATHS.GET_PHOTOS(id), {})
      const photo = response.data
  
      return photo
    } catch (error) {
      console.error('Error fetching photos:', error)
      throw error
    }
  }
};
