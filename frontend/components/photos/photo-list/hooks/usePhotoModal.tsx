import { useState, useCallback } from 'react';

export const usePhotoModal = (totalPhotos: number) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const openModal = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setCurrentIndex(null);
  }, []);

  const navigatePhotos = useCallback(
    (direction: 'prev' | 'next') => {
      if (currentIndex === null) return;

      if (direction === 'next') {
        setCurrentIndex((prevIndex) => (prevIndex! + 1) % totalPhotos);
      } else {
        setCurrentIndex((prevIndex) => (prevIndex! - 1 + totalPhotos) % totalPhotos);
      }
    },
    [currentIndex, totalPhotos]
  );

  return {
    currentIndex,
    openModal,
    closeModal,
    navigatePhotos,
  };
};