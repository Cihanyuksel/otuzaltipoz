'use client';
import PhotoModal from '@/components/photos/photo-modal/PhotoModal';
import PhotoCard from '../photo-card/PhotoCard';
import { Photo } from 'types/photo';
import { usePhotoModal } from './hooks/usePhotoModal';
import { usePhotos } from '@/context/PhotoContext';

export default function PhotoList() {
  const { photos, error: photosError } = usePhotos();
  const photoArray = photos || [];
  const { currentIndex, openModal, closeModal, navigatePhotos } = usePhotoModal(photoArray.length);

  if (photosError) {
    return <div className="col-span-full text-center py-8 text-red-500">Hata: {photosError?.message}</div>;
  }

  return (
    <>
      {photoArray.map((photo: Photo, index: number) => (
        <PhotoCard
          key={photo._id}
          photoId={photo._id}
          title={photo.title}
          description={photo.description}
          imageUrl={photo.photo_url}
          uploader={photo.user?.username}
          profileImgUrl={photo.user?.profile_img_url}
          created_at={photo.created_at}
          tags={photo.tags || []}
          onPhotoClick={() => openModal(index)}
          uploaderId={photo.user?._id}
          index={index}
          photo={photo}
        />
      ))}

      <PhotoModal photos={photoArray} currentIndex={currentIndex} onClose={closeModal} onNavigate={navigatePhotos} />
    </>
  );
}
