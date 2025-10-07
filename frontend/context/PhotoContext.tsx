'use client';
import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Photo } from 'types/photo';
import { useAuth } from './AuthContext';
import { useSearch } from './SearchContext';
import { useGetAllPhoto } from '@/hooks/api/usePhotoApi';
import { useToggleLike } from '@/hooks/api/useLikeApi';

interface PhotosContextType {
  photos: Photo[] | undefined;
  isLoading: boolean;
  error: Error | null;
  toggleLike: (photoId: string) => void;
  refetch: () => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const PhotosContext = createContext<PhotosContextType | undefined>(undefined);

interface PhotosProviderProps {
  children: ReactNode;
}

export const PhotosProvider = ({ children }: PhotosProviderProps) => {
  const { accessToken, user } = useAuth();
  const { searchValue } = useSearch();
  const searchParams = useSearchParams();

  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    data: allPhotos,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllPhoto(
    debouncedSearchValue,
    accessToken,
    selectedCategories.length > 0 ? selectedCategories.join(',') : undefined
  );

  const toggleLikeMutation = useToggleLike();

  useEffect(() => {
    const categoriesFromUrl = searchParams.get('categories');
    if (categoriesFromUrl) {
      const categoriesArray = categoriesFromUrl.split(',').filter(Boolean);
      if (JSON.stringify(categoriesArray) !== JSON.stringify(selectedCategories)) {
        setSelectedCategories(categoriesArray);
      }
    } else if (selectedCategories.length > 0) {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchValue(searchValue), 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const photos = allPhotos?.pages.flatMap((page: any) => page.data) ?? [];

  useEffect(() => {
    if (user !== null && !allPhotos && !isLoading && !error) {
      console.log('refetch çağrıldı, user:', user);
      refetch();
    }
  }, [user, refetch, allPhotos, isLoading, error]);

  const toggleLike = useCallback(
    (photoId: string) => {
      console.log('toggleLike çağrıldı, photoId:', photoId);
      toggleLikeMutation.mutate(
        {
          photoId,
          accessToken,
          searchQuery: debouncedSearchValue,
          hasToken: !!accessToken,
          categories: selectedCategories.join(',') || undefined,
        },
        {
          onSuccess: () => {
            console.log('toggleLike başarılı, photoId:', photoId);
          },
          onError: (error) => {
            console.log('toggleLike hata, photoId:', photoId, 'error:', error);
          },
        }
      );
    },
    [accessToken, toggleLikeMutation, debouncedSearchValue, selectedCategories]
  );

  const value: PhotosContextType = {
    photos,
    isLoading,
    error,
    toggleLike,
    refetch,
    selectedCategories,
    setSelectedCategories,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };

  return <PhotosContext.Provider value={value}>{children}</PhotosContext.Provider>;
};

export const usePhotos = () => {
  const context = useContext(PhotosContext);
  if (!context) throw new Error('usePhotos must be used within a PhotosProvider');
  return context;
};

