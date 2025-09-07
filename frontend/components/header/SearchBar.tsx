import { MdSearch } from 'react-icons/md';

export default function HeaderSearchBar() {
  return (
    <div className="flex-1 max-w-sm mx-auto hidden md:block relative">
      <input
        type="text"
        placeholder="Fotoğraf ara..."
        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#d3deda] text-gray-800 placeholder-gray-600"
      />
      <div className="absolute inset-y-0 right-0 p-3 flex items-center pointer-events-none bg-[#d3deda]">
        <MdSearch className="h-5 w-5 text-white" />
      </div>
    </div>
  );
}