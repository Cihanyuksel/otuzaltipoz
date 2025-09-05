import { useQuery } from '@tanstack/react-query';
import { photoService } from '../services/photoService';

export const useGetAllPhoto = () =>
  useQuery({
    queryKey: ['photos', 'all'],
    queryFn: photoService.getAllPhoto,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
