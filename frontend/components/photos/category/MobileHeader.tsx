import { FaBars as MenuIcon, FaTimes as CloseIcon } from 'react-icons/fa';

interface MobileHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  selectedCategories: string[];
  MAX_CATEGORIES: number;
}

export default function MobileHeader({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  selectedCategories,
  MAX_CATEGORIES,
}: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3 lg:hidden">
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          <span>Fotoğrafları Keşfet</span>
        </button>
        {selectedCategories.length > 0 && (
          <span className="bg-[#f5f1ea] text-gray-500 text-xs font-semibold px-2 py-1 rounded-full">
            {selectedCategories.length}/{MAX_CATEGORIES}
          </span>
        )}
      </div>
    </header>
  );
}
