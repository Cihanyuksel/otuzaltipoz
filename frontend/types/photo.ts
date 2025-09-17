import { User } from "./auth";

export interface ApiResponse<T> {
  data: T; 
  status: boolean;
  total: number;
}

export type OmittedUser = Omit<
  User,
  'id' | 'fullname' | 'role' | 'is_active'
> & {
  _id: string;
  created_at: string;
};

export interface Photo {
  _id: string;
  created_at: string;
  description: string;
  photo_url: string;
  tags: string[];
  title: string;
  __v: number;
  user: OmittedUser;
  likes: number;
  likeCount: number,
  isLikedByMe: boolean
}