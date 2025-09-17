'use client';
//nextjs and react
import { useEffect, useRef, useState } from 'react';
//project-files
import { useAuth } from '@/context/AuthContext';
import { usePhotos } from '@/context/PhotoContext';
import { useGetRatings } from '@/hooks/useRatingApi';
import LikeButton from './LikeButton';
import PhotoLikedUsers from './PhotoLikedUsers';

interface ILikeSection {
  photoId: string;
}

function LikeSection({ photoId }: ILikeSection) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const likeButtonRef = useRef<HTMLButtonElement>(null);

  const { accessToken } = useAuth();
  const { photos } = usePhotos();
  const { data: ratingData } = useGetRatings(photoId);

  const currentPhoto = photos?.find((photo) => photo._id === photoId);
  const likeCount = currentPhoto?.likeCount || 0;
  const isLikedByMe = currentPhoto?.isLikedByMe || false;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (likeButtonRef.current && !likeButtonRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <>
      {accessToken && (
        <div className="flex justify-between items-center mt-2 p-3">
          <div className="flex items-center gap-1 ml-3">
            <span className="text-gray-500 text-sm font-bold">Average Rating: {ratingData?.averageRating.toFixed(2)}</span>
            <span className="text-xs text-gray-400">({ratingData?.totalVotes} votes)</span>
          </div>
          <div className="flex items-center gap-2 relative">
            <LikeButton photoId={photoId} likeCount={likeCount} isLikedByMe={isLikedByMe} onOpenModal={openModal} ref={likeButtonRef} />
            <PhotoLikedUsers photoId={photoId} isOpen={isModalOpen} onClose={closeModal} />
          </div>
        </div>
      )}
    </>
  );
}

export default LikeSection;
