'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHeart as HeartIcon, FaRegCommentDots as CommentIcon } from 'react-icons/fa';
import { photoService } from 'services/photoService';
import { PopularPhoto } from 'types/photo';
import Image from 'next/image';
import Loader from '../common/loader';

type TimeRange = 'all' | 'month' | 'week' | 'day';

const PopularPhotosSection = () => {
  const [activeTab, setActiveTab] = useState<TimeRange>('all');
  const [photos, setPhotos] = useState<PopularPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'all' as TimeRange, label: 'Tüm Zamanlar' },
    { id: 'month' as TimeRange, label: 'Bu Ay' },
    { id: 'week' as TimeRange, label: 'Bu Hafta' },
    { id: 'day' as TimeRange, label: 'Bugün' },
  ];

  const fetchPhotos = async (timeRange: TimeRange) => {
    setLoading(true);
    try {
      const response = await photoService.getPopularPhotos(10, timeRange);
      setPhotos(response.data || []);
    } catch (err) {
      console.error('Popular photos fetch error:', err);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos('all');
  }, []);

  const handleTabChange = (timeRange: TimeRange) => {
    if (timeRange === activeTab) return;
    setActiveTab(timeRange);
    fetchPhotos(timeRange);
  };

  const formatCount = (count: number): string => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

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
                disabled={loading}
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

        {/* LOADING */}
        {loading && <Loader />}

        {/* FOTOĞRAFLAR VEYA HATA MESAJI */}
        {!loading && photos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              {activeTab === 'day' && 'Bugün popüler fotoğraf bulunmuyor.'}
              {activeTab === 'week' && 'Bu hafta popüler fotoğraf bulunmuyor.'}
              {activeTab === 'month' && 'Bu ay popüler fotoğraf bulunmuyor.'}
              {activeTab === 'all' && 'Henüz popüler fotoğraf bulunmuyor.'}
            </p>
          </div>
        )}

        {!loading && photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularPhotosSection;
