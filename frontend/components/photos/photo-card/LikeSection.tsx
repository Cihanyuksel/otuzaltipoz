'use client';
import { useEffect, useRef, useState } from 'react';
import LikeButton from './LikeButton';
import LikesModal from './LikeModal';
import { useAuth } from '@/context/AuthContext';

interface ILikeSection {
  photoId: string;
  averageRating: number;
}

function LikeSection({ averageRating, photoId }: ILikeSection) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const likeButtonRef = useRef<HTMLButtonElement>(null);

  const { accessToken } = useAuth()

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
    <div className="flex justify-between items-center mt-2 p-3">
      <span className="text-gray-500 text-sm font-bold">Average Rating: {averageRating.toFixed(1)}</span>
      <div className="flex items-center gap-2 relative">
        {accessToken && <LikeButton photoId={photoId} onOpenModal={openModal} ref={likeButtonRef} />}
        <LikesModal photoId={photoId} isOpen={isModalOpen} onClose={closeModal} buttonRef={likeButtonRef} />
      </div>
    </div>
  );
}

export default LikeSection;
