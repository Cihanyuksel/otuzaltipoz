"use client"
import PhotoList from '@/components/photos/PhotoList';
import { useGetAllPhoto } from '@/hooks/usePhotoApi';

export default function PhotoContainer() {
  const { data: response, isLoading, isError, error } = useGetAllPhoto();
  const photos = response?.data || [];  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        <PhotoList photos={photos} isLoading={isLoading} isError={isError} error={error}  />
    </div>
  );
}
