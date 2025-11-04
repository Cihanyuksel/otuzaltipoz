'use client';
import { MdSearch as SearchIcon, MdClose as CloseIcon } from 'react-icons/md';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ value, onChange, placeholder = 'Fotoğraf ara...', className = '' }: SearchBarProps) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`col-span-full mb-6 ${className}`}>
      <div className="max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-4 h-5 w-5 text-gray-500 pointer-events-none" />

          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 pl-12 pr-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef7464] focus:border-transparent transition-all shadow-sm"
            aria-label="Arama kelimesini girin"
          />

          {value.length > 0 && (
            <button
              onClick={handleClear}
              className="absolute right-3 p-1 rounded-full text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ef7464] transition-colors duration-150"
              aria-label="Aramayı temizle"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
