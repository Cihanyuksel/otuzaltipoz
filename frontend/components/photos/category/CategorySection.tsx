'use client';
import Link from 'next/link';
import { IoIosArrowForward as ArrowRightIcon, IoIosClose as CloseIcon } from 'react-icons/io';
import { renderIcon } from './SectionConfig';

interface ICategorySection {
  title: string;
  items: string[];
  isOpen: boolean;
  onToggle: () => void;
  isSidebarOpen: boolean;
  iconName: string;
  onCategoryClick: (categoryName: string) => void;
  selectedCategories: string[];
  onRemoveCategory: (categoryName: string) => void;
}

export const CategorySection: React.FC<ICategorySection> = ({
  title,
  items,
  isOpen,
  onToggle,
  isSidebarOpen,
  iconName,
  selectedCategories,
  onRemoveCategory,
}) => {
  return (
    <li className="mb-1">
      <div
        className={`
          flex items-center cursor-pointer py-3 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300
          ${!isSidebarOpen ? 'justify-center' : 'justify-between'}
        `}
        onClick={onToggle}
      >
        <div className={`flex items-center space-x-3 ${!isSidebarOpen ? 'justify-center' : ''}`}>
          <span className="flex-shrink-0">{renderIcon(iconName)}</span>
          {isSidebarOpen && <span className="font-medium text-sm truncate">{title}</span>}
        </div>

        {isSidebarOpen && (
          <button
            className="flex-shrink-0 text-gray-500 hover:text-[#ef7464] transition-colors"
            aria-label={isOpen ? `${title} bölümünü kapat` : `${title} bölümünü aç`}
          >
            <ArrowRightIcon
              size={16}
              className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
            />
          </button>
        )}
      </div>

      {isSidebarOpen && isOpen && (
        <ul className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
          {items.map((item) => {
            const isSelected = selectedCategories.includes(item);
            return (
              <li key={item}>
                <Link
                  href={`/photos?categories=${encodeURIComponent(
                    isSelected
                      ? selectedCategories.filter((c) => c !== item).join(',')
                      : [...selectedCategories, item].slice(0, 3).join(',')
                  )}`}
                  className={`
                    flex items-center justify-between py-2 px-3 rounded-md text-sm transition-all duration-200
                    ${
                      isSelected
                        ? 'bg-[#ef7464] text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-[#ef7464]'
                    }
                  `}
                >
                  <span className="truncate">{item}</span>

                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveCategory(item);
                      }}
                      className="ml-2 flex-shrink-0 text-white hover:text-gray-100 transition focus:outline-none cursor-pointer"
                      aria-label={`${item} kategorisini kaldır`}
                    >
                      <CloseIcon size={18} />
                    </button>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};
