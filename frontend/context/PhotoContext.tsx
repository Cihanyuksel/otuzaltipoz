import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Photo, ApiResponse } from 'types/photo';
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
}

const PhotosContext = createContext<PhotosContextType | undefined>(undefined);

interface PhotosProviderProps {
  children: ReactNode;
}

export const PhotosProvider = ({ children }: PhotosProviderProps) => {
  const queryClient = useQueryClient();
  const { accessToken, user } = useAuth();
  const { searchValue } = useSearch();
  const searchParams = useSearchParams();

  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    data: photosResponse,
    isLoading,
    error,
    refetch,
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
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  const photos = photosResponse?.data;

  useEffect(() => {
    if (user !== null) {
      refetch();
    }
  }, [user, refetch]);

  const toggleLike = useCallback(
    (photoId: string) => {
      const queryKey = [
        'photos',
        {
          searchQuery: debouncedSearchValue,
          hasToken: !!accessToken,
          categories: selectedCategories.join(',') || undefined,
        },
      ];

      queryClient.setQueryData<ApiResponse<Photo[]>>(queryKey, (oldData) => {
        if (!oldData?.data) return oldData;

        const updatedPhotos = oldData.data.map((photo) => {
          if (photo._id === photoId) {
            return {
              ...photo,
              isLikedByMe: !photo.isLikedByMe,
              likeCount: photo.isLikedByMe ? photo.likeCount - 1 : photo.likeCount + 1,
            };
          }
          return photo;
        });

        return {
          ...oldData,
          data: updatedPhotos,
        };
      });

      toggleLikeMutation.mutate(
        { photoId, accessToken },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['photos'],
              exact: false,
            });
          },
          onError: () => {
            queryClient.invalidateQueries({ queryKey });
            refetch();
          },
        }
      );
    },
    [accessToken, toggleLikeMutation, queryClient, debouncedSearchValue, selectedCategories, refetch]
  );

  const value: PhotosContextType = {
    photos,
    isLoading,
    error,
    toggleLike,
    refetch,
    selectedCategories,
    setSelectedCategories,
  };

  return <PhotosContext.Provider value={value}>{children}</PhotosContext.Provider>;
};

export const usePhotos = () => {
  const context = useContext(PhotosContext);
  if (context === undefined) {
    throw new Error('usePhotos must be used within a PhotosProvider');
  }
  return context;
};
