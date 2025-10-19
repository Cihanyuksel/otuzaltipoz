import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { likeService } from '../../services/likeService';
import { Photo } from 'types/photo';

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

  return useMutation<any, Error, ToggleLikeVariables, { previousLikes?: LikeData }>({
    mutationFn: ({ photoId, accessToken }) => likeService.toggleLike(photoId, accessToken),

    onMutate: async ({ photoId, searchQuery, hasToken, categories }) => {
      await queryClient.cancelQueries({ queryKey: ['likes', photoId] });

      const previousLikes = queryClient.getQueryData<LikeData>(['likes', photoId]);

      if (previousLikes) {
        const newData = {
          ...previousLikes,
          isLikedByMe: !previousLikes.isLikedByMe,
          likeCount: previousLikes.isLikedByMe ? previousLikes.likeCount - 1 : previousLikes.likeCount + 1,
        };
        queryClient.setQueryData(['likes', photoId], newData);
      }

      const queryKey = ['photos', { searchQuery, hasToken, categories }];
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

      return { previousLikes };
    },

    onSuccess: (_data, { photoId }) => {
      queryClient.invalidateQueries({ queryKey: ['likedPhotos'] });
    },

    onError: (_err, { photoId, searchQuery, hasToken, categories }, context) => {
      if (context?.previousLikes) {
        queryClient.setQueryData(['likes', photoId], context.previousLikes);
      }

      const queryKey = ['photos', { searchQuery, hasToken, categories }];
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

const useGetLikes = (
  photoId: string,
  accessToken: string | null,
  options?: Omit<UseQueryOptions<LikeData, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<LikeData, Error>({
    queryKey: ['likes', photoId],
    queryFn: async () => {
      try {
        const result = await likeService.getLikes(photoId, accessToken);
        return result;
      } catch (error: any) {
        throw error;
      }
    },
    enabled: !!photoId,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    ...options,
  });
};

export { useToggleLike, useGetLikes };
