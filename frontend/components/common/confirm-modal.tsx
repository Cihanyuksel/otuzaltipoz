'use client';
import { IoClose as CloseIcon } from 'react-icons/io5';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  confirmButtonText: string;
  isConfirming: boolean | undefined
  error?: string | null;
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
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-50/50 " onClick={handleBackdropClick}>
      <div
        className="w-full max-w-sm bg-white rounded-lg shadow-xl transform transition-all scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            type="button"
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
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
          <p className="text-gray-700 text-sm mb-6">{message}</p>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isConfirming}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isConfirming}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px]"
            >
              {isConfirming ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {confirmButtonText.replace('...', '') + '...'}
                </div>
              ) : (
                confirmButtonText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;