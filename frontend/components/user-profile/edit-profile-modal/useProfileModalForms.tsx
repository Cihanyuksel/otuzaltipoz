import { useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { User } from 'types/auth';
import { useUpdateUser, useUpdateUsername, useUpdatePassword } from '@/hooks/api/useAuthApi';
import {
  profileUpdateSchema,
  ProfileUpdateFormValues,
  usernameUpdateSchema,
  UsernameUpdateFormValues,
  passwordUpdateSchema,
  PasswordUpdateFormValues,
} from 'lib/schemas';

interface IUseProfileModalForms {
  user: User;
  onClose: () => void;
}

export const useProfileModalForms = ({ user, onClose }: IUseProfileModalForms) => {
  const profileForm = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: { full_name: user.full_name || '', bio: user.bio || '' },
    mode: 'onChange',
  });

  const usernameForm = useForm<UsernameUpdateFormValues>({
    resolver: zodResolver(usernameUpdateSchema),
    defaultValues: { username: '' },
    mode: 'onChange',
  });

  const passwordForm = useForm<PasswordUpdateFormValues>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const updateUserMutation = useUpdateUser();
  const updateUsernameMutation = useUpdateUsername();
  const updatePasswordMutation = useUpdatePassword();

  const canChangeUsername = useMemo(() => (user.username_change_count || 0) < 1, [user.username_change_count]);

  const isPending = useMemo(
    () => updateUserMutation.isPending || updateUsernameMutation.isPending || updatePasswordMutation.isPending,
    [updateUserMutation.isPending, updateUsernameMutation.isPending, updatePasswordMutation.isPending]
  );

  const handleCloseAndReset = useCallback(() => {
    profileForm.reset();
    usernameForm.reset();
    passwordForm.reset();
    onClose();
  }, [onClose, profileForm, usernameForm, passwordForm]);

  const onProfileSubmit = useCallback(
    (data: ProfileUpdateFormValues) => {
      updateUserMutation.mutate(
        { userId: user._id, data },
        {
          onSuccess: () => {
            toast.success('Profil başarıyla güncellendi!', { position: 'top-right', autoClose: 3000 });
            handleCloseAndReset();
          },
          onError: (error: any) => {
            const errorMessage = error.message || 'Profil güncellenemedi';
            profileForm.setError('root', { message: errorMessage });
          },
        }
      );
    },
    [updateUserMutation, user._id, profileForm, handleCloseAndReset]
  );

  const onUsernameSubmit = useCallback(
    (data: UsernameUpdateFormValues) => {
      updateUsernameMutation.mutate(
        { userId: user._id, username: data.username },
        {
          onSuccess: () => {
            toast.success('✅ Kullanıcı adı başarıyla güncellendi! Bu işlemi bir daha yapamazsınız.', {
              position: 'top-right',
              autoClose: 4000,
            });
            handleCloseAndReset();
          },
          onError: (error: any) => {
            const errorMessage = error.message || 'Kullanıcı adı güncellenemedi';
            usernameForm.setError('username', { message: errorMessage });
          },
        }
      );
    },
    [updateUsernameMutation, user._id, usernameForm, handleCloseAndReset]
  );

  const onPasswordSubmit = useCallback(
    (data: PasswordUpdateFormValues) => {
      updatePasswordMutation.mutate(
        {
          userId: user._id,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        {
          onSuccess: () => {
            toast.success('Şifre başarıyla güncellendi!', { position: 'top-right', autoClose: 3000 });
            handleCloseAndReset();
          },
          onError: (error: any) => {
            const errorMessage = error.message || 'Şifre güncellenemedi';

            if (errorMessage.includes('incorrect')) {
              passwordForm.setError('currentPassword', { message: 'Mevcut şifreniz hatalı. Lütfen kontrol ediniz.' });
            } else if (errorMessage.includes('match')) {
              passwordForm.setError('confirmPassword', { message: 'Yeni şifreler eşleşmiyor.' });
            } else if (errorMessage.includes('different')) {
              passwordForm.setError('newPassword', { message: 'Yeni şifre mevcut şifreden farklı olmalıdır.' });
            } else {
              passwordForm.setError('root', { message: errorMessage });
            }
          },
        }
      );
    },
    [updatePasswordMutation, user._id, passwordForm, handleCloseAndReset]
  );

  return {
    isPending,
    canChangeUsername,
    handleCloseAndReset,

    profileForm: {
      ...profileForm,
      onSubmit: onProfileSubmit,
      isSubmitting: updateUserMutation.isPending,
    },
    usernameForm: {
      ...usernameForm,
      onSubmit: onUsernameSubmit,
      isSubmitting: updateUsernameMutation.isPending,
    },
    passwordForm: {
      ...passwordForm,
      onSubmit: onPasswordSubmit,
      isSubmitting: updatePasswordMutation.isPending,
    },
  };
};
