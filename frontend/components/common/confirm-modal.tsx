'use client';
import Button from './button';
import ModalOverlay from '@/components/common/modal-overlay';
import ModalContent from '@/components/common/modal-content';
import CustomCloseButton from '@/components/common/close-button';

interface IConfirmModal {
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

const ConfirmModal = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmButtonText,
  isConfirming = false,
  error,
}: IConfirmModal) => {
  return (
    <ModalOverlay isModalVisible={isOpen} onClose={onClose} isLoading={!!isConfirming}>
      <ModalContent isOpen={isOpen} className="w-full max-w-sm bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>

          <CustomCloseButton onClose={onClose} disabled={isConfirming} className="static top-auto right-auto" />
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">{error}</div>
          )}

          <div className="text-gray-700 text-sm mb-6">{message}</div>

          <div className="flex justify-end space-x-3">
            <Button onClick={onClose} type="button" variant="tertiary" size="medium" disabled={isConfirming}>
              İptal
            </Button>

            <Button onClick={onConfirm} type="button" variant="danger" size="medium" disabled={isConfirming}>
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
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmModal;
