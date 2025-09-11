import { apiFetch } from '@/hooks/apiFetch';

export const likeService = {
  /**
   * Bir fotoğrafı beğenir veya beğeniyi geri alır.
   * @param photoId Beğenilecek veya beğenisi kaldırılacak fotoğrafın ID'si.
   * @param accessToken Kullanıcının yetkilendirme token'ı.
   * @returns Başarılı olursa API'den dönen veri.
   */
  toggleLike: async (photoId: string, accessToken: string) => {
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await apiFetch(`/${photoId}/like`, {
        method: 'POST',
        headers,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Bir fotoğrafa ait beğeni sayısını ve kullanıcının beğenme durumunu alır.
   * @param photoId Beğeni bilgisi alınacak fotoğrafın ID'si.
   * @param accessToken Kullanıcının yetkilendirme token'ı (isteğe bağlı).
   * @returns Başarılı olursa API'den dönen veri.
   */
  getLikes: async (photoId: string, accessToken?: string) => {
    try {
      const headers: HeadersInit = {};

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await apiFetch(`/${photoId}/likes`, {
        method: 'GET',
        headers,
      });

      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
