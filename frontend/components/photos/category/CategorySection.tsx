import Link from 'next/link';
import { FaAngleRight as ArrowRightIcon, FaTimes as CloseIcon } from 'react-icons/fa';

interface SectionProps {
  title: string;
  items: string[];
  isOpen: boolean;
  onToggle: () => void;
  isSidebarOpen: boolean;
  icon: React.ReactNode;
  onCategoryClick: (categoryName: string) => void;
  selectedCategories: string[];
  onRemoveCategory: (categoryName: string) => void;
}

export const CategorySection: React.FC<SectionProps> = ({
  title,
  items,
  isOpen,
  onToggle,
  isSidebarOpen,
  icon,
  selectedCategories,
  onRemoveCategory,
}) => {
  return (
    <div>
      <div
        className={`
          flex items-center cursor-pointer p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors
          ${!isSidebarOpen ? 'justify-center' : 'justify-between'}
        `}
        onClick={onToggle}
      >
        <div className={`flex items-center gap-2 ${!isSidebarOpen ? 'justify-center' : ''}`}>
          {isSidebarOpen ? (
            <>
              {icon}
              <span className="whitespace-nowrap">{title}</span>
            </>
          ) : (
            <span className="text-xl text-gray-600">{icon}</span>
          )}
        </div>

        {isSidebarOpen && (
          <ArrowRightIcon
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
          />
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen && isSidebarOpen ? 'h-auto opacity-100' : 'h-0 opacity-0'
        }`}
      >
        <ul className="pl-4 space-y-1 mt-1">
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
                  className={`flex items-center justify-between p-1 rounded-lg text-sm transition-colors ${
                    isSelected ? 'bg-[#f5f1ea] text-gray-500 font-semibold' : 'text-gray-500 hover:bg-[#f5f1ea]'
                  }`}
                >
                  {item}

                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveCategory(item);
                      }}
                      className="ml-2 p-0.5 rounded-full hover:bg-gray-200 text-gray-500 focus:outline-none"
                      aria-label={`${item} kategorisini kaldır`}
                    >
                      <CloseIcon size={10} />
                    </button>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
