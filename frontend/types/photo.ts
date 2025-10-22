import { Category } from "@/hooks/api/useCategories";
import { User } from "./auth";

export interface ApiResponse<T> {
  data: T; 
  status: boolean;
  total: number;
  totalRecords: number
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
  photo_url: string;
  title: string;
  description: string;
  tags?: string[];
  categories: Category[];
  created_at: Date;
  updated_at: Date;
  user: User;
  likeCount: number;
  isLikedByMe: boolean;
  averageRating: number;    
  totalVotes: number; 
  commentCount?: number;      
}

export interface PopularPhoto {
  _id: string;
  photo_url: string;
  title?: string;
  likeCount: number;
  commentCount: number;
  user: {
    _id: string;
    username: string;
    full_name: string;
    profile_img_url?: string;
  };
}