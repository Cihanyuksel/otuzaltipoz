'use client';
import { useState, useEffect } from 'react';
import PhotoList from '@/components/photos/PhotoList';
import { useGetAllPhoto } from '@/hooks/usePhotoApi';
import { useSearch } from '@/context/SearchContext';
import Loader from '../common/loader';

export default function PhotoContainer() {
  const { searchValue } = useSearch();
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);

  const { data: response, isLoading, isError, error } = useGetAllPhoto(debouncedSearchValue);
  const photos = response?.data || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue]);

  const isDebouncing = searchValue !== debouncedSearchValue;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {isLoading || isDebouncing ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          <Loader />
        </div>
      ) : photos.length === 0 && debouncedSearchValue.length > 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">Fotoğraf bulunamadı. Lütfen başka bir anahtar kelime deneyin.</div>
      ) : (
        <PhotoList photos={photos} isLoading={isLoading} isError={isError} error={error} />
      )}
    </div>
  );
}
