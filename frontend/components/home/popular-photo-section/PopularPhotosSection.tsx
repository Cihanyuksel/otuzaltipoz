'use client';
import Link from 'next/link';
import { FaHeart as HeartIcon, FaRegCommentDots as CommentIcon } from 'react-icons/fa';
import { PopularPhoto } from 'types/photo';
import Image from 'next/image';
import Loader from '../../common/loader';
import { usePopularPhotosLogic } from './usePopularPhotosLogic';

const PopularPhotosSection = () => {
  const { tabs, activeTab, photos, isLoading, isError, handleTabChange, formatCount } = usePopularPhotosLogic();

  if (isError) {
    return (
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">Popüler fotoğraflar yüklenirken bir hata oluştu.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Popüler Fotoğraflar</h2>
          <p className="mt-4 text-lg text-gray-600">En çok beğenilen ve yorumlanan fotoğraflar.</p>
        </div>

        {/* TAB BUTONLARI */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-lg shadow-sm p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={isLoading}
                className={`
                  px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* FOTOĞRAFLAR, LOADER VEYA HATA MESAJI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {isLoading ? (
            <Loader className="col-span-full py-12" />
          ) : photos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-600">
                {activeTab === 'day' && 'Bugün popüler fotoğraf bulunmuyor.'}
                {activeTab === 'week' && 'Bu hafta popüler fotoğraf bulunmuyor.'}
                {activeTab === 'month' && 'Bu ay popüler fotoğraf bulunmuyor.'}
                {activeTab === 'all' && 'Henüz popüler fotoğraf bulunmuyor.'}
              </p>
            </div>
          ) : (
            photos.map((photo: PopularPhoto) => (
              <Link
                key={photo._id}
                href={`/photos/${photo._id}`}
                className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer block"
                prefetch={false}
              >
                <Image
                  alt={photo.title || `${photo.user.username}'in fotoğrafı`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src={photo.photo_url}
                  loading="lazy"
                  width={500}
                  height={500}
                />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:bg-black/50 transition-opacity duration-300 flex flex-col items-center justify-center pb-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2 text-white">
                      <HeartIcon className="w-4 h-4" />
                      <span className="font-semibold text-sm">{formatCount(photo.likeCount)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-white">
                      <CommentIcon className="w-4 h-4" />
                      <span className="font-semibold text-sm">{formatCount(photo.commentCount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {photo.user.profile_img_url ? (
                      <img
                        src={photo.user.profile_img_url}
                        alt={photo.user.username}
                        className="w-6 h-6 rounded-full border-2 border-white"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs text-gray-700 font-semibold">
                        {photo.user.username[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-white text-sm font-medium">@{photo.user.username}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularPhotosSection;
