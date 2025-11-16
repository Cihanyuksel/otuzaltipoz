'use client';

import { useEffect, useState } from 'react';
import PhotoList from '@/components/photos/photo-list/PhotoList';
import Loader from '@/common/loader';
import LoadMoreIndicator from './LoadMoreIndicator';
import { SearchBar } from './SearchBar';
import { usePhotos } from '@/context/PhotoContext';

interface IPhotoContent {
  isPhotosLoading: boolean;
  isDebouncing: boolean;
  showNoResults: boolean;
  isCategoriesLoading: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

const DEBOUNCE_DELAY = 500;

const PhotoContent = ({
  isPhotosLoading,
  isDebouncing,
  showNoResults,
  isCategoriesLoading,
  loadMoreRef,
}: IPhotoContent) => {
  const { searchQuery, setSearchQuery } = usePhotos();

  const [liveSearchValue, setLiveSearchValue] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(liveSearchValue);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [liveSearchValue, setSearchQuery]);

  useEffect(() => {
    if (searchQuery !== liveSearchValue) {
      setLiveSearchValue(searchQuery);
    }
  }, [searchQuery]);

  const shouldShowLoader = isPhotosLoading || isDebouncing;

  return (
    <section className="flex-1 overflow-y-auto p-4 bg-gray-100" id="scroll-container" aria-label="Fotoğraf Listesi">
      <div className="mb-6 w-full lg:w-3/4 xl:w-1/2">
        <SearchBar value={liveSearchValue} onChange={setLiveSearchValue} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {shouldShowLoader && (
          <div className="col-span-full text-center py-8 text-gray-500" aria-live="polite">
            <Loader />
          </div>
        )}

        {!shouldShowLoader && showNoResults && (
          <div className="col-span-full text-center py-8 text-gray-500" role="status">
            Aradığınız kriterlere uygun fotoğraf bulunamadı. Lütfen başka bir anahtar kelime veya kategori deneyin.
          </div>
        )}

        {!shouldShowLoader && !showNoResults && <PhotoList />}

        <LoadMoreIndicator
          loadMoreRef={loadMoreRef}
          isCategoriesLoading={isCategoriesLoading}
          showNoResults={showNoResults}
        />
      </div>
    </section>
  );
};

export default PhotoContent;
