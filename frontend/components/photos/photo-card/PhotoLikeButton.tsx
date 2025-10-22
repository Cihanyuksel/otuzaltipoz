'use client';
//nextjs and react
import { forwardRef, memo } from 'react';
//third-party
import { FaHeart as HeartFilledIcon, FaRegHeart as HeartOutlineIcon } from 'react-icons/fa';
import { toast } from 'react-toastify';
//project-files
import { useAuth } from '@/context/AuthContext';
import { usePhotos } from '@/context/PhotoContext';
import { useToggleLike } from '@/hooks/api/useLikeApi';

interface LikeButtonProps {
  photoId: string;
  totalLikes: number;
  isLikedByMe: boolean;
  onOpenModal?: () => void;
  onLoginRequired?: () => void;
  searchQuery?: string;
  categories?: string;
  useContext?: boolean;
}

const PhotoLikeButton = memo(
  forwardRef<HTMLButtonElement, LikeButtonProps>(
    (
      { photoId, totalLikes, isLikedByMe, onOpenModal, onLoginRequired, searchQuery, categories, useContext = true },
      ref
    ) => {
      const { accessToken } = useAuth();
      const { toggleLike: contextToggleLike, isLoading: contextLoading } = usePhotos();
      const { mutate: apiToggleLike, isPending: apiPending } = useToggleLike();

      const isLoading = useContext ? contextLoading : apiPending;

      const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!accessToken) {
          if (onLoginRequired) {
            onLoginRequired();
          } else {
            toast.info('Giriş yapmalısınız.');
          }
          return;
        }

        if (useContext) {
          contextToggleLike(photoId);
        } else {
          apiToggleLike(
            {
              photoId,
              accessToken,
              searchQuery,
              categories,
              hasToken: !!accessToken,
            },
            {
              onError: (error) => {
                toast.error('Beğeni işlemi başarısız oldu.');
                console.error('Like toggle error:', error);
              },
            }
          );
        }
      };

      const handleModalOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onOpenModal) {
          onOpenModal();
        }
      };

      const heartIcon = isLoading ? (
        <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
      ) : isLikedByMe ? (
        <HeartFilledIcon className="text-[#ef7464]" />
      ) : (
        <HeartOutlineIcon className="text-gray-400" />
      );

      return (
        <div className="flex gap-2 border border-gray-200 p-2 rounded-md hover:bg-gray-50 transition-colors">
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className="flex items-center justify-center gap-1 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            ref={ref}
            aria-label={isLikedByMe ? 'Beğeniyi kaldır' : 'Beğen'}
          >
            {heartIcon}
          </button>
          {totalLikes > 0 && onOpenModal ? (
            <button
              onClick={handleModalOpen}
              className="text-sm font-semibold cursor-pointer text-gray-700 hover:underline"
            >
              {totalLikes} Beğeni
            </button>
          ) : totalLikes > 0 ? (
            <span className="text-sm font-semibold text-gray-700">{totalLikes} Beğeni</span>
          ) : null}
        </div>
      );
    }
  )
);

PhotoLikeButton.displayName = 'LikeButton';
export default PhotoLikeButton;
