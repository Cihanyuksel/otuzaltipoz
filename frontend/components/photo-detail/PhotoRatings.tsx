'use client';
//nextjs and react
import { useEffect, useRef, useState } from 'react';
//third-party
import { FiCheck as CheckIcon } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import {
  IoIosStar as StarFilledIcon,
  IoIosStarOutline as StarOutlineIcon,
  IoMdHeartEmpty as HeartEmptyIcon,
} from 'react-icons/io';
//project-files
import { useGetRatings, useRatePhoto } from '@/hooks/useRatingApi';
import Loader from '../common/loader';

interface RatingSectionProps {
  photoId: string;
  accessToken: string | null;
  likeCount: number;
  onLoginRequired: () => void;
}

export default function RatingSection({
  photoId,
  accessToken,
  likeCount,
  onLoginRequired,
}: RatingSectionProps) {
  const [rating, setRating] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const starRef = useRef<HTMLDivElement>(null);

  const { data: ratingsData, isLoading, error } = useGetRatings(photoId);
  const ratePhotoMutation = useRatePhoto();
  const IsLoggedIn = !!accessToken

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (starRef.current && !starRef.current.contains(event.target as Node)) {
        setRating(0);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (rating === 0) return;
    setErrorMessage(null);

    if (!IsLoggedIn) {
      onLoginRequired();
      return;
    }

    ratePhotoMutation.mutate(
      {
        photoId,
        rating,
        accessToken,
      },
      {
        onSuccess: () => {
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 1500);
          setRating(0);
        },
        onError: (error: any) => {
          const backendMessage = error?.message || error?.response?.data?.message;
          if (backendMessage?.includes('already rated')) {
            setErrorMessage('Bu fotoğrafı zaten oyladınız.');
          } else {
            setErrorMessage(backendMessage || 'Oylama başarısız oldu.');
          }
        },
      }
    );
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="flex flex-col items-start gap-3 md:items-end">
        <div className="text-red-500 text-sm">Puanlar yüklenemedi</div>
      </div>
    );
  }

  const averageRating = ratingsData?.averageRating || 0;
  const totalVotes = ratingsData?.totalVotes || 0;
  const ratingOptions = [5, 4, 3, 2, 1];

  return (
    <div className="flex flex-col items-start gap-3 md:items-end">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold  text-gray-900">{averageRating.toFixed(2)}</span>
        <span className="text-sm text-gray-500">/ 5</span>
      </div>

      <p className="text-sm text-gray-500">{totalVotes} kişi oy verdi</p>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200">
          <span className="material-symbols-outlined text-base">
            <HeartEmptyIcon />
          </span>
          {likeCount}
        </button>
      </div>

      {/* Star Rating Input */}
      <div
        ref={starRef}
        className="mt-2 flex flex-row-reverse items-center justify-end w-full flex-shrink-0"
      >
        <div className="relative flex items-center">
          {rating > 0 && (
            <motion.button
              onClick={handleSubmit}
              disabled={ratePhotoMutation.isPending}
              whileTap={{ scale: 0.95, backgroundColor: '#e9f5e9' }}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className={`relative ml-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-green-500 overflow-hidden group shadow-sm transition-all duration-300 ${
                ratePhotoMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {ratePhotoMutation.isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-500"></div>
              ) : (
                <motion.div
                  key="check-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="relative z-10"
                >
                  <CheckIcon size={22} className="text-green-500 stroke-2" />
                </motion.div>
              )}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: rating > 0 ? 1 : 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-gray-100 opacity-40"
              />
            </motion.button>
          )}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute left-1/2 top-full mt-1 -translate-x-1/2 rounded bg-green-100 px-2 py-1 text-sm text-green-800 shadow whitespace-nowrap"
              >
                Oy verildi!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stars */}
        <div className="flex flex-row-reverse items-center gap-2">
          <p className="text-sm text-gray-600">{rating}</p>
          <div className="star-rating flex flex-row-reverse">
            {ratingOptions.map((n) => (
              <label key={n} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  onChange={() => {
                    setRating(n);
                    setErrorMessage(null);
                  }}
                  className="hidden"
                  disabled={ratePhotoMutation.isPending}
                />
                <motion.div
                  whileHover={{ scale: ratePhotoMutation.isPending ? 1 : 1.15 }}
                  whileTap={{ scale: ratePhotoMutation.isPending ? 1 : 0.85 }}
                  animate={{ scale: n === rating ? 1.2 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={ratePhotoMutation.isPending ? 'opacity-50' : ''}
                >
                  {n <= rating ? (
                    <StarFilledIcon color="gold" size={30} />
                  ) : (
                    <StarOutlineIcon color="gray" size={30} />
                  )}
                </motion.div>
              </label>
            ))}
          </div>
        </div>

        <p className="mr-4 flex-shrink-0 text-md font-medium text-gray-600">Fotoğrafı Oyla</p>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500"
        >
          {errorMessage}
        </motion.div>
      )}
    </div>
  );
}
