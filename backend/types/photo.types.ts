import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  full_name: string;
  profile_img_url?: string;
  created_at: Date;
}

export interface ICategory {
  _id: Types.ObjectId;
  name: string;
}

export interface IPhotoDocument {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  photo_url: string;
  title: string;
  description?: string;
  tags?: string[];
  categories: Types.ObjectId[];
  created_at: Date;
}

export interface ILikeDocument {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  photo_id: Types.ObjectId;
  created_at: Date;
}

export interface ICommentDocument {
  _id: Types.ObjectId;
  text: string;
  user: Types.ObjectId;
  photo: Types.ObjectId;
  parentComment?: Types.ObjectId | null;
  isDeleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IPhotoPopulated
  extends Omit<IPhotoDocument, "user_id" | "categories"> {
  user_id: IUser;
  categories: ICategory[];
}

export interface IPhotoQueryFilter {
  title?: { $regex: string; $options: string };
  categories?: { $in: Types.ObjectId[] };
  created_at?: { $gte: Date };
  user_id?: string | Types.ObjectId;
  _id?: { $in: Types.ObjectId[] };
}

export interface IPhotoResponse {
  _id: Types.ObjectId;
  photo_url: string;
  title: string;
  description?: string;
  tags?: string[];
  categories: ICategory[];
  created_at: Date;
  user: IUser;
  likeCount: number;
  isLikedByMe: boolean;
}

export interface IPhotoWithCommentsResponse extends IPhotoResponse {
  commentCount: number;
}

export interface IPopularPhotoAggregateResult {
  _id: Types.ObjectId;
  photo_url: string;
  title: string;
  description?: string;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
  user: IUser;
  likeCount: number;
  commentCount: number;
  popularityScore: number;
}

export interface IGetAllPhotosResponse {
  totalRecords: number;
  currentRecords: number;
  status: boolean;
  data: IPhotoResponse[];
}

export interface IGetPhotoResponse {
  status: boolean;
  data: IPhotoResponse;
}

export interface IGetPhotosWithCommentsResponse {
  status: boolean;
  data: IPhotoWithCommentsResponse[];
}

export interface IGetPopularPhotosResponse {
  status: boolean;
  totalRecords: number;
  data: (IPopularPhotoAggregateResult & { isLikedByMe: boolean })[];
}

export interface ILikeAggregateResult {
  _id: Types.ObjectId;
  count: number;
}

export type LikeCountMap = Record<string, number>;
export type CommentCountMap = Record<string, number>;

export interface IPhotoQueryParams {
  limit?: string;
  offset?: string;
  search?: string;
  sort?: string;
  categories?: string;
  timeframe?: string;
}
