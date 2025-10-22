export type User = {
  _id: string;
  username: string;
  full_name?: string;
  email: string;
  bio?: string;
  role: 'user' | 'admin';
  profile_img_url?: string;
  is_active: boolean;
  created_at: Date;
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

export type ContactData = {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
};

export type MessageResponse = { success: false; message: string };
