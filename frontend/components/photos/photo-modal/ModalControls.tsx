import { FaTimes as CloseIcon } from 'react-icons/fa';
import { NavigationButtons } from './NavigationButton';

type NavigationDirection = 'prev' | 'next';

interface IModalControls {
  onClose: () => void;
  onNavigate: (direction: NavigationDirection) => void;
  hasMultiplePhotos: boolean;
}

export const ModalControls = ({ onClose, onNavigate, hasMultiplePhotos }: IModalControls) => {
  return (
    <>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-200 transition z-30 bg-black/40 rounded-full p-2 hover:bg-black/60 cursor-pointer"
        aria-label="Modalı kapat"
      >
        <CloseIcon size={24} />
      </button>

      {hasMultiplePhotos && <NavigationButtons onNavigate={onNavigate} />}
    </>
  );
};
