'use client';
import PhotoModal from '@/components/photos/PhotoModal';
import PhotoCardMain from './photo-card/PhotoCardMain';
import { useState, useEffect } from 'react';
import { Photo } from 'types/photo';

interface IPhotoList {
  photos: Photo[];
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
  isFetchingNextPage?: boolean;
}

// Skeleton Component
export const PhotoCardSkeleton = () => {
  return (
    <div className="rounded overflow-hidden shadow-lg border border-gray-200 animate-pulse">
      <div className="w-full h-64 bg-gray-300"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            <div className="h-2 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="h-8 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  );
};

export default function PhotoList({ photos, isLoading, error, isFetchingNextPage }: IPhotoList) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [skeletonCount, setSkeletonCount] = useState(4);

  useEffect(() => {
    const updateSkeletonCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSkeletonCount(2);
      } else if (width < 1024) {
        setSkeletonCount(4);
      } else if (width < 1536) {
        setSkeletonCount(6);
      } else {
        setSkeletonCount(8);
      }
    };

    updateSkeletonCount();
    window.addEventListener('resize', updateSkeletonCount);
    return () => window.removeEventListener('resize', updateSkeletonCount);
  }, []);

  if (error) return <div>Error: {error?.message}</div>;

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
          uploaderId={photo.user?._id}
          index={index}
        />
      ))}

      {isFetchingNextPage && (
        <>
          {[...Array(skeletonCount)].map((_, index) => (
            <PhotoCardSkeleton key={`skeleton-${index}`} />
          ))}
        </>
      )}

      <PhotoModal photos={photos} currentIndex={currentIndex} onClose={closeModal} onNavigate={navigatePhotos} />
    </>
  );
}
