'use client';
import { useState, useEffect } from 'react';
import { IoClose as CloseIcon } from 'react-icons/io5';
import Button from './button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  confirmButtonText: string;
  isConfirming: boolean | undefined;
  error?: string | null;
  modalType?: 'edit' | 'delete' | 'delete-comment';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmButtonText,
  isConfirming,
  error,
  modalType,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isModalVisible, setIsModalVisible] = useState(isOpen);

  const ANIMATION_DURATION = 300;

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsModalVisible(true), 10);
    } else {
      setIsModalVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isCommentDelete = modalType === 'delete-comment';

  const backdropBaseClass = isCommentDelete
    ? 'fixed bottom-14 inset-0 z-50 flex items-center justify-center p-4'
    : 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f5f1ea]/50';

  const backdropTransitionClass = `transition-opacity duration-${ANIMATION_DURATION}`;
  const backdropOpacityClass = isModalVisible ? 'opacity-100' : 'opacity-0';

  const modalBaseClass = 'w-full max-w-sm bg-white rounded-lg shadow-xl transform';
  const modalTransitionClass = `transition-all duration-${ANIMATION_DURATION} ease-out`;
  const modalStateClass = isModalVisible
    ? 'scale-100 opacity-100 translate-y-0'
    : 'scale-95 opacity-0 translate-y-2';

  return (
    <div
      className={`${backdropBaseClass} ${backdropTransitionClass} ${backdropOpacityClass}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`${modalBaseClass} ${modalTransitionClass} ${modalStateClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            type="button"
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={onClose}
            disabled={isConfirming}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}
          <div className="text-gray-700 text-sm mb-6">{message}</div>

          <div className="flex justify-end space-x-3">
            <Button
              onClick={onClose}
              type="button"
              variant="tertiary"
              size="medium"
              disabled={isConfirming}
            >
              İptal
            </Button>
            <Button
              onClick={onConfirm}
              type="button"
              variant="danger"
              size="medium"
              disabled={isConfirming}
            >
              {isConfirming ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {confirmButtonText.replace('...', '') + '...'}
                </div>
              ) : (
                confirmButtonText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;