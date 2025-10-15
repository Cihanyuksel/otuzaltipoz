'use client';
import { MdSearch as SearchIcon } from 'react-icons/md';
import { useSearch } from '@/context/SearchContext';
import { useRouter } from 'next/navigation';

interface HeaderSearchBarProps {
  isScrolled: boolean;
}

export default function HeaderSearchBar({ isScrolled }: HeaderSearchBarProps) {
  const { searchValue, setSearchValue } = useSearch();
  const router = useRouter();

  const handleSearchClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    setTimeout(() => {
      const searchInput = document.getElementById('search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }, 300);
  };

  const containerClasses = `hidden md:block 2xl:w-1/3 relative transition-all duration-300 ease-in-out`;
  const inputClasses = `pr-10 pl-2 py-2 2xl:w-full 2xl:p-5  border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#d3deda] text-gray-800 placeholder-gray-600 transition-all duration-300 ease-in-out`;
  const iconWrapperClasses = `absolute inset-y-0 right-0  flex items-center transition-all duration-300 ease-in-out bg-[#d3deda] rounded text-white`;

  return (
    <div className={containerClasses}>
      {isScrolled ? (
        <button
          className="bg-[#d3deda] p-2 rounded-full shadow-md hover:bg-[#aeb8b4] transition-colors duration-300 cursor-pointer"
          onClick={handleSearchClick}
          aria-label="Aramaya git"
        >
          <SearchIcon className="h-6 w-6" aria-label="Ara" />
        </button>
      ) : (
        <>
          <input
            id="search-input"
            type="text"
            placeholder="Fotoğraf ara..."
            className={inputClasses}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className={`${iconWrapperClasses} pointer-events-none p-2 2xl:p-5`}>
            <SearchIcon className="h-5 w-5" />
          </div>
        </>
      )}
    </div>
  );
}
