import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { ratingService, IGetRatingsResponse, IRatePhotoResponse } from '../services/ratingService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

interface RatePhotoVariables {
  photoId: string;
  rating: number;
  accessToken: string;
}

const useRatePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation<IRatePhotoResponse, Error, RatePhotoVariables, { previousRatings?: IGetRatingsResponse }>({
    mutationFn: ({ photoId, rating, accessToken }) => ratingService.ratePhoto(photoId, rating, accessToken),

    onMutate: async ({ photoId, rating }) => {
      await queryClient.cancelQueries({ queryKey: ['ratings', photoId] });
      const previousRatings = queryClient.getQueryData<IGetRatingsResponse>(['ratings', photoId]);
      return { previousRatings };
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ratings', variables.photoId] });
      toast.success('Puanlama işlemi başarılı!');
    },

    onError: (_err, variables, context) => {
      if (context?.previousRatings) {
        queryClient.setQueryData(['ratings', variables.photoId], context.previousRatings);
        toast.error('Puanlama işlemi başarısız oldu.');
      }
    },
  });
};

const useGetRatings = (photoId: string, options?: Omit<UseQueryOptions<IGetRatingsResponse, Error>, 'queryKey' | 'queryFn'>) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.getQueryData(['ratings', photoId]);
  }, [photoId, queryClient]);

  return useQuery<IGetRatingsResponse, Error>({
    queryKey: ['ratings', photoId],
    queryFn: async () => {
      try {
        const result = await ratingService.getRatings(photoId);
        return result;
      } catch (error: any) {
        console.error('🚨 Error fetching ratings:', error.response?.data);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
    refetchInterval: false,
    retry: 1,
    ...options,
  });
};

export { useRatePhoto, useGetRatings };
