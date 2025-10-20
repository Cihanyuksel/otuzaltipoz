import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import { AuthResponse, User } from '../../types/auth';

type SetAuthFn = (authData: AuthResponse['data'] | null) => void;

const useGetUser = (userId: string | null) => {
  return useQuery<User | null>({
    queryKey: ['user', userId],
    queryFn: () => {
      if (!userId) {
        return null;
      }
      return userService.getUser(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const keysToClean = ['photos', 'likes', 'comments', 'ratings', 'users'];

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      return userService.deleteUser(userId);
    },
    onSuccess: () => {
      keysToClean.forEach((key) => {
        queryClient.removeQueries({ queryKey: [key] });
      });
    },
  });
};

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
    },
  });
};

export { useSignup, useLogin, useLogout, useGetUser, useDeleteUser };
