//nextjs and react
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//project-files
import { useAuth } from '@/context/AuthContext';
import { useDeleteUser } from '@/hooks/api/useAuthApi';
import Button from '../common/button';
import SuccessModal from '../common/success-modal';
import UserDeleteConfirmModal from '../common/confirm-modal';
import { User } from 'types/auth';

interface IProfileHeader {
  user: User;
  imageUrl: string;
  isOwner: boolean;
  onDeleteAccountClick?: () => void;
}

const ProfileHeader = ({ user, imageUrl, isOwner }: IProfileHeader) => {
  const { user: currentUser, setAuth, accessToken } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const { mutate: deleteUser, isPending, error, isSuccess } = useDeleteUser();

  useEffect(() => {
    if (isSuccess) {
      setShowSuccessModal(true);
      const timer = setTimeout(() => {
        setAuth(null);
        router.push('/');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, setAuth, router]);

  const handleDeleteAccount = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    deleteUser({ userId: currentUser!.id, token: accessToken });
  };

  const handleCloseConfirmModal = () => {
    if (!isPending) {
      setShowConfirmModal(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setAuth(null);
    router.push('/');
  };

  return (
    <>
      <div className="relative flex flex-col items-center gap-6 md:flex-row md:gap-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
          <div className="h-32 w-32 flex-shrink-0 rounded-full overflow-hidden">
            <Image src={imageUrl} alt="Profile" width={128} height={128} className="object-cover" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{user.full_name}</h1>
            <p className="text-md font-bold text-[#ef7464]">@{user.username}</p>
            <p className="mt-2 text-base text-gray-500">{user.bio}</p>
          </div>
        </div>

        {isOwner && (
          <Button
            onClick={handleDeleteAccount}
            className="absolute top-0 right-0 px-4 py-2"
            variant="danger"
            disabled={isPending}
          >
            {isPending ? 'Siliniyor...' : 'Hesabı Sil'}
          </Button>
        )}
      </div>

      <UserDeleteConfirmModal
        isOpen={showConfirmModal && !isSuccess}
        onClose={handleCloseConfirmModal}
        title="Hesabı Sil"
        message={
          <div>
            <p className="mb-2">
              <strong>@{user.username}</strong> hesabınızı silmek istediğinizden emin misiniz?
            </p>
            <p className="text-red-600 font-medium">
              Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinecektir.
            </p>
          </div>
        }
        onConfirm={handleConfirmDelete}
        confirmButtonText={isPending ? 'Siliniyor...' : 'Hesabı Sil'}
        isConfirming={isPending}
        error={error?.message || null}
        modalType="delete"
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="Hesap Başarıyla Silindi"
        message={`@${user.username} hesabınız ve tüm verileriniz başarıyla silindi. 2 saniye sonra ana sayfaya yönlendirileceksiniz.`}
        buttonText="Hemen Ana Sayfaya Git"
      />
    </>
  );
};

export default ProfileHeader;
