import { apiFetch } from '@/hooks/apiFetch';

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
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    const response: IRatePhotoResponse = await apiFetch(`/photos/${photoId}/rate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ rating }),
    });
    return response;
  },

  getRatings: async (photoId: string): Promise<IGetRatingsResponse> => {
    try {
      const response: IGetRatingsResponse = await apiFetch(`/photos/${photoId}/ratings`, {
        method: 'GET',
      });
      return response;
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(`Oylamalar alınırken hata oluştu: ${error.message}`);
      }
      throw new Error('Oylamalar alınırken beklenmeyen bir hata oluştu.');
    }
  },
};
