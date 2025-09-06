import { User } from "./auth";

/* type PhotoDocument = {
  status: true;
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
    created_at: string;
    profile_img_url: string;
  };
  photo_url: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  __v: number;
  likes?: number;
}; */


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
}