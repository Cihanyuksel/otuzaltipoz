'use client';
import { forwardRef } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useGetLikes, useToggleLike } from '@/hooks/useLikeApi';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

interface LikeButtonProps {
  photoId: string;
  onOpenModal: () => void;
}

const LikeButton = forwardRef<HTMLButtonElement, LikeButtonProps>(({ photoId, onOpenModal }, ref) => {
  const { accessToken } = useAuth();
  const { mutateAsync, isPending } = useToggleLike();
  const { data, isLoading } = useGetLikes(photoId, accessToken);

  const isLiked = data?.isLikedByMe;
  const likeCount = data?.likeCount || 0;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!accessToken) return toast.info('Giriş yapmalısınız.');
    await mutateAsync({ photoId, accessToken });
  };

  const heartIcon = isLoading ? (
    <div className="w-4 h-4 bg-gray-200" />
  ) : isLiked ? (
    <FaHeart className="text-[#ef7464]" />
  ) : (
    <FaRegHeart className="text-gray-400" />
  );

  return (
    <div className="flex gap-2 border border-gray-200 p-2 rounded-md hover:bg-gray-200 hover:text-white">
      <button onClick={handleToggle} disabled={isPending || isLoading} className="flex items-center gap-1 text-sm cursor-pointer" ref={ref}>
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
});

LikeButton.displayName = 'LikeButton';
export default LikeButton;
