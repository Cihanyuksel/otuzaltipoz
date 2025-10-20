import { axiosInstance } from 'lib/axiosInstance';
import { LIKE_PATH } from 'lib/config';
import { GetLikesResponse, ToggleLikeResponse } from 'types/like';

export const likeService = {
  toggleLike: async (photoId: string): Promise<ToggleLikeResponse> => {
    const { data } = await axiosInstance.post(LIKE_PATH.TOGGLE_LIKE(photoId));
    return data;
  },

  getLikes: async (photoId: string): Promise<GetLikesResponse> => {
    const { data } = await axiosInstance.get(LIKE_PATH.GET_LIKES(photoId));
    return data;
  },
};
