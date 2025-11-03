'use client';
import {
  IoIosArrowDown as ArrowDownIcon,
  IoIosArrowUp as ArrowUpIcon,
  IoIosArrowForward as ArrowRightIcon,
} from 'react-icons/io';
import { renderIcon } from './SectionConfig';

interface NavigationItem {
  label: string;
  path: string;
  disabled: boolean;
}

interface INavigationSection {
  title: string;
  items: NavigationItem[];
  isOpen: boolean;
  onToggle: () => void;
  isSidebarOpen: boolean;
  iconName: string;
}

export function NavigationSection({ title, items, isOpen, onToggle, isSidebarOpen, iconName }: INavigationSection) {
  return (
    <li className="mb-1">
      <div
        onClick={isSidebarOpen ? onToggle : undefined}
        className={`
          flex items-center justify-between py-3 px-3 
          text-gray-700 hover:bg-gray-100 rounded-lg 
          transition-all duration-300 
          ${isSidebarOpen ? 'cursor-pointer' : 'justify-center'}
        `}
      >
        <div className="flex items-center space-x-3">
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
            />{' '}
          </button>
        )}
      </div>

      {isSidebarOpen && isOpen && (
        <ul className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
          {items.map((item) => (
            <li key={item.path}>
              <button
                disabled={item.disabled}
                className={`
                  w-full text-left py-2 px-3 rounded-md text-sm transition-all duration-200
                  ${
                    item.disabled
                      ? 'text-gray-400 cursor-not-allowed line-through opacity-60'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#ef7464]'
                  }
                `}
                title={item.disabled ? 'Yakında eklenecek' : item.label}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
