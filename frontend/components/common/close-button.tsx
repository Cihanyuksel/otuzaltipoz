import { FaTimes as CloseIcon } from 'react-icons/fa';

interface ICustomCloseButton {
  onClose: () => void;
  className?: string;
  disabled?: boolean;
}

const CustomCloseButton = ({ onClose, className = '', disabled = false }: ICustomCloseButton) => {
  return (
    <button
      onClick={onClose}
      type="button"
      disabled={disabled}
      className={`
        absolute top-4 right-4 z-10
        flex items-center justify-center
        w-8 h-8 rounded-full
        text-gray-500 hover:text-gray-900
        bg-transparent hover:bg-black/5
        transition-all duration-200 ease-in-out
        hover:rotate-90 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-gray-300
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      aria-label="Kapat"
    >
      <CloseIcon className="w-4 h-4" />
    </button>
  );
};

export default CustomCloseButton;
