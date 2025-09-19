'use client';
//nextjs and react
import { PhotoImage, PhotoInfo, RatingSection, UploaderInfo } from '@/components/photo-detail';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
//third-party
import { CiEdit as EditIcon } from 'react-icons/ci';
import { RiDeleteBin6Line as DeleteIcon } from 'react-icons/ri';
//project files
import LoginModal from '../auth/login-modal';
import EditPhotoModal from '../photos/EditPhotoModal';
import Loader from '../common/loader';
import { useAuth } from '@/context/AuthContext';
import { useGetPhoto, useDeletePhoto } from '@/hooks/usePhotoApi';
import CommentSection from '../comments/CommentSection';
import DeleteConfirmPhotoModal from '../common/confirm-modal';

const PhotoDetail = () => {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const params = useParams();
  const photoId = params.id as string;

  const { data: photo, isLoading, isError } = useGetPhoto(photoId);
  const { mutate: deletePhoto, isPending, error } = useDeletePhoto(accessToken);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = () => {
    if (!photo) return;
    deletePhoto(photo._id, {
      onSuccess: () => {
        console.log(`Fotoğraf başarıyla silindi: ${photo._id}`);
        handleCloseDeleteModal();
        router.push('/photos');
      },
      onError: (err) => {
        console.error(`Fotoğraf silinirken hata oluştu: ${photo._id}`, err);
      },
    });
  };

  if (isLoading)
    return (
      <span>
        <Loader />
      </span>
    );
  if (isError || !photo) return <p>Fotoğraf bulunamadı</p>;

  const isOwner = user?.id === photo.user._id;

  return (
    <section
      className="flex justify-center py-4 bg-neutral-100 text-gray-800 min-h-screen px-4 md:px-0"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="w-full max-w-5xl">
        <div className="bg-white shadow-sm">
          <PhotoImage photoUrl={photo.photo_url} title={photo.title} />
          <div className="p-6 w-full">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <PhotoInfo title={photo.title} description={photo.description} tags={photo.tags} />
                <UploaderInfo user={photo.user} />
              </div>
              <div className="flex flex-col justify-end items-end gap-5">
                {isOwner && (
                  <div className="mt-8 flex gap-2 justify-end">
                    <button
                      onClick={handleOpenEditModal}
                      className="rounded-lg border-gray-200 border h-10 px-6 text-xs md:text-sm font-medium transition-colors hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    >
                      <EditIcon />
                      Düzenle
                    </button>
                    <button
                      onClick={handleOpenDeleteModal}
                      className="rounded-lg border-gray-200 border h-10 px-6 text-xs md:text-sm font-medium text-red-500 transition-colors hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    >
                      <DeleteIcon />
                      Sil
                    </button>
                  </div>
                )}
                <RatingSection photoId={photo._id} accessToken={accessToken} likeCount={photo.likeCount} onLoginRequired={handleOpenLoginModal} />
              </div>
            </div>
            <CommentSection userPhoto={user?.profile_img_url} photoId={photo._id} />
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      {isEditModalOpen && <EditPhotoModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} photo={photo} accessToken={accessToken} />}
      {isDeleteModalOpen && (
        <DeleteConfirmPhotoModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          title="Fotoğrafı Sil"
          message={
            <>
              <strong>{photo.title}</strong> başlıklı fotoğrafı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </>
          }
          onConfirm={handleDelete}
          confirmButtonText="Sil"
          isConfirming={isPending}
          error={error instanceof Error ? error.message : null}
        />
      )}
    </section>
  );
};

export default PhotoDetail;
