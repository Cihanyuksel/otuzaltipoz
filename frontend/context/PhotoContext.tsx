//nextjs and react
import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
//third-party
import { useQueryClient } from '@tanstack/react-query';
//project-files
import { Photo, ApiResponse } from 'types/photo';
import { useAuth } from './AuthContext';
import { useSearch } from './SearchContext';
import { useGetAllPhoto } from '@/hooks/usePhotoApi';
import { useToggleLike } from '@/hooks/useLikeApi';

interface PhotosContextType {
  photos: Photo[] | undefined;
  isLoading: boolean;
  error: Error | null;
  toggleLike: (photoId: string) => void;
  refetch: () => void;
}

const PhotosContext = createContext<PhotosContextType | undefined>(undefined);

interface PhotosProviderProps {
  children: ReactNode;
}

export const PhotosProvider = ({ children }: PhotosProviderProps) => {
  const queryClient = useQueryClient();
  const { accessToken, user } = useAuth();
  const { searchValue } = useSearch();

  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  const { data: photosResponse, isLoading, error, refetch } = useGetAllPhoto(debouncedSearchValue, accessToken);

  const photos = photosResponse?.data;

  useEffect(() => {
    if (user !== null) {
      refetch();
    }
  }, [user, refetch]);

  const toggleLikeMutation = useToggleLike();

  const toggleLike = useCallback(
    (photoId: string) => {
      queryClient.setQueryData<ApiResponse<Photo[]>>(['photos', { searchQuery: debouncedSearchValue }], (oldData) => {
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
          onSuccess: (data) => {
            queryClient.setQueryData<ApiResponse<Photo[]>>(['photos', { searchQuery: debouncedSearchValue }], (oldData) => {
              if (!oldData?.data) return oldData;

              const updatedPhotos = oldData.data.map((photo) => {
                if (photo._id === photoId) {
                  return {
                    ...photo,
                    isLikedByMe: data.isLikedByMe,
                    likeCount: data.likeCount,
                  };
                }
                return photo;
              });

              return {
                ...oldData,
                data: updatedPhotos,
              };
            });
          },
          onError: () => {
            refetch();
          },
        }
      );
    },
    [accessToken, toggleLikeMutation, queryClient, debouncedSearchValue, refetch]
  );

  const value: PhotosContextType = {
    photos,
    isLoading,
    error,
    toggleLike,
    refetch,
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
