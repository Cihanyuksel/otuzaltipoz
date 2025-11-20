'use client';
import React, { useEffect, useState } from 'react';
import { useGetPopularPhotos } from '@/hooks/api/usePhotoApi';
import Link from 'next/link';
import Image from 'next/image';
import { Photo } from 'types/photo';

const DISPLAY_COUNT = 3;

const WeeklyUploads = () => {
  const { data: photos = [], isLoading } = useGetPopularPhotos('week');

  const [randomPhotos, setRandomPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (photos && photos.length > 0) {
      const shuffled = [...photos];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      setRandomPhotos(shuffled.slice(0, DISPLAY_COUNT) as Photo[]);
    }
  }, [photos]);

  const showSkeleton = isLoading || randomPhotos.length === 0;
  const skeletons = Array.from({ length: DISPLAY_COUNT });

  return (
    <aside className="hidden w-full flex-col gap-6 lg:flex">
      <h3 className="text-xl font-bold text-[#1b140e]">Haftanın Yüklemeleri</h3>

      <div className="space-y-4">
        {showSkeleton
          ? skeletons.map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 w-full rounded-lg bg-gray-200 mb-2"></div>
                <div className="h-4 w-3/4 rounded bg-gray-200 mb-1"></div>
                <div className="h-3 w-1/2 rounded bg-gray-200"></div>
              </div>
            ))
          : randomPhotos.map((photo) => (
              <Link
                href={`/photos/${photo._id}`}
                key={photo._id}
                className="group block overflow-hidden rounded-lg cursor-pointer"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={photo.photo_url || (photo as any).image}
                    alt={photo.title || 'Haftanın fotoğrafı'}
                    fill
                    sizes="(max-width: 1024px) 100vw, 300px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="mt-2">
                  <p className="text-sm font-medium text-[#1b140e] truncate">{photo.title}</p>
                  <p className="text-xs text-gray-500">{photo.user?.full_name}</p>
                </div>
              </Link>
            ))}

        {!isLoading && photos.length === 0 && (
          <p className="text-sm text-gray-500">Bu hafta henüz yükleme yapılmadı.</p>
        )}
      </div>
    </aside>
  );
};

export default WeeklyUploads;
