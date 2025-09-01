export interface SignupRequest {
  username: string;
  fullname: string;
  email: string;
  password: string;
}

export type LoginRequest = Omit<SignupRequest, 'fullname' | 'username'>;

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullname: string;
  };
}

type MessageResponse = { status: false; message: string };

export const authService = {
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const res = await fetch('http://localhost:4000/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: data.username,
        full_name: data.fullname,
        email: data.email,
        password: data.password,
      }),
    });

    if (!res.ok) {
      const err = (await res.json()) as MessageResponse;
      throw new Error(err.message || 'Signup failed');
    }
    return res.json() as Promise<AuthResponse>;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await fetch('http://localhost:4000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = (await res.json()) as MessageResponse;
      throw new Error(err.message || 'Login failed');
    }
    return res.json() as Promise<AuthResponse>;
  },

  logout: async (): Promise<MessageResponse> => {
    const res = await fetch('http://localhost:4000/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      const err = (await res.json()) as MessageResponse;
      throw new Error(err.message || 'Logout failed');
    }
    return res.json() as Promise<MessageResponse>;
  },

  refresh: async (): Promise<AuthResponse> => {
    const res = await fetch('http://localhost:4000/api/v1/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to refresh');
    return res.json() as Promise<AuthResponse>;
  },
};
