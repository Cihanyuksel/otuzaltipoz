import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { photoService } from '../services/photoService';
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

export const useGetAllPhoto = (searchQuery?: string, accessToken?: string | null) =>
  useQuery({
    queryKey: ['photos', { searchQuery }],
    queryFn: () => photoService.getAllPhoto(searchQuery),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

export const useGetPhoto = (id: string) =>
  useQuery<Photo>({
    queryKey: ['photos', id],
    queryFn: () => photoService.getPhoto(id),
    enabled: !!id,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

export const useAddPhoto = (accessToken: string) => {
  const queryClient = useQueryClient();

  return useMutation<PhotoResponse, any, FormData>({
    mutationFn: (formData: FormData) => photoService.addPhoto(formData, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
};

export const useGetUserPhotos = (userId: string, accessToken?: string | null) =>
  useQuery<ApiResponse<Photo[]>>({
    queryKey: ['userPhotos', userId],
    queryFn: () => photoService.getPhotoByUserId(userId, accessToken),
    enabled: !!userId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

export const useGetLikedPhotos = (userId: string, accessToken?: string | null) =>
  useQuery<ApiResponse<Photo[]>>({
    queryKey: ['likedPhotos', userId],
    queryFn: () => photoService.getLikedPhotos(userId, accessToken),
    enabled: !!userId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
