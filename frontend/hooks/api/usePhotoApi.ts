import { useInfiniteQuery, useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
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
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
//---------------------------------------------------------------------------------------------------------
export const useGetPhoto = (id: string, options?: Omit<UseQueryOptions<Photo | null, Error>, 'queryKey' | 'queryFn'>) =>
  useQuery<Photo | null, Error>({
    queryKey: ['photos', id],
    queryFn: () => photoService.getPhoto(id),
    enabled: !!id,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  });
//---------------------------------------------------------------------------------------------------------
export const useAddPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation<PhotoResponse, any, FormData>({
    mutationFn: (formData: FormData) => photoService.addPhoto(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
};
//---------------------------------------------------------------------------------------------------------
export const useGetUserPhotos = (userId: string) =>
  useQuery<ApiResponse<Photo[]>>({
    queryKey: ['userPhotos', userId],
    queryFn: () => photoService.getPhotoByUserId(userId),
    enabled: !!userId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
//---------------------------------------------------------------------------------------------------------
export const useGetLikedPhotos = (userId: string) =>
  useQuery<ApiResponse<Photo[]>>({
    queryKey: ['likedPhotos', userId],
    queryFn: () => photoService.getLikedPhotos(userId),
    enabled: !!userId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
//---------------------------------------------------------------------------------------------------------
export const useUpdatePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Photo>, Error, { id: string; updatedData: Partial<Photo> }>({
    mutationFn: ({ id, updatedData }) => photoService.updatePhoto(id, updatedData),
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
export const useDeletePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: (id: string) => photoService.deletePhoto(id),

    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ['photos', id] });
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['userPhotos'] });
      queryClient.invalidateQueries({ queryKey: ['likedPhotos'] });
    },

    onError: (error, id) => {
      console.error(`Fotoğraf (${id}) silinirken hata oluştu:`, error);
    },
  });
};
//---------------------------------------------------------------------------------------------------------
type TimeRange = 'all' | 'month' | 'week' | 'day';
export const useGetPopularPhotos = (timeRange: TimeRange) => {
  return useQuery({
    queryKey: ['popularPhotos', timeRange],

    queryFn: async () => {
      const response = await photoService.getPopularPhotos(10, timeRange);
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
//---------------------------------------------------------------------------------------------------------
export const useGetRandomPhotos = (limit: number) => {
  return useQuery<ApiResponse<Photo[]>, Error>({
    queryKey: ['randomPhotos', limit],

    queryFn: () => photoService.getRandomPhoto(limit),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
//---------------------------------------------------------------------------------------------------------
