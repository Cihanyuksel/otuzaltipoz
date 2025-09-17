'use client';
//nextjs and rect
import { forwardRef, memo } from 'react';
//third-party
import { FaHeart as HeartFilledIcon, FaRegHeart as HeartOutlineIcon } from 'react-icons/fa';
import { toast } from 'react-toastify';
//project-files
import { useAuth } from '@/context/AuthContext';
import { usePhotos } from '@/context/PhotoContext';

interface LikeButtonProps {
  photoId: string;
  likeCount: number;
  isLikedByMe: boolean;
  onOpenModal: () => void;
}

const LikeButton = memo(
  forwardRef<HTMLButtonElement, LikeButtonProps>(({ photoId, likeCount, isLikedByMe, onOpenModal }, ref) => {
    const { accessToken } = useAuth();
    const { toggleLike, isLoading } = usePhotos();

    const handleToggle = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!accessToken) {
        return toast.info('Giriş yapmalısınız.');
      }

      toggleLike(photoId);
    };

    const heartIcon = isLoading ? (
      <div className="w-4 h-4 bg-gray-200" />
    ) : isLikedByMe ? (
      <HeartFilledIcon className="text-[#ef7464]" />
    ) : (
      <HeartOutlineIcon className="text-gray-400" />
    );

    return (
      <div className="flex gap-2 border border-gray-200 p-2 rounded-md hover:bg-gray-200 hover:text-white">
        <button onClick={handleToggle} className="flex items-center justify-center gap-1 text-sm cursor-pointer" ref={ref}>
          {heartIcon}
        </button>
        {likeCount > 0 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenModal();
            }}
            className="text-sm font-semibold cursor-pointer text-gray-700 hover:underline"
          >
            {likeCount} Beğeni
          </button>
        )}
      </div>
    );
  })
);

LikeButton.displayName = 'LikeButton';
export default LikeButton;
