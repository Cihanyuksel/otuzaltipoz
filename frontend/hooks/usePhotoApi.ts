import { useQuery } from '@tanstack/react-query';
import { photoService } from '../services/photoService';

export const useGetAllPhoto = () =>
  useQuery({
    queryKey: ['photos', 'all'],
    queryFn: photoService.getAllPhoto,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

export const useGetPhoto = (id: string | number) =>
  useQuery<PhotoDocument>({
    queryKey: ['photos', id], 
    queryFn: () => photoService.getPhoto(id),
    enabled: !!id, 
    staleTime: 1000 * 60, 
    refetchOnWindowFocus: false,
  });
