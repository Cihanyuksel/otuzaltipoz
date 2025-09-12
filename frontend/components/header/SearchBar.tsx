'use client';
import { MdSearch } from 'react-icons/md';
import { useSearch } from '@/context/SearchContext';

export default function HeaderSearchBar() {
  const { searchValue, setSearchValue } = useSearch();

  return (
    <div className="flex-1 max-w-sm mx-auto hidden md:block relative">
      <input
        type="text"
        placeholder="Fotoğraf ara..."
        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#d3deda] text-gray-800 placeholder-gray-600"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div className="absolute inset-y-0 right-0 p-3 flex items-center pointer-events-none bg-[#d3deda]">
        <MdSearch className="h-5 w-5 text-white" />
      </div>
    </div>
  );
}
