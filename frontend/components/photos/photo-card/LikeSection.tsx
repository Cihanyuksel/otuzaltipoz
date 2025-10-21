'use client';
import { useRef, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePhotos } from '@/context/PhotoContext';
import { useGetRatings } from '@/hooks/api/useRatingApi';
import { useOutsideClick } from '@/hooks/ui/useOutsideClick';
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

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useOutsideClick(likeButtonRef, closeModal, isModalOpen);

  const isLoggedIn = !!accessToken;

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex justify-between items-center mt-2 p-3">
      <div className="flex items-center gap-1 ml-3">
        <span className="text-gray-500 text-sm font-bold">
          Ortalama Puan:{' '}
          <span className="font-bold text-xl text-gray-700">
            {ratingData?.averageRating ? ratingData.averageRating.toFixed(2) : '0.00'}
          </span>{' '}
          / 5
        </span>
        <span className="text-xs text-gray-400">({ratingData?.totalVotes || 0} oy)</span>
      </div>

      <div className="flex items-center gap-2 relative">
        <LikeButton
          photoId={photoId}
          likeCount={likeCount}
          isLikedByMe={isLikedByMe}
          onOpenModal={openModal}
          useContext={true}
          ref={likeButtonRef}
        />

        {isModalOpen && <PhotoLikedUsers photoId={photoId} isOpen={isModalOpen} onClose={closeModal} />}
      </div>
    </div>
  );
}

export default LikeSection;
