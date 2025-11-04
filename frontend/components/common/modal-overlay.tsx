import { MODAL_STYLES } from '../photo-detail/edit-photo-modal/constants';

interface IModalOverlay {
  onClose: () => void;
  isLoading: boolean;
  children: React.ReactNode;
}

export const ModalOverlay = ({ onClose, isLoading, children }: IModalOverlay) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div className={MODAL_STYLES.OVERLAY} onClick={handleBackdropClick}>
      {children}
    </div>
  );
};
