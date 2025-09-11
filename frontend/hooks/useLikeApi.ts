import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { likeService } from '../services/likeService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

interface ToggleLikeVariables {
  photoId: string;
  accessToken: string;
}

interface LikeData {
  photoId: string;
  likeCount: number;
  isLikedByMe: boolean;
}

const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, ToggleLikeVariables, { previousLikes?: LikeData }>({
    mutationFn: ({ photoId, accessToken }) => likeService.toggleLike(photoId, accessToken),

    onMutate: async ({ photoId }) => {
      // Önceki veriyi sakla
      const previousLikes = queryClient.getQueryData<LikeData>(['likes', photoId]);
      console.log("PREVIOUS LIKE", previousLikes)
      // Cache'i iyimser şekilde güncelle
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

    // Sadece API çağrısı bittiğinde cache'i geçersiz kıl
    onSettled: (_data, _error, { photoId }) => {
      queryClient.invalidateQueries({ queryKey: ['likes', photoId] });
    },

    onError: (err, { photoId }, context) => {
      // Hata durumunda cache'i eski haline getir
      if (context?.previousLikes) {
        queryClient.setQueryData(['likes', photoId], context.previousLikes);
        toast.error('Beğeni işlemi başarısız oldu.');
      }
    },
  });
};

const useGetLikes = (photoId: string, accessToken: string | null, initialData?: LikeData) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const cacheData = queryClient.getQueryData(['likes', photoId]);
    console.log(`📦 Cache on mount for ${photoId}:`, cacheData);
  }, [photoId, queryClient]);

  return useQuery({
    queryKey: ['likes', photoId],
    queryFn: async () => {
      console.log(`🌐 FRESH FETCH for photo: ${photoId}`);
      console.log(`🔑 Using token: ${accessToken?.substring(0, 20)}...`);

      const existingCache = queryClient.getQueryData(['likes', photoId]);
      console.log('📋 Existing cache before fetch:', existingCache);

      // Token'ın geçerli olup olmadığını test et
      try {
        const result = await likeService.getLikes(photoId, accessToken!);
        console.log('📊 FRESH API Response:', result);

        // Backend'den gelen response'u detayına bakalım
        console.log('🔍 Response breakdown:', {
          photoId: result.photoId,
          likeCount: result.likeCount,
          isLikedByMe: result.isLikedByMe,
          isLikedByMeType: typeof result.isLikedByMe,
        });

        return result;
      } catch (error: any) {
        console.error('🚨 API Error:', error);
        console.error('🚨 Error details:', error.response?.data);
        throw error;
      }
    },
    enabled: !!photoId && !!accessToken,
    staleTime: 1000 * 60, // 1 dakika boyunca veriyi "taze" kabul et
    gcTime: 1000 * 60 * 60, // 1 saat sonra veriyi cache'ten sil
    refetchOnWindowFocus: true, // Kullanıcı pencereye döndüğünde veriyi tazele
    refetchOnMount: 'always', // Bileşen her yüklendiğinde yenileme isteği gönder
    refetchInterval: false,
    retry: 1, // API hatası durumunda bir kez daha dene
  });
};

export { useToggleLike, useGetLikes };
