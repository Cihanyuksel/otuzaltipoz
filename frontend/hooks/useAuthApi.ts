import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';

const useSignup = () => useMutation({ mutationFn: authService.signup });
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
