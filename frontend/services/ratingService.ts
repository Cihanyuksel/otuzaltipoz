import { axiosInstance } from 'lib/axiosInstance';

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
  ratePhoto: async (photoId: string, rating: number, accessToken: string): Promise<IRatePhotoResponse> => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axiosInstance.post(`/photos/${photoId}/rate`, { rating }, { headers });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Rating request failed';
      throw new Error(errorMessage);
    }
  },

  getRatings: async (photoId: string): Promise<IGetRatingsResponse> => {
    try {
      const response = await axiosInstance.get(`/photos/${photoId}/ratings`);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Oylamalar alınırken beklenmeyen bir hata oluştu.';
      throw new Error(`Oylamalar alınırken hata oluştu: ${errorMessage}`);
    }
  },
};
