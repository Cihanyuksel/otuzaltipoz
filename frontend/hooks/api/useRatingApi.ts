import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ratingService } from 'services/ratingService';
import { IGetRatingsResponse, IRatePhotoResponse } from 'types/rating';

interface RatePhotoVariables {
  photoId: string;
  rating: number;
  searchQuery?: string;
  hasToken?: boolean;
  categories?: string;
}

const useRatePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation<IRatePhotoResponse, Error, RatePhotoVariables, { previousRatings?: IGetRatingsResponse }>({
    mutationFn: ({ photoId, rating }) => ratingService.ratePhoto(photoId, rating),

    onMutate: async ({ photoId }) => {
      await queryClient.cancelQueries({ queryKey: ['ratings', photoId] });
      const previousRatings = queryClient.getQueryData<IGetRatingsResponse>(['ratings', photoId]);
      return { previousRatings };
    },

    onSuccess: (data, { photoId, searchQuery, hasToken, categories }) => {
      queryClient.setQueryData(['ratings', photoId], {
        averageRating: data.averageRating,
        totalVotes: data.totalVotes,
      });

      queryClient.invalidateQueries({ queryKey: ['photos', photoId] });

      const queryKey = ['photos', { searchQuery, hasToken, categories }];
      queryClient.invalidateQueries({ queryKey });
    },

    onError: (_err, { photoId }, context) => {
      if (context?.previousRatings) {
        queryClient.setQueryData(['ratings', photoId], context.previousRatings);
      }
    },
  });
};

const useGetRatings = (
  photoId: string,
  accessToken?: string | null,
  options?: Omit<UseQueryOptions<IGetRatingsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.getQueryData(['ratings', photoId]);
  }, [photoId, queryClient]);

  return useQuery<IGetRatingsResponse, Error>({
    queryKey: ['ratings', photoId],
    queryFn: async () => {
      const result = await ratingService.getRatings(photoId);
      return result;
    },
    enabled: !!photoId && !!accessToken,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false,
    retryOnMount: false,
    ...options,
  });
};

export { useRatePhoto, useGetRatings };
