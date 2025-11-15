'use client';
import PhotoModal from '@/components/photos/photo-modal/PhotoModal';
import PhotoCard from '../photo-card/PhotoCard';
import { Photo } from 'types/photo';
import { usePhotoModal } from './hooks/usePhotoModal';
import { PhotoListSkeleton } from './PhotoListSkeleton';

interface PhotoListProps {
  photos: Photo[];
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
  isFetchingNextPage?: boolean;
}

export default function PhotoList({ photos, error, isFetchingNextPage }: PhotoListProps) {
  const { currentIndex, openModal, closeModal, navigatePhotos } = usePhotoModal(photos.length);

  if (error) {
    return <div className="col-span-full text-center py-8 text-red-500">Hata: {error?.message}</div>;
  }

  return (
    <>
      {photos.map((photo: Photo, index: number) => (
        <PhotoCard
          key={photo._id}
          photoId={photo._id}
          title={photo.title}
          description={photo.description}
          imageUrl={photo.photo_url}
          uploader={photo.user?.username}
          profileImgUrl={photo.user?.profile_img_url}
          created_at={photo.created_at}
          averageRating={5}
          tags={photo.tags || []}
          onPhotoClick={() => openModal(index)}
          uploaderId={photo.user?._id}
          index={index}
          photo={photo}
        />
      ))}

      {isFetchingNextPage && <PhotoListSkeleton />}

      <PhotoModal photos={photos} currentIndex={currentIndex} onClose={closeModal} onNavigate={navigatePhotos} />
    </>
  );
}
