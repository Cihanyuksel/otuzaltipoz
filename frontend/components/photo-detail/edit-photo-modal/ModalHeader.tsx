import { IoClose as CloseIcon } from 'react-icons/io5';
import { MODAL_STYLES } from './constants';

interface ModalHeaderProps {
  onClose: () => void;
  isLoading: boolean;
}

export const ModalHeader = ({ onClose, isLoading }: ModalHeaderProps) => {
  return (
    <div className={MODAL_STYLES.HEADER}>
      <h3 className="text-lg font-medium text-gray-100 border-b-2">Fotoğrafı Düzenle</h3>
      <button
        type="button"
        className={MODAL_STYLES.CLOSE_BUTTON}
        onClick={onClose}
        disabled={isLoading}
        aria-label="Modalı kapat"
      >
        <CloseIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
