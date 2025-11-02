//nextjs and react
import Image from 'next/image';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlineDotsVertical as VerticalTreeDots } from 'react-icons/hi';

//project-files
import Button from '../common/button';
import UserDeleteSuccessModal from '../common/success-modal';
import UserDeleteConfirmModal from '../common/confirm-modal';
import { useDeleteUser } from '@/hooks/api/useAuthApi';
import { useOutsideClick } from '@/hooks/ui/useOutsideClick';
import { useAuth } from '@/context/AuthContext';
import { canManage as canManageUser, isAdmin } from 'lib/permission';
import { User } from 'types/auth';

interface IProfileHeader {
  user: User;
  imageUrl: string;
  isOwner: boolean;
  onEditProfileClick?: () => void;
  onAdminSettingsClick?: () => void;
}

type ActionItem =
  | {
      name: 'divider';
    }
  | {
      name: string;
      handler: () => void;
      type: 'default' | 'danger';
    };

const ProfileHeader = ({ user, imageUrl, isOwner, onEditProfileClick, onAdminSettingsClick }: IProfileHeader) => {
  const { user: currentUser, setAuth } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutate: deleteUser, isPending, error, isSuccess } = useDeleteUser();

  useOutsideClick(dropdownRef, () => setShowDropdown(false), showDropdown);

  // Memoized values
  const canDeleteAccount = useMemo(() => canManageUser(currentUser?.role, isOwner), [currentUser?.role, isOwner]);
  const isAdminValue = useMemo(() => isAdmin(currentUser ?? undefined), [currentUser]);

  // Handlers
  const handleSignOut = useCallback(() => {
    setAuth(null);
    router.push('/login');
    setShowDropdown(false);
  }, [setAuth, router]);

  const handleEditProfile = useCallback(() => {
    if (onEditProfileClick) {
      onEditProfileClick();
    } else {
      router.push('/profile/edit');
    }
    setShowDropdown(false);
  }, [onEditProfileClick, router]);

  const handleDeleteAccount = useCallback(() => {
    setShowConfirmModal(true);
    setShowDropdown(false);
  }, []);

  const handleAdminSettings = useCallback(() => {
    if (onAdminSettingsClick) {
      onAdminSettingsClick();
    } else {
      router.push('/admin/settings');
    }
    setShowDropdown(false);
  }, [onAdminSettingsClick, router]);

  const handleConfirmDelete = useCallback(() => {
    deleteUser({ userId: user._id });
  }, [deleteUser, user._id]);

  const handleCloseConfirmModal = useCallback(() => {
    if (!isPending) setShowConfirmModal(false);
  }, [isPending]);

  const handleCloseSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
    if (isOwner) {
      setAuth(null);
    }
    router.push('/');
  }, [isOwner, setAuth, router]);

  // Action items
  const actionItems = useMemo(() => {
    const items: (ActionItem | false)[] = [
      isOwner && {
        name: 'Kullanıcı Bilgilerini Düzenle',
        handler: handleEditProfile,
        type: 'default' as const,
      },
      isAdminValue && {
        name: 'Admin Ayarları',
        handler: handleAdminSettings,
        type: 'default' as const,
      },
      isOwner && {
        name: 'Çıkış Yap',
        handler: handleSignOut,
        type: 'default' as const,
      },
      (isOwner || isAdminValue) && { name: 'divider' as const },
      canDeleteAccount && {
        name: 'Hesabı Sil',
        handler: handleDeleteAccount,
        type: 'danger' as const,
      },
    ];

    const filtered = items.filter(Boolean) as ActionItem[];

    return filtered.filter((item, index, arr) => {
      if (item.name !== 'divider') return true;
      const hasNext = arr.slice(index + 1).some((i) => i.name !== 'divider');
      const hasPrev = arr.slice(0, index).some((i) => i.name !== 'divider');
      return hasNext && hasPrev;
    });
  }, [isOwner, isAdmin, canDeleteAccount, handleEditProfile, handleAdminSettings, handleSignOut, handleDeleteAccount]);

  // Success handler
  useEffect(() => {
    if (isSuccess) {
      setShowSuccessModal(true);
      const timer = setTimeout(() => {
        if (isOwner) {
          setAuth(null);
        }
        router.push('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isOwner, setAuth, router]);

  const deleteMessage = (
    <div>
      <p className="mb-2">
        <strong>@{user.username}</strong> hesabını silmek istediğinizden emin misiniz?
      </p>
      <p className="text-red-600 font-medium">Bu işlem geri alınamaz ve tüm veriler kalıcı olarak silinecektir.</p>
    </div>
  );

  const successMessage = `@${user.username} hesabı ve tüm verileri başarıyla silindi.${
    isOwner ? ' 2 saniye sonra ana sayfaya yönlendirileceksiniz.' : ''
  }`;

  const ProfileInfo = useMemo(
    () => (
      <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
        <div className="h-32 w-32 flex-shrink-0 rounded-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${user.full_name} profil resmi`}
            width={128}
            height={128}
            className="object-cover"
            priority
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{user.full_name}</h1>
          <p className="text-md font-bold text-[#ef7464]">@{user.username}</p>
          {user.bio && <p className="mt-2 text-base text-gray-500">{user.bio}</p>}
        </div>
      </div>
    ),
    [imageUrl, user.full_name, user.username, user.bio]
  );

  if (actionItems.length === 0) {
    return <div className="relative flex flex-col items-center gap-6 md:flex-row md:gap-12">{ProfileInfo}</div>;
  }

  return (
    <>
      <div className="relative flex flex-col items-center gap-6 md:flex-row md:gap-12">
        {ProfileInfo}

        <div className="absolute top-0 right-0" ref={dropdownRef}>
          <Button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-100"
            variant="tertiary"
            aria-label="Daha Fazla Aksiyon"
            aria-expanded={showDropdown}
            aria-haspopup="true"
            disabled={isPending}
          >
            <VerticalTreeDots className="h-6 w-6 text-gray-500" />
          </Button>

          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10"
              role="menu"
              aria-orientation="vertical"
            >
              <div className="py-1">
                <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 border-b">Hesap Yönetimi</h3>
                {actionItems.map((item, index) => {
                  if (item.name === 'divider') {
                    return <hr key={`divider-${index}`} className="my-1 border-gray-100" />;
                  }

                  const actionItem = item as Extract<ActionItem, { handler: () => void }>;
                  const isDeleteAction = actionItem.name === 'Hesabı Sil';
                  const isDisabled = isDeleteAction && isPending;

                  return (
                    <button
                      key={actionItem.name}
                      onClick={actionItem.handler}
                      className={`group flex items-center w-full px-4 py-2 text-sm text-left transition-colors ${
                        actionItem.type === 'danger'
                          ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isDisabled}
                      role="menuitem"
                    >
                      {isDeleteAction && isPending ? 'Siliniyor...' : actionItem.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <UserDeleteConfirmModal
        isOpen={showConfirmModal && !isSuccess}
        onClose={handleCloseConfirmModal}
        title="Hesabı Sil"
        message={deleteMessage}
        onConfirm={handleConfirmDelete}
        confirmButtonText={isPending ? 'Siliniyor...' : 'Hesabı Sil'}
        isConfirming={isPending}
        error={error?.message || null}
        modalType="delete"
      />

      <UserDeleteSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="Hesap Başarıyla Silindi"
        message={successMessage}
        buttonText={isOwner ? 'Hemen Ana Sayfaya Git' : 'Ana Sayfaya Dön'}
      />
    </>
  );
};

export default ProfileHeader;
