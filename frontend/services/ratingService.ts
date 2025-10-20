import { axiosInstance } from 'lib/axiosInstance';
import { RATING_PATH } from 'lib/config';
import { IGetRatingsResponse, IRatePhotoResponse } from 'types/rating';

export const ratingService = {
  ratePhoto: async (photoId: string, rating: number): Promise<IRatePhotoResponse> => {
    const response = await axiosInstance.post(RATING_PATH.RATE_PHOTO(photoId), { rating });
    return response.data;
  },

  getRatings: async (photoId: string): Promise<IGetRatingsResponse> => {
    const response = await axiosInstance.get(RATING_PATH.GET_RATINGS(photoId));
    return response.data;
  },
};
