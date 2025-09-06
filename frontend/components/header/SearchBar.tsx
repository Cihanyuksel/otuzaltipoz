import React from 'react';

export default function HeaderSearchBar() {
  return (
    <div className="flex-1 max-w-sm mx-auto hidden md:block">
      <input
        type="text"
        placeholder="Fotoğraf ara..."
        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-[#d3deda]"
      />
    </div>
  );
}
