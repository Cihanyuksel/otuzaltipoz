export type User = {
  id: string;
  username: string;
  full_name?: string;
  email: string;
  role: 'user' | 'admin';
  profile_img_url?: string;
  is_active: boolean
};

export interface SignupRequest {
  username: string;
  fullname: string;
  email: string;
  password: string;
}

export type LoginRequest = Omit<SignupRequest, 'fullname' | 'username'>;

export type AuthData = {
  user: User;
  accessToken: string;
};

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

export type MessageResponse = { success: false; message: string };
