import React from 'react';
import { CiEdit as EditIcon } from 'react-icons/ci';
import { RiDeleteBin6Line as DeleteIcon } from 'react-icons/ri';

interface IPhotoActions {
  handleModalToggle: (type: 'edit' | 'delete', value: boolean) => void;
}

const PhotoActions: React.FC<IPhotoActions> = ({ handleModalToggle }) => {
  return (
    <div className="mt-4 md:mt-8 flex gap-3 justify-end w-full">
      <button
        onClick={() => handleModalToggle('edit', true)}
        className="flex-1 md:flex-none rounded-xl border border-gray-300 h-10 px-5 text-sm font-semibold text-gray-700 transition-all shadow-sm hover:shadow-md hover:bg-gray-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        <EditIcon className="w-4 h-4" />
        <span className="md:inline">Düzenle</span>
      </button>
      <button
        onClick={() => handleModalToggle('delete', true)}
        className="flex-1 md:flex-none rounded-xl border border-red-400 h-10 px-5 text-sm font-semibold text-red-600 transition-all shadow-sm hover:shadow-md hover:bg-red-400 hover:text-white flex items-center justify-center gap-2 cursor-pointer"
      >
        <DeleteIcon className="w-4 h-4" />
        <span className="md:inline">Sil</span>
      </button>
    </div>
  );
};

export default PhotoActions;
