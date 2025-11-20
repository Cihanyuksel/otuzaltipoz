import React from 'react';
import { MODAL_STYLES } from '../photo-detail/edit-photo-modal/constants';

interface IModalOverlay {
  onClose: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
  isModalVisible: boolean;
}

const ModalOverlay = ({ onClose, isLoading, children, isModalVisible }: IModalOverlay) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className={`
        ${MODAL_STYLES.OVERLAY} 
        ${isModalVisible ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}
      `}
      onClick={handleBackdropClick}
      aria-hidden={!isModalVisible}
    >
      {children}
    </div>
  );
};

export default ModalOverlay;
