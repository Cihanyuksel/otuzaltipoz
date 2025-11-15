'use client';

import { useRef, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePhotos } from '@/context/PhotoContext';
import { useGetLikes } from '@/hooks/api/useLikeApi';
import { useOutsideClick } from '@/hooks/ui/useOutsideClick';
import PhotoLikeButton from './PhotoLikeButton';
import LikedUsersModal from './LikedUsersModal';
import RatingDisplay from './RatingDisplay';
import { Photo } from 'types/photo';

interface PhotoInteractionSectionProps {
  photoId: string;
  photo: Photo;
}

function PhotoInteractionSection({ photo, photoId }: PhotoInteractionSectionProps) {
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const likeButtonRef = useRef<HTMLButtonElement>(null);

  const { accessToken } = useAuth();
  const { searchQuery, selectedCategories } = usePhotos();

  const { data: likeData } = useGetLikes(photoId, accessToken, {
    enabled: isLikesModalOpen,
  });

  const totalLikes = isLikesModalOpen && likeData ? likeData.likeCount : (photo?.likeCount ?? 0);

  const isLikedByMe = isLikesModalOpen && likeData ? likeData.isLikedByMe : (photo?.isLikedByMe ?? false);

  const averageRating = photo?.averageRating || 0;
  const totalVotes = photo?.totalVotes || 0;

  const openLikesModal = useCallback(() => setIsLikesModalOpen(true), []);
  const closeLikesModal = useCallback(() => setIsLikesModalOpen(false), []);

  useOutsideClick(likeButtonRef, closeLikesModal, isLikesModalOpen);

  if (!accessToken) return null;

  return (
    <div className="flex justify-between items-center mt-2 p-3">
      <RatingDisplay averageRating={averageRating} totalVotes={totalVotes} />

      <div className="flex items-center gap-2 relative">
        <PhotoLikeButton
          photoId={photoId}
          totalLikes={totalLikes}
          isLikedByMe={isLikedByMe}
          onOpenModal={openLikesModal}
          searchQuery={searchQuery}
          categories={selectedCategories.join(',') || undefined}
          ref={likeButtonRef}
        />

        {isLikesModalOpen && <LikedUsersModal photoId={photoId} isOpen={isLikesModalOpen} onClose={closeLikesModal} />}
      </div>
    </div>
  );
}

export default PhotoInteractionSection;
