//nextjs and react
import { useEffect, useCallback } from 'react';
import Image from 'next/image';
//third-party
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft as ArrowLeftIcon, FaArrowRight as ArrowRightIcon, FaTimes as CloseIcon } from 'react-icons/fa';
// project-files
import { formatDateNumeric } from 'lib/formatDate';

interface PhotoDocument {
  photo_url: string;
  title: string;
  description: string;
  created_at: string;
  updated_at?: string;
  user?: {
    username: string;
  };
}

interface IPhotoModal {
  photos: PhotoDocument[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const PhotoModal: React.FC<IPhotoModal> = ({ photos, currentIndex, onClose, onNavigate }) => {
  const isModalOpen = currentIndex !== null;
  const currentPhoto = isModalOpen ? photos[currentIndex] : null;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        onNavigate('next');
      } else if (e.key === 'ArrowLeft') {
        onNavigate('prev');
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [onNavigate, onClose]
  );

  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  if (!isModalOpen || !currentPhoto) {
    return null;
  }

  const date = currentPhoto.created_at ? formatDateNumeric(currentPhoto.created_at) : null;
  const isEdited = currentPhoto.updated_at && currentPhoto.updated_at !== currentPhoto.created_at;
  const editedDate = isEdited && currentPhoto.updated_at ? formatDateNumeric(currentPhoto.updated_at) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black"
      onClick={onClose}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          transition={{ duration: 0.2 }}
          className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="relative w-full h-full flex items-center justify-center group">
            <Image
              src={currentPhoto.photo_url}
              alt={currentPhoto.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />

            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-start transition-all duration-300 opacity-0 transform translate-y-full group-hover:opacity-100 group-hover:translate-y-0"
              style={{
                backgroundColor: 'rgba(21, 28, 26, 0.6)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: '#f5f1ea',
              }}
            >
              <h2 className="text-xl md:text-2xl font-extrabold mb-1 uppercase text-gray-200">{currentPhoto.title}</h2>
              <p className="text-sm md:text-base text-gray-300">{currentPhoto.description}</p>

              {currentPhoto.user && (
                <div className="mt-4 pt-4 border-t border-gray-500">
                  <p className="text-sm text-gray-300 font-semibold">@{currentPhoto.user.username}</p>
                  {isEdited ? (
                    <p className="text-xs text-gray-400">Düzenlenme Tarihi: {editedDate}</p>
                  ) : (
                    <p className="text-xs text-gray-400">Yüklenme Tarihi: {date}</p>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition z-30 bg-black/40 rounded-full p-2 hover:bg-black/60"
          >
            <CloseIcon size={24} />
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('prev');
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 p-3 rounded-full bg-black/40 hover:bg-black/60 transition z-20 cursor-pointer"
              >
                <ArrowLeftIcon size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('next');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 p-3 rounded-full bg-black/40 hover:bg-black/60 transition z-20 cursor-pointer"
              >
                <ArrowRightIcon size={24} />
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default PhotoModal;
