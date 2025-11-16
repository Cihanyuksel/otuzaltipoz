'use client';

import { forwardRef, memo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FaHeart as HeartFilledIcon, FaRegHeart as HeartOutlineIcon } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { useToggleLike } from '@/hooks/api/useLikeApi';

interface ILikeButton {
  photoId: string;
  totalLikes: number;
  isLikedByMe: boolean;
  onOpenModal?: () => void;
  onLoginRequired?: () => void;
  searchQuery?: string;
  categories?: string;
}

const filledHeartVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: [1, 1.3, 1.1],
    rotate: [0, -10, 10, 0],
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: { scale: 0.8, opacity: 0 },
};

const outlineHeartVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
};

const PhotoLikeButton = memo(
  forwardRef<HTMLButtonElement, ILikeButton>(
    ({ photoId, totalLikes, isLikedByMe, onOpenModal, onLoginRequired, searchQuery, categories }, ref) => {
      const { accessToken } = useAuth();
      const { mutate: toggleLike, isPending } = useToggleLike();

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

        toggleLike(
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
      };

      const handleModalOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onOpenModal) {
          onOpenModal();
        }
      };

      return (
        <div className="flex lg:gap-2 w-full md:w-auto text-center border border-gray-200 p-2 rounded-md hover:bg-gray-50 transition-colors">
          <motion.button
            onClick={handleToggle}
            disabled={isPending}
            className="flex items-center justify-center mr-2 lg:mr-0 text-sm cursor-pointer disabled:cursor-not-allowed"
            ref={ref}
            aria-label={isLikedByMe ? 'Beğeniyi kaldır' : 'Beğen'}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isLikedByMe ? (
                <motion.div key="filled" variants={filledHeartVariants} initial="hidden" animate="visible" exit="exit">
                  <HeartFilledIcon className="text-[#ef7464] text-[12px] sm:text-[14px]" />{' '}
                </motion.div>
              ) : (
                <motion.div
                  key="outline"
                  variants={outlineHeartVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <HeartOutlineIcon className="text-gray-400" size={14} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {totalLikes > 0 && onOpenModal ? (
            <button
              onClick={handleModalOpen}
              className="text-xs lg:text-sm font-semibold cursor-pointer text-gray-700 hover:underline"
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

PhotoLikeButton.displayName = 'PhotoLikeButton';
export default PhotoLikeButton;
