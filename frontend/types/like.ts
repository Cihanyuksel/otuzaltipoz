export type UserWhoLiked = {
  _id: string;
  username: string;
  role: string;
  profile_img_url?: string;
};

export type GetLikesResponse = {
  isLikedByMe: boolean;
  likeCount: number;
  photoId: string;
  usersWhoLiked: UserWhoLiked[];
};

export type ToggleLikeResponse = {
  isLikedByMe: boolean;
  likeCount: number;
  message: string;
};
