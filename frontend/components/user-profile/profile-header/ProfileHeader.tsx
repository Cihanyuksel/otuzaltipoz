// third-party
import { memo } from 'react';
import { HiOutlineDotsVertical as VerticalTreeDots } from 'react-icons/hi';
// project files
import Button from '@/common/button';
import UserDeleteSuccessModal from '@/common/success-modal';
import UserDeleteConfirmModal from '@/common/confirm-modal';
import ProfileInfo from './ProfileInfo';
import ProfileDropdown from './ProfileDropdown';
import { User } from 'types/auth';
import { useProfileActions } from './useProfileActions';
import { canManage } from 'lib/permission';
import { useAuth } from '@/context/AuthContext';

interface IProfileHeader {
  profileOwner: User;
  imageUrl: string;
  isOwner: boolean;
  onEditClick?: () => void;
  onAdminSettingsClick?: () => void;
}

const ProfileHeader = memo(({ profileOwner, imageUrl, isOwner, onEditClick, onAdminSettingsClick }: IProfileHeader) => {
  const { actionItems, dropdownRef, showDropdown, setShowDropdown, isPending, error, confirmModal, successModal } =
    useProfileActions({
      profileOwner,
      isOwner,
      onEditClick,
      onAdminSettingsClick,
    });
  const { user: currentUser } = useAuth();

  const canManageProfile = canManage(currentUser?.role, isOwner);

  return (
    <>
      <div className="relative flex flex-col items-center mb-10 gap-6 md:flex-row md:gap-12">
        <ProfileInfo profileOwner={profileOwner} imageUrl={imageUrl} />

        <div className="absolute top-0 right-0" ref={dropdownRef}>
          {canManageProfile && (
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
          )}

          {showDropdown && <ProfileDropdown actionItems={actionItems} isPending={isPending} />}
        </div>
      </div>

      <UserDeleteConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.onClose}
        title="Hesabı Sil"
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        confirmButtonText={isPending ? 'Siliniyor...' : 'Hesabı Sil'}
        isConfirming={isPending}
        error={error?.message || null}
        modalType="delete"
      />

      <UserDeleteSuccessModal
        isOpen={successModal.isOpen}
        onClose={successModal.onClose}
        title="Hesap Başarıyla Silindi"
        message={successModal.message}
        buttonText={isOwner ? 'Hemen Ana Sayfaya Git' : 'Ana Sayfaya Dön'}
      />
    </>
  );
});

ProfileHeader.displayName = 'ProfileHeader';
export default ProfileHeader;
