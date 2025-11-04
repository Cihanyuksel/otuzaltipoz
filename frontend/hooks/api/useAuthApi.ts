import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import { AuthResponse, User } from '../../types/auth';

type SetAuthFn = (authData: AuthResponse['data'] | null) => void;

// Get User
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

// Update User
const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: FormData | { bio?: string; full_name?: string } }) => {
      return userService.updateUser(userId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
};

//Update Username
const useUpdateUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, username }: { userId: string; username: string }) => {
      return userService.updateUsername(userId, username);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
};

// Update Password
const useUpdatePassword = () => {
  return useMutation({
    mutationFn: ({
      userId,
      currentPassword,
      newPassword,
      confirmPassword,
    }: {
      userId: string;
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      return userService.updatePassword(userId, currentPassword, newPassword, confirmPassword);
    },
  });
};

// Delete User
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

// Auth hooks
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

export {
  useSignup,
  useLogin,
  useLogout,
  useGetUser,
  useUpdateUser,
  useUpdateUsername,
  useUpdatePassword,
  useDeleteUser,
};
