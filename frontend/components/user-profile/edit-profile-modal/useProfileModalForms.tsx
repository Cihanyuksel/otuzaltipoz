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
  profileOwner: User;
  onEditClose: () => void;
}

export const useProfileModalForms = ({ profileOwner, onEditClose }: IUseProfileModalForms) => {
  const profileForm = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: profileOwner.full_name || '',
      bio: profileOwner.bio || '',
      removeProfileImg: false,
    },
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

  const canChangeUsername = useMemo(
    () => (profileOwner.username_change_count || 0) < 1,
    [profileOwner.username_change_count]
  );

  const isPending = useMemo(
    () => updateUserMutation.isPending || updateUsernameMutation.isPending || updatePasswordMutation.isPending,
    [updateUserMutation.isPending, updateUsernameMutation.isPending, updatePasswordMutation.isPending]
  );

  const handleCloseAndReset = useCallback(() => {
    profileForm.reset();
    usernameForm.reset();
    passwordForm.reset();
    onEditClose();
  }, [onEditClose, profileForm, usernameForm, passwordForm]);

  const onProfileSubmit = useCallback(
    (data: ProfileUpdateFormValues) => {
      const formData = new FormData();

      formData.append('full_name', data.full_name);
      if (data.bio) {
        formData.append('bio', data.bio);
      }

      // Handle profile image
      if (data.removeProfileImg) {
        formData.append('removeProfileImg', 'true');
      } else if (data.profile_img && data.profile_img.length > 0) {
        formData.append('profile_img', data.profile_img[0]);
      }

      updateUserMutation.mutate(
        { userId: profileOwner._id, data: formData },
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
    [updateUserMutation, profileOwner._id, profileForm, handleCloseAndReset]
  );

  const onUsernameSubmit = useCallback(
    (data: UsernameUpdateFormValues) => {
      updateUsernameMutation.mutate(
        { userId: profileOwner._id, username: data.username },
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
    [updateUsernameMutation, profileOwner._id, usernameForm, handleCloseAndReset]
  );

  const onPasswordSubmit = useCallback(
    (data: PasswordUpdateFormValues) => {
      updatePasswordMutation.mutate(
        {
          userId: profileOwner._id,
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
    [updatePasswordMutation, profileOwner._id, passwordForm, handleCloseAndReset]
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
