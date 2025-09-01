export type User = {
  id: string;
  username: string;
  fullname?: string;
  email: string;
  role?: string;
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
