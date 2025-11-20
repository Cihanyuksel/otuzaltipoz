import { FaArrowLeft as ArrowLeftIcon, FaArrowRight as ArrowRightIcon } from 'react-icons/fa';

type NavigationDirection = 'prev' | 'next';

interface INavigationButtons {
  onNavigate: (direction: NavigationDirection) => void;
}

const buttonBaseClass =
  'absolute top-1/2 -translate-y-1/2 text-white hover:text-gray-200 p-2 md:p-3 xl:p-4 rounded-full bg-black/40 hover:bg-black/60 transition z-20 cursor-pointer';

const iconBaseClass = 'w-4 h-4 md:w-6 md:h-6 xl:w-8 xl:h-8';

export const NavigationButtons = ({ onNavigate }: INavigationButtons) => {
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate('prev');
        }}
        className={`${buttonBaseClass} left-2 md:left-4`}
        aria-label="Önceki fotoğraf"
      >
        <ArrowLeftIcon className={iconBaseClass} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate('next');
        }}
        className={`${buttonBaseClass} right-2 md:right-4`}
        aria-label="Sonraki fotoğraf"
      >
        <ArrowRightIcon className={iconBaseClass} />
      </button>
    </>
  );
};
