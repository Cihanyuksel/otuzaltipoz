'use client';
import { notFound } from 'next/navigation';
import { usePhotoDetail } from './usePhotoDetail';
import { canManage as canManagePhoto } from 'lib/permission';
import Loader from '@/common/loader';
import PhotoDetailView from './PhotoDetailView';

const PhotoDetail = () => {
  const {
    photo,
    isLoading,
    isError,
    likeData,
    ratingsData,
    modalStates,
    isDeleting,
    handleModalToggle,
    handleDelete,
    user,
    accessToken,
    isPending,
    error,
  } = usePhotoDetail();

  if (isDeleting) return <Loader text={'Fotoğraf Siliniyor...'} />;
  if (isLoading) return <Loader text={'Yükleniyor...'} />;
  if (isError || !photo) return notFound();

  const isLoggedIn = !!accessToken;
  const isOwnerPhoto = user?._id === photo.user._id;
  const canDelete = canManagePhoto(user?.role, isOwnerPhoto);

  const stats = {
    likeCount: likeData?.likeCount ?? photo.likeCount,
    isLikedByMe: likeData?.isLikedByMe ?? photo.isLikedByMe,
    averageRating: ratingsData?.averageRating ?? photo.averageRating ?? 0,
    totalVotes: ratingsData?.totalVotes ?? photo.totalVotes ?? 0,
  };

  const deleteMessage = (
    <>
      <strong>{photo.title}</strong> başlıklı fotoğrafı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
    </>
  );

  return (
    <PhotoDetailView
      photo={photo}
      user={user}
      accessToken={accessToken}
      isLoggedIn={isLoggedIn}
      stats={stats}
      permissions={{ canDelete }}
      modals={{
        login: modalStates.login,
        edit: modalStates.edit,
        delete: modalStates.delete,
        isPending,
        error,
        deleteMessage,
      }}
      handlers={{
        onModalToggle: handleModalToggle,
        onDeleteConfirm: handleDelete,
      }}
    />
  );
};

export default PhotoDetail;
