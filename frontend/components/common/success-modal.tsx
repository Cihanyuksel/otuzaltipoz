import { IoCheckmarkCircleSharp } from 'react-icons/io5';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, message, buttonText = 'Kapat' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5f1ea]/50  backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <IoCheckmarkCircleSharp className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-center text-gray-600 mb-6">{message}</p>
      </div>
    </div>
  );
};

export default SuccessModal;
