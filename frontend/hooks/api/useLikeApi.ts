import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { likeService } from '../../services/likeService';
import { Photo } from 'types/photo';
import { ToggleLikeResponse } from 'types/like';

interface ToggleLikeVariables {
  photoId: string;
  accessToken?: string | null | undefined;
  searchQuery?: string;
  hasToken?: boolean;
  categories?: string;
}

interface LikeData {
  photoId: string;
  likeCount: number;
  isLikedByMe: boolean;
  usersWhoLiked?: Array<{ _id: string; username: string; profile_img_url?: string }>;
}

const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ToggleLikeResponse,
    Error,
    ToggleLikeVariables,
    {
      previousLikes?: LikeData;
      previousPhotos?: any;
    }
  >({
    mutationFn: ({ photoId }) => likeService.toggleLike(photoId),

    onMutate: async ({ photoId, searchQuery, hasToken, categories }) => {
      await queryClient.cancelQueries({ queryKey: ['likes', photoId] });
      const queryKey = ['photos', { searchQuery, hasToken, categories }];
      await queryClient.cancelQueries({ queryKey });

      const previousLikes = queryClient.getQueryData<LikeData>(['likes', photoId]);
      const previousPhotos = queryClient.getQueryData(queryKey);

      if (previousLikes) {
        const newData = {
          ...previousLikes,
          isLikedByMe: !previousLikes.isLikedByMe,
          likeCount: previousLikes.isLikedByMe ? previousLikes.likeCount - 1 : previousLikes.likeCount + 1,
        };
        queryClient.setQueryData(['likes', photoId], newData);
      }

      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((photo: Photo) =>
              photo._id === photoId
                ? {
                    ...photo,
                    isLikedByMe: !photo.isLikedByMe,
                    likeCount: photo.isLikedByMe ? photo.likeCount - 1 : photo.likeCount + 1,
                  }
                : photo
            ),
          })),
        };
      });

      return { previousLikes, previousPhotos };
    },

    onSuccess: (_data, { photoId }) => {
      queryClient.invalidateQueries({ queryKey: ['likedPhotos'] });

      queryClient.invalidateQueries({
        queryKey: ['likes', photoId],
        refetchType: 'none',
      });
    },

    onError: (_err, { photoId, searchQuery, hasToken, categories }, context) => {
      if (context?.previousLikes) {
        queryClient.setQueryData(['likes', photoId], context.previousLikes);
      }

      if (context?.previousPhotos) {
        const queryKey = ['photos', { searchQuery, hasToken, categories }];
        queryClient.setQueryData(queryKey, context.previousPhotos);
      }

      queryClient.invalidateQueries({
        queryKey: ['photos', { searchQuery, hasToken, categories }],
      });
    },
  });
};

const useGetLikes = (
  photoId: string,
  accessToken?: string | null,
  options?: Omit<UseQueryOptions<LikeData, Error>, 'queryKey' | 'queryFn'>
) => {
  const baseEnabled = !!photoId && !!accessToken;
  const finalEnabled = options?.enabled !== undefined ? baseEnabled && options.enabled : baseEnabled;

  return useQuery<LikeData, Error>({
    queryKey: ['likes', photoId],
    queryFn: async () => {
      const result = await likeService.getLikes(photoId);
      return result;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    retryOnMount: false,
    ...options,
    enabled: finalEnabled,
  });
};

export { useToggleLike, useGetLikes };
