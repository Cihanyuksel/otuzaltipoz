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
      className="absolute bottom-0 left-0 right-0 p-4 md:p-5 xl:p-6 flex flex-col justify-start transition-all duration-300 opacity-100 translate-y-0 xl:opacity-0 xl:translate-y-full xl:group-hover:opacity-100 xl:group-hover:translate-y-0"
      style={INFO_PANEL_STYLE}
    >
      <h2 className="text-lg md:text-xl xl:text-2xl font-extrabold mb-1 uppercase text-gray-200">{photo.title}</h2>
      <p className="text-xs md:text-sm xl:text-base text-gray-300">{photo.description}</p>

      {photo.user && (
        <div className="mt-2 md:mt-3 xl:mt-4 pt-2 md:pt-3 xl:pt-4 border-t border-gray-500">
          <p className="text-xs xl:text-sm text-gray-300 font-semibold">@{photo.user.username}</p>
          {isEdited ? (
            <p className="text-[10px] xl:text-xs text-gray-400">Düzenlenme Tarihi: {editedDate}</p>
          ) : (
            <p className="text-[10px] xl:text-xs text-gray-400">Yüklenme Tarihi: {date}</p>
          )}
        </div>
      )}
    </motion.div>
  );
};
