'use client';
import Loader from '@/components/common/loader';
import PhotoCard from '@/components/photos/PhotoCard';
import PhotoModal from '@/components/photos/PhotoModal';
import { useGetAllPhoto } from '@/hooks/usePhotoApi';
import { useState } from 'react';
import { Photo } from 'types/photo';

export default function Photos() {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const averageRating = 5;

  const { data: response, isLoading, isError, error } = useGetAllPhoto();
  const photos = response?.data || [];

  if (isLoading) return <div> <Loader/></div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const openModal = (index: number) => {
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setCurrentIndex(null);
  };

  const navigatePhotos = (direction: 'prev' | 'next') => {
    if (currentIndex === null) return;

    if (direction === 'next') {
      setCurrentIndex((prevIndex) => {
        if (prevIndex === null) return 0;
        return (prevIndex + 1) % photos.length;
      });
    } else {
      setCurrentIndex((prevIndex) => {
        if (prevIndex === null) return photos.length - 1;
        return (prevIndex - 1 + photos.length) % photos.length;
      });
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
          uploader={photo.user.username}
          averageRating={averageRating}
          tags={photo.tags || []}
          initialLikes={photo.likes || 0}
          profileImgUrl={photo.user.profile_img_url}
          created_at={photo.user.created_at}
          onPhotoClick={() => openModal(index)}
        />
      ))}
        <PhotoModal 
          photos={photos}
          currentIndex={currentIndex} 
          onClose={closeModal} 
          onNavigate={navigatePhotos} />
    </div>
  );
}
