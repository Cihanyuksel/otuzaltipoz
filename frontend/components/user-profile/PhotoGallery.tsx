import Link from 'next/link';
import { FaHeart as HeartIcon } from 'react-icons/fa6';
import { FaRegCommentDots as CommentIcon } from 'react-icons/fa';
import { Photo } from 'types/photo';
import { memo } from 'react';

interface IPhotoGallery {
  photosToShow: Photo[];
  isOwner: boolean;
  activeTab: 'uploaded' | 'liked' | string;
}

const PhotoGallery = memo(({ photosToShow, isOwner, activeTab }: IPhotoGallery) => {
  const getEmptyMessage = () => {
    if (activeTab === 'liked') {
      return {
        title: 'Henüz fotoğraf beğenmediniz.',
        subtitle: 'Beğendiğiniz fotoğraflar burada görünecektir.',
      };
    }

    return {
      title: 'Henüz fotoğraf yok.',
      subtitle: isOwner ? 'İlk fotoğrafını şimdi yükleyerek profilini canlandır.' : 'Kullanıcının henüz fotoğrafı yok.',
    };
  };

  const { title, subtitle } = getEmptyMessage();

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {photosToShow.length > 0 ? (
        photosToShow.map((photo) => (
          <Link
            key={photo._id}
            href={`/photos/${photo._id}`}
            className="group relative aspect-square block rounded-lg border border-gray-300 overflow-hidden"
            prefetch={false}
          >
            <img src={photo.photo_url} alt="User Photo" className="h-full w-full object-contain bg-gray-100" />
            <div className="absolute inset-0 flex h-full w-full items-center justify-center gap-4 bg-[#d3deda] bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex items-center gap-1 text-[#f5f1ea]">
                <HeartIcon className="text-lg" />
                <span className="text-sm font-medium">{photo.likeCount}</span>
              </div>
              <div className="flex items-center gap-1 text-[#f5f1ea]">
                <CommentIcon className="text-lg" />
                <span className="text-sm font-medium">{photo.commentCount}</span>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center col-span-2 sm:col-span-3 md:col-span-4 p-8 text-center bg-gray-50 rounded-lg shadow-sm">
          <p className="text-lg font-semibold text-gray-700">{title}</p>

          {isOwner && activeTab === 'uploaded' ? (
            <>
              <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
              <Link
                href="/photo-upload"
                className="mt-4 px-6 py-2 bg-[#d3deda] text-white font-bold rounded-full hover:bg-[#d3dedac6] transition duration-300 shadow-md"
              >
                Fotoğraf Yükle
              </Link>
            </>
          ) : (
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
});

export default PhotoGallery;
