export interface IRating {
  _id: string;
  user_id: string;
  photo_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
  __v?: number;
}

export interface IRatePhotoResponse {
  message: string;
  rating: IRating;
  averageRating: number;
  totalVotes: number;
}

export interface IGetRatingsResponse {
  averageRating: number;
  totalVotes: number;
}
