import { useEffect, useCallback } from 'react';

type NavigationDirection = 'prev' | 'next';

interface IUsePhotoModalKeyboard {
  isModalOpen: boolean;
  onNavigate: (direction: NavigationDirection) => void;
  onClose: () => void;
}

export const usePhotoModalKeyboard = ({ isModalOpen, onNavigate, onClose }: IUsePhotoModalKeyboard) => {
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
};
