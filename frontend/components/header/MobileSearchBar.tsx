import React from 'react';

export default function MobileSearchBar() {
  return (
    <div className="w-full px-4">
      <input
        type="text"
        placeholder="Fotoğraf ara..."
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#d3deda]"
      />
    </div>
  );
}