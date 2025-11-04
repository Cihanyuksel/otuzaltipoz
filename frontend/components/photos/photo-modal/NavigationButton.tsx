import { FaArrowLeft as ArrowLeftIcon, FaArrowRight as ArrowRightIcon } from 'react-icons/fa';

type NavigationDirection = 'prev' | 'next';

interface INavigationButtons {
  onNavigate: (direction: NavigationDirection) => void;
}

const buttonBaseClass =
  'absolute top-1/2 -translate-y-1/2 text-white hover:text-gray-200 p-3 rounded-full bg-black/40 hover:bg-black/60 transition z-20 cursor-pointer';

export const NavigationButtons: React.FC<INavigationButtons> = ({ onNavigate }) => {
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate('prev');
        }}
        className={`${buttonBaseClass} left-4`}
        aria-label="Önceki fotoğraf"
      >
        <ArrowLeftIcon size={24} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate('next');
        }}
        className={`${buttonBaseClass} right-4`}
        aria-label="Sonraki fotoğraf"
      >
        <ArrowRightIcon size={24} />
      </button>
    </>
  );
};
