import axios from 'axios';
import { API_BASE_URL } from 'lib/config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

//rating
export interface IRating {
  _id: string;
  user_id: string;
  photo_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
  __v?: number;
}

// ratePhoto return type
export interface IRatePhotoResponse {
  message: string;
  rating: IRating;
  accessToken: string | null;
}

// getRatings return type
export interface IGetRatingsResponse {
  averageRating: number;
  totalVotes: number;
}

export const ratingService = {
  ratePhoto: async (
    photoId: string,
    rating: number,
    accessToken: string
  ): Promise<IRatePhotoResponse> => {
    try {

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }

      const response = await apiClient.post(`/photos/${photoId}/rate`, { rating }, { headers });
      return response.data;

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Rating request failed';
      throw new Error(errorMessage);
    }
  },

  getRatings: async (photoId: string): Promise<IGetRatingsResponse> => {
    try {
      const response = await apiClient.get(`/photos/${photoId}/ratings`);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Oylamalar alınırken beklenmeyen bir hata oluştu.';
      throw new Error(`Oylamalar alınırken hata oluştu: ${errorMessage}`);
    }
  },
};
