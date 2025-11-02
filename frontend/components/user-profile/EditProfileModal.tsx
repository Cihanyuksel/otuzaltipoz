'use client';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoClose as CloseIcon } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { User } from 'types/auth';
import { useUpdateUser, useUpdateUsername, useUpdatePassword } from '@/hooks/api/useAuthApi';
import { useOutsideClick } from '@/hooks/ui/useOutsideClick';
import Button from '../common/button';
import Input from '../common/input';
import {
  profileUpdateSchema,
  ProfileUpdateFormValues,
  usernameUpdateSchema,
  UsernameUpdateFormValues,
  passwordUpdateSchema,
  PasswordUpdateFormValues,
} from 'lib/schemas';

interface IEditProfileModal {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

type TabType = 'profile' | 'username' | 'password';

const EditProfileModal = ({ isOpen, onClose, user }: IEditProfileModal) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const modalRef = useRef<HTMLDivElement>(null);

  // Forms
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
  //END Forms

  // Mutations
  const updateUserMutation = useUpdateUser();
  const updateUsernameMutation = useUpdateUsername();
  const updatePasswordMutation = useUpdatePassword();
  // END Mutations

  const canChangeUsername = (user.username_change_count || 0) < 1;

  // Profile Update
  const onProfileSubmit = (data: ProfileUpdateFormValues) => {
    updateUserMutation.mutate(
      { userId: user._id, data },
      {
        onSuccess: () => {
          toast.success('Profil başarıyla güncellendi!', { position: 'top-right', autoClose: 3000 });
          onClose();
        },
        onError: (error: any) => {
          const errorMessage = error.message || 'Profil güncellenemedi';
          profileForm.setError('root', { message: errorMessage });
        },
      }
    );
  };

  // Username Update
  const onUsernameSubmit = (data: UsernameUpdateFormValues) => {
    updateUsernameMutation.mutate(
      { userId: user._id, username: data.username },
      {
        onSuccess: () => {
          toast.success('✅ Kullanıcı adı başarıyla güncellendi! Bu işlemi bir daha yapamazsınız.', {
            position: 'top-right',
            autoClose: 4000,
          });
          usernameForm.reset();
          onClose();
        },
        onError: (error: any) => {
          const errorMessage = error.message || 'Kullanıcı adı güncellenemedi';
          usernameForm.setError('username', { message: errorMessage });
        },
      }
    );
  };

  // Password Update
  const onPasswordSubmit = (data: PasswordUpdateFormValues) => {
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
          passwordForm.reset();
          onClose();
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
  };

  const handleClose = () => {
    profileForm.reset();
    usernameForm.reset();
    passwordForm.reset();
    onClose();
  };

  const isPending =
    updateUserMutation.isPending || updateUsernameMutation.isPending || updatePasswordMutation.isPending;

  useOutsideClick(modalRef, handleClose, isOpen && !isPending);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f5f1ea]/50">
      <div ref={modalRef} className="w-full max-w-lg bg-white rounded-lg shadow-xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#ef7464]">
          <h3 className="text-lg font-medium text-gray-100">Profili Düzenle</h3>
          <button
            type="button"
            className="rounded-md p-2 cursor-pointer text-white hover:text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={handleClose}
            disabled={isPending}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {['profile', 'username', 'password'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab as TabType)}
              disabled={isPending}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab ? 'text-[#ef7464] border-b-2 border-[#ef7464]' : 'text-gray-500 hover:text-gray-700'
              } ${isPending ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {tab === 'profile' ? 'Profil' : tab === 'username' ? 'Kullanıcı Adı' : 'Şifre'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <Input
                id="full_name"
                type="text"
                name="full_name"
                register={profileForm.register}
                error={profileForm.formState.errors.full_name?.message}
                label="İsim Soyisim"
                disabled={isPending}
                placeholder="İsim Soyisim"
              />
              <div className="flex flex-col w-full">
                <label htmlFor="bio" className="mb-1 text-sm font-medium text-gray-700">
                  Biyografi
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  {...profileForm.register('bio')}
                  disabled={isPending}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ef7464] focus:border-[#ef7464] disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                  placeholder="Kendinizden bahsedin..."
                />
                {profileForm.formState.errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.bio.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{profileForm.watch('bio')?.length || 0} / 500 karakter</p>
              </div>

              {profileForm.formState.errors.root && (
                <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">
                  {profileForm.formState.errors.root.message}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button onClick={handleClose} type="button" variant="tertiary" size="medium" disabled={isPending}>
                  İptal
                </Button>
                <Button disabled={isPending} type="submit" variant="primary" size="medium">
                  {updateUserMutation.isPending ? 'Kaydediliyor...' : 'Profili Güncelle'}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'username' && (
            <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Mevcut Kullanıcı Adı:</strong> @{user.username}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {canChangeUsername
                    ? '⚠️ Kullanıcı adını sadece 1 kez değiştirebilirsiniz!'
                    : '❌ Kullanıcı adı değiştirme hakkınız doldu'}
                </p>
              </div>

              {canChangeUsername ? (
                <>
                  <Input
                    id="username"
                    type="text"
                    name="username"
                    register={usernameForm.register}
                    error={usernameForm.formState.errors.username?.message}
                    label="Yeni Kullanıcı Adı"
                    disabled={isPending}
                    placeholder="yeni_kullanici_adi"
                  />

                  {usernameForm.formState.errors.root && (
                    <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">
                      {usernameForm.formState.errors.root.message}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button onClick={handleClose} type="button" variant="tertiary" size="medium" disabled={isPending}>
                      İptal
                    </Button>
                    <Button disabled={isPending} type="submit" variant="primary" size="medium">
                      {updateUsernameMutation.isPending ? 'Değiştiriliyor...' : 'Kullanıcı Adını Değiştir'}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Kullanıcı adı değiştirme hakkınız kalmadı.</p>
                </div>
              )}
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <Input
                id="currentPassword"
                type="password"
                name="currentPassword"
                register={passwordForm.register}
                error={passwordForm.formState.errors.currentPassword?.message}
                label="Mevcut Şifre"
                disabled={isPending}
                placeholder="Mevcut şifreniz"
              />

              <Input
                id="newPassword"
                type="password"
                name="newPassword"
                register={passwordForm.register}
                error={passwordForm.formState.errors.newPassword?.message}
                label="Yeni Şifre"
                disabled={isPending}
                placeholder="En az 6 karakter"
              />

              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                register={passwordForm.register}
                error={passwordForm.formState.errors.confirmPassword?.message}
                label="Yeni Şifre (Tekrar)"
                disabled={isPending}
                placeholder="Yeni şifrenizi tekrar girin"
              />

              {passwordForm.formState.errors.root && (
                <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">
                  {passwordForm.formState.errors.root.message}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button onClick={handleClose} type="button" variant="tertiary" size="medium" disabled={isPending}>
                  İptal
                </Button>
                <Button disabled={isPending} type="submit" variant="primary" size="medium">
                  {updatePasswordMutation.isPending ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;

/*refactor etmemiz lazım.
toast sadece başarılı mesajlarda gözüksün. mevcut şifre kullanıcının giriş yaptığı şifre ile eşleşmiyorsa 
formun altında şifrenizi doğru girinizi veya benzeri hata mesajı yazsın, yeni şifre ve confirm şifre eşleşmeiyorsa
 uyarı mesajı formda yazsın. bunların hepsi doğru gerçekleşirse success toast mesajı gözüksün. 
 şifreniz başarılı şekilde güncellendi gibi. */
