'use client';
import Loader from '@/components/common/loader';
import PhotoModal from '@/components/photos/PhotoModal';
import PhotoCardMain from './photo-card/PhotoCardMain';
import { useState } from 'react';
import { Photo } from 'types/photo';

interface PhotoListProps {
  photos: Photo[];
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
}

export default function PhotoList({ photos, isLoading, isError, error }: PhotoListProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

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
    <>
      {photos.map((photo: Photo, index: number) => (
        <PhotoCardMain
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
    </>
  );
}
