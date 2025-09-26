import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { likeService } from '../services/likeService';
import { useEffect } from 'react';

interface ToggleLikeVariables {
  photoId: string;
  accessToken: string | null;
}

interface LikeData {
  photoId: string;
  likeCount: number;
  isLikedByMe: boolean;
  usersWhoLiked?: Array<{ _id: string; username: string; profile_img_url?: string }>;
}

const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, ToggleLikeVariables, { previousLikes?: LikeData }>({
    mutationFn: ({ photoId, accessToken }) => likeService.toggleLike(photoId, accessToken),

    onMutate: async ({ photoId }) => {
      const previousLikes = queryClient.getQueryData<LikeData>(['likes', photoId]);
      if (previousLikes) {
        const newData = {
          ...previousLikes,
          isLikedByMe: !previousLikes.isLikedByMe,
          likeCount: previousLikes.isLikedByMe ? previousLikes.likeCount - 1 : previousLikes.likeCount + 1,
        };
        queryClient.setQueryData(['likes', photoId], newData);
      }
      return { previousLikes };
    },

    onSettled: (_data, _error, { photoId }) => {
      queryClient.invalidateQueries({ queryKey: ['likes', photoId] });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likedPhotos'] });
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },

    onError: (_err, { photoId }, context) => {
      if (context?.previousLikes) {
        queryClient.setQueryData(['likes', photoId], context.previousLikes);
      }
    },
  });
};

const useGetLikes = (photoId: string, accessToken: string | null, options?: Omit<UseQueryOptions<LikeData, Error>, 'queryKey' | 'queryFn'>) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.getQueryData(['likes', photoId]);
  }, [photoId, queryClient]);

  return useQuery<LikeData, Error>({
    queryKey: ['likes', photoId],
    queryFn: async () => {
      try {
        const result = await likeService.getLikes(photoId, accessToken!);
        return result;
      } catch (error: any) {
        console.log('🚨 Error details:', error.response?.data);
        throw error;
      }
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 60,
    refetchInterval: false,
    retry: 1,
    ...options,
  });
};

export { useToggleLike, useGetLikes };
