import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { AuthResponse } from '../types/auth';

const useSignup = () =>
  useMutation<AuthResponse, any, FormData>({
    mutationFn: (formData: FormData) => authService.signup(formData),
  });
const useLogin = () => useMutation({ mutationFn: authService.login });
const useLogout = () => useMutation({ mutationFn: authService.logout });
const useRefresh = () =>
  useQuery({
    queryKey: ['auth', 'refresh'],
    queryFn: authService.refresh,
    retry: false,
    refetchOnWindowFocus: false,
  });

export { useSignup, useLogin, useLogout, useRefresh };
