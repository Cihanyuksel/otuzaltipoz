'use client';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Photo } from 'types/photo';
import { useAuth } from './AuthContext';
import { useGetAllPhoto } from '@/hooks/api/usePhotoApi';

interface PhotosContextType {
  photos: Photo[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PhotosContext = createContext<PhotosContextType | undefined>(undefined);

interface PhotosProviderProps {
  children: ReactNode;
}

export const PhotosProvider = ({ children }: PhotosProviderProps) => {
  const { accessToken, user } = useAuth();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [previousUserId, setPreviousUserId] = useState<string | null>(null);

  const {
    data: allPhotos,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllPhoto(
    searchQuery,
    accessToken,
    selectedCategories.length > 0 ? selectedCategories.join(',') : undefined
  );

  useEffect(() => {
    const currentUserId = user?._id || null;

    if (previousUserId !== currentUserId) {
      queryClient.invalidateQueries({ queryKey: ['likes'] });
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['likedPhotos'] });
      queryClient.invalidateQueries({ queryKey: ['ratings'] });

      setPreviousUserId(currentUserId);
    }
  }, [user?._id, previousUserId, queryClient]);

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

  const photos = allPhotos?.pages.flatMap((page: any) => page.data) ?? [];

  useEffect(() => {
    if (user !== null && !allPhotos && !isLoading && !error) {
      refetch();
    }
  }, [user, refetch, allPhotos, isLoading, error]);

  const value: PhotosContextType = {
    photos,
    isLoading,
    error,
    refetch,
    selectedCategories,
    setSelectedCategories,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    searchQuery,
    setSearchQuery,
  };

  return <PhotosContext.Provider value={value}>{children}</PhotosContext.Provider>;
};

export const usePhotos = () => {
  const context = useContext(PhotosContext);
  if (!context) throw new Error('usePhotos must be used within a PhotosProvider');
  return context;
};
