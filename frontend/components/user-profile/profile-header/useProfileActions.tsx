// nextjs and react
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

//project files
import { useDeleteUser } from '@/hooks/api/useAuthApi';
import { useOutsideClick } from '@/hooks/ui/useOutsideClick';
import { useAuth } from '@/context/AuthContext';
import { canManage as canManageUser, isAdmin } from 'lib/permission';
import { User } from 'types/auth';

export type ActionItem =
  | {
      name: 'divider';
    }
  | {
      name: string;
      handler: () => void;
      type: 'default' | 'danger';
    };

interface UseProfileActionsProps {
  user: User;
  isOwner: boolean;
  onEditProfileClick?: () => void;
  onAdminSettingsClick?: () => void;
}

export const useProfileActions = ({
  user,
  isOwner,
  onEditProfileClick,
  onAdminSettingsClick,
}: UseProfileActionsProps) => {
  const { user: currentUser, setAuth } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutate: deleteUser, isPending, error, isSuccess } = useDeleteUser();

  useOutsideClick(dropdownRef, () => setShowDropdown(false), showDropdown);

  // Memoized
  const canDeleteAccount = useMemo(() => canManageUser(currentUser?.role, isOwner), [currentUser?.role, isOwner]);
  const isAdminValue = useMemo(() => isAdmin(currentUser ?? undefined), [currentUser]);

  // Handler Function
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

  // Action Items
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
  }, [
    isOwner,
    isAdminValue,
    canDeleteAccount,
    handleEditProfile,
    handleAdminSettings,
    handleSignOut,
    handleDeleteAccount,
  ]);

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

  return {
    actionItems,
    dropdownRef,
    showDropdown,
    setShowDropdown,
    isPending,
    error,

    confirmModal: {
      isOpen: showConfirmModal && !isSuccess,
      onClose: handleCloseConfirmModal,
      onConfirm: handleConfirmDelete,
      message: deleteMessage,
    },
    successModal: {
      isOpen: showSuccessModal,
      onClose: handleCloseSuccessModal,
      message: successMessage,
    },
  };
};
