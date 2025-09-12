'use client';
import Loader from '@/components/common/loader';
import PhotoCard from '@/components/photos/PhotoCard';
import PhotoModal from '@/components/photos/PhotoModal';
import { useGetAllPhoto } from '@/hooks/usePhotoApi';
import { useState } from 'react';
import { Photo } from 'types/photo';

export default function Photos() {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const { data: response, isLoading, isError, error } = useGetAllPhoto();
  const photos = response?.data || [];
  
  if (isLoading) return <Loader />;
  if (isError) return <div>Error: {error?.message}</div>;

  const openModal = (index: number) => setCurrentIndex(index);
  const closeModal = () => setCurrentIndex(null);

  const navigatePhotos = (direction: 'prev' | 'next') => {
    if (currentIndex === null) return;

    if (direction === 'next') {
      setCurrentIndex((prevIndex) => (prevIndex! + 1) % photos.length);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex! - 1 + photos.length) % photos.length);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
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
        />
      ))}
      <PhotoModal photos={photos} currentIndex={currentIndex} onClose={closeModal} onNavigate={navigatePhotos} />
    </div>
  );
}
