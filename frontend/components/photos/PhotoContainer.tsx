'use client';
import { useState, useEffect } from 'react';
import PhotoList from '@/components/photos/PhotoList';
import { useSearch } from '@/context/SearchContext';
import { usePhotos } from '@/context/PhotoContext';
import Loader from '@/components/common/loader';

const PhotoContainer = function PhotoContainer() {
  const { searchValue: searchQuery } = useSearch();
  const { photos, isLoading, error } = usePhotos();

  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchQuery);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const isDebouncing = searchQuery !== debouncedSearchValue;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {isLoading || isDebouncing ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          <Loader />
        </div>
      ) : photos?.length === 0 && debouncedSearchValue.length > 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">Fotoğraf bulunamadı. Lütfen başka bir anahtar kelime deneyin.</div>
      ) : (
        <PhotoList photos={photos || []} isLoading={isLoading} error={error} />
      )}
    </div>
  );
};

export default PhotoContainer;
