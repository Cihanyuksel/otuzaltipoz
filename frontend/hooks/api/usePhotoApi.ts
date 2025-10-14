import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { photoService } from '../../services/photoService';
import { Photo, ApiResponse } from 'types/photo';

type PhotoResponse = {
  success: boolean;
  photo: {
    user_id: string;
    photo_url: string;
    title: string;
    description: string;
    tags: string[];
    _id: string;
    created_at: string;
    __v: number;
  };
};
//---------------------------------------------------------------------------------------------------------
export const useGetAllPhoto = (searchQuery?: string, accessToken?: string | null, categories?: string) => {
  return useInfiniteQuery({
    queryKey: ['photos', { searchQuery, hasToken: !!accessToken, categories }],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await photoService.getAllPhoto({
        searchQuery: searchQuery || '',
        accessToken,
        categories: categories || '',
        limit: 10,
        offset: pageParam,
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, page) => sum + page.data.length, 0);
      if (!lastPage.data || totalFetched >= lastPage.totalRecords) {
        return undefined;
      }
      return allPages.length * 10;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
//---------------------------------------------------------------------------------------------------------
export const useGetPhoto = (id: string) =>
  useQuery<Photo | null>({
    queryKey: ['photos', id],
    queryFn: () => photoService.getPhoto(id),
    enabled: !!id,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    retry: false,
  });
//---------------------------------------------------------------------------------------------------------
export const useAddPhoto = (accessToken: string) => {
  const queryClient = useQueryClient();

  return useMutation<PhotoResponse, any, FormData>({
    mutationFn: (formData: FormData) => photoService.addPhoto(formData, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
};
//---------------------------------------------------------------------------------------------------------
export const useGetUserPhotos = (userId: string, accessToken?: string | null) =>
  useQuery<ApiResponse<Photo[]>>({
    queryKey: ['userPhotos', userId],
    queryFn: () => photoService.getPhotoByUserId(userId, accessToken),
    enabled: !!userId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

//---------------------------------------------------------------------------------------------------------
export const useGetLikedPhotos = (userId: string, accessToken?: string | null) =>
  useQuery<ApiResponse<Photo[]>>({
    queryKey: ['likedPhotos', userId],
    queryFn: () => photoService.getLikedPhotos(userId, accessToken),
    enabled: !!userId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
//---------------------------------------------------------------------------------------------------------
export const useUpdatePhoto = (accessToken?: string | null) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Photo>, Error, { id: string; updatedData: Partial<Photo> }>({
    mutationFn: ({ id, updatedData }) => photoService.updatePhoto(id, updatedData, accessToken),
    onSuccess: (updatedPhoto) => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      if (updatedPhoto.data?._id) {
        queryClient.invalidateQueries({ queryKey: ['photos', updatedPhoto.data._id] });
        queryClient.setQueryData(['photos', updatedPhoto.data._id], updatedPhoto);
      }
    },
  });
};
//---------------------------------------------------------------------------------------------------------
export const useDeletePhoto = (accessToken?: string | null) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: (id: string) => photoService.deletePhoto(id, accessToken),

    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ['photos', id] });
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },

    onError: (error, id) => {
      console.error(`Fotoğraf (${id}) silinirken hata oluştu:`, error);
    },
  });
};
//---------------------------------------------------------------------------------------------------------
