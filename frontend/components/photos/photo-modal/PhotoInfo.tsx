import { motion } from 'framer-motion';
import { formatDateNumeric } from 'lib/formatDate';
import { INFO_PANEL_STYLE } from './constants';
import { Photo } from 'types/photo';

interface IPhotoInfo {
  photo: Photo;
}

export const PhotoInfo = ({ photo }: IPhotoInfo) => {
  const date = photo.created_at ? formatDateNumeric(photo.created_at) : null;
  const isEdited = photo.updated_at && photo.updated_at !== photo.created_at;
  const editedDate = isEdited && photo.updated_at ? formatDateNumeric(photo.updated_at) : null;

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-start transition-all duration-300 opacity-0 transform translate-y-full group-hover:opacity-100 group-hover:translate-y-0"
      style={INFO_PANEL_STYLE}
    >
      <h2 className="text-xl md:text-2xl font-extrabold mb-1 uppercase text-gray-200">{photo.title}</h2>
      <p className="text-sm md:text-base text-gray-300">{photo.description}</p>

      {photo.user && (
        <div className="mt-4 pt-4 border-t border-gray-500">
          <p className="text-sm text-gray-300 font-semibold">@{photo.user.username}</p>
          {isEdited ? (
            <p className="text-xs text-gray-400">Düzenlenme Tarihi: {editedDate}</p>
          ) : (
            <p className="text-xs text-gray-400">Yüklenme Tarihi: {date}</p>
          )}
        </div>
      )}
    </motion.div>
  );
};
