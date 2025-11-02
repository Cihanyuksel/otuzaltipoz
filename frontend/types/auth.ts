export interface User {
  _id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin' | 'moderator';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  profile_img_url?: string;
  bio?: string;
  username_change_count?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  username: string;
  password: string;
  full_name: string;
  bio?: string;
  profile_img?: File;
}
