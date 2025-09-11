import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { AuthResponse } from '../types/auth';

type SetAuthFn = (authData: AuthResponse['data'] | null) => void;

const useSignup = () =>
  useMutation<AuthResponse, any, FormData>({
    mutationFn: (formData: FormData) => authService.signup(formData),
  });

const useLogin = () => useMutation({ mutationFn: authService.login });

const useLogout = (fn: SetAuthFn) => {
  return useMutation({ 
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      fn(null);
    }
  });
};

const useRefresh = () =>
  useQuery({
    queryKey: ['auth', 'refresh'],
    queryFn: authService.refresh,
    retry: false,
    refetchOnWindowFocus: false,
  });

export { useSignup, useLogin, useLogout, useRefresh };
