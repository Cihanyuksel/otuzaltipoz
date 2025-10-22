'use client';
//nextjs and react
import { useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
//third-party
import { toast } from 'react-toastify';
//project files
import LoginModal from '../auth/login-modal';
import EditPhotoModal from '../photos/EditPhotoModal';
import DeleteConfirmPhotoModal from '../common/confirm-modal';
import Loader from '../common/loader';
import Button from '../common/button';
import PhotoLikeButton from '../photos/photo-card/PhotoLikeButton';
import CommentSection from '../comments/CommentSection';
import { PhotoImage, PhotoInfo, RatingSection, UploaderInfo, PhotoActions } from '@/components/photo-detail';
import { useGetLikes } from '@/hooks/api/useLikeApi';
import { useGetPhoto, useDeletePhoto } from '@/hooks/api/usePhotoApi';
import { useGetRatings } from '@/hooks/api/useRatingApi';
import { useAuth } from '@/context/AuthContext';
import { canManage as canManagePhoto } from 'lib/permission';

type ModalName = 'login' | 'edit' | 'delete';

interface ModalStates {
  login: boolean;
  edit: boolean;
  delete: boolean;
}

const PhotoDetail = () => {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const [modalStates, setModalStates] = useState<ModalStates>({
    login: false,
    edit: false,
    delete: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const params = useParams();
  const photoId = params.id as string;

  const {
    data: photo,
    isLoading,
    isError,
  } = useGetPhoto(photoId, {
    enabled: !isDeleting,
  });
  const { data: likeData } = useGetLikes(photoId, {
    enabled: !!photoId && !isDeleting,
  });
  const { data: ratingsData } = useGetRatings(photoId, {
    enabled: !!photoId && !isDeleting,
  });
  const { mutate: deletePhoto, isPending, error } = useDeletePhoto();

  const handleModalToggle = (modalName: ModalName, isOpen: boolean) => {
    setModalStates((prevState) => ({
      ...prevState,
      [modalName]: !!isOpen,
    }));
  };

  const handleDelete = () => {
    if (!photo) return;

    setIsDeleting(true);

    deletePhoto(photo._id, {
      onSuccess: () => {
        handleModalToggle('delete', false);

        toast.success('Fotoğraf başarıyla silindi!', {
          autoClose: 1500,
        });

        router.push('/photos');
      },
      onError: (err) => {
        setIsDeleting(false);
        console.error(`Fotoğraf silinirken hata oluştu: ${photo._id}`, err);
        toast.error('Fotoğraf silinirken bir hata oluştu.');
      },
    });
  };

  if (isDeleting) return <Loader text={'Fotoğraf Siliniyor...'} />;
  if (isLoading) return <Loader text={'Yükleniyor...'} />;
  if (isError || !photo) return notFound();

  const isOwnerPhoto = user?._id === photo.user._id;
  const isLoggedIn = !!accessToken;
  const canDeletePhoto = canManagePhoto(user?.role, isOwnerPhoto);

  const currentLikeCount = likeData?.likeCount ?? photo.likeCount;
  const currentIsLikedByMe = likeData?.isLikedByMe ?? photo.isLikedByMe;
  
  const currentAverageRating = ratingsData?.averageRating ?? photo.averageRating ?? 0;
  const currentTotalVotes = ratingsData?.totalVotes ?? photo.totalVotes ?? 0;

  return (
    <section
      className="w-full flex justify-center py-5 bg-neutral-100 text-gray-800 min-h-screen 2xl:min-h-4/5 px-4 md:px-0"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="w-full max-w-6xl 2xl:max-w-4/5">
        <div className="bg-white p-10 shadow-sm">
          <PhotoImage photoUrl={photo.photo_url} title={photo.title} />
          <div className="w-full px-4 md:pt-5 md:px-10">
            <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <PhotoInfo title={photo.title} description={photo.description} tags={photo.tags} />
                <UploaderInfo user={photo.user} photoCreatedAt={photo.created_at} photoUpdatedAt={photo.updated_at} />
                <div className="mt-4"></div>
              </div>
              {isLoggedIn ? (
                <div className="flex flex-col md:flex-col justify-end items-end gap-5">
                  <RatingSection
                    photoId={photo._id}
                    accessToken={accessToken}
                    averageRating={currentAverageRating}
                    totalVotes={currentTotalVotes}
                    onLoginRequired={() => handleModalToggle('login', true)}
                  />
                  <PhotoLikeButton
                    photoId={photo._id}
                    totalLikes={currentLikeCount}
                    isLikedByMe={currentIsLikedByMe}
                    onLoginRequired={() => handleModalToggle('login', true)}
                  />
                  {canDeletePhoto && <PhotoActions handleModalToggle={handleModalToggle} />}
                </div>
              ) : (
                <div className="flex flex-col justify-end items-end gap-5 mt-3 md:mt-5">
                  <div className="flex flex-col items-end justify-center p-4 rounded-xl text-right max-w-full w-full">
                    <p className="text-sm font-medium text-gray-800 mb-3">
                      Bu fotoğrafı oylamak ve beğenmek için aramıza katıl!
                    </p>
                    <Button onClick={() => handleModalToggle('login', true)} variant="primary" className="w-full">
                      Hemen Giriş Yap
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <CommentSection
              userPhoto={user?.profile_img_url}
              photoId={photo._id}
              onLoginRequired={() => handleModalToggle('login', true)}
            />
          </div>
        </div>
      </div>

      <LoginModal isOpen={modalStates.login} onClose={() => handleModalToggle('login', false)} />

      {modalStates.edit && (
        <EditPhotoModal isOpen={modalStates.edit} onClose={() => handleModalToggle('edit', false)} photo={photo} />
      )}

      <DeleteConfirmPhotoModal
        isOpen={modalStates.delete}
        onClose={() => handleModalToggle('delete', false)}
        title="Fotoğrafı Sil"
        message={
          <>
            <strong>{photo.title}</strong> başlıklı fotoğrafı silmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz.
          </>
        }
        onConfirm={handleDelete}
        confirmButtonText={isPending ? 'Siliniyor...' : 'Sil'}
        isConfirming={isPending}
        error={error instanceof Error ? error.message : null}
      />
    </section>
  );
};

export default PhotoDetail;