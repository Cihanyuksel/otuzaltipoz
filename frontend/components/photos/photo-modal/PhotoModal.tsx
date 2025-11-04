'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhotoModalKeyboard } from './usePhotoModalKeyboard';
import { ModalOverlay } from './ModalOverlay';
import { ModalContent } from './ModalContent';
import { ModalControls } from './ModalControls';
import { Photo } from 'types/photo';

interface IPhotoModal {
  photos: Photo[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const PhotoModal = ({ photos, currentIndex, onClose, onNavigate }: IPhotoModal) => {
  const isModalOpen = currentIndex !== null;
  const currentPhoto = isModalOpen ? photos[currentIndex] : null;

  usePhotoModalKeyboard({ isModalOpen, onNavigate, onClose });

  if (!isModalOpen || !currentPhoto) {
    return null;
  }

  return (
    <ModalOverlay onClose={onClose}>
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
          <ModalContent photo={currentPhoto} />

          <ModalControls onClose={onClose} onNavigate={onNavigate} hasMultiplePhotos={photos.length > 1} />
        </motion.div>
      </AnimatePresence>
    </ModalOverlay>
  );
};

export default PhotoModal;
