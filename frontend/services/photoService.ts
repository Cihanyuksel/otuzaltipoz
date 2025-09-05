import { apiFetch } from '../hooks/apiFetch';
import { PHOTO_PATHS } from '../lib/config';

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
};
