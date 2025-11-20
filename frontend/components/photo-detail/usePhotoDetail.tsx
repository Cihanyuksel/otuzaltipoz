import { useState } from 'react';
import { useGetPhoto, useDeletePhoto } from '@/hooks/api/usePhotoApi';
import { useGetLikes } from '@/hooks/api/useLikeApi';
import { useGetRatings } from '@/hooks/api/useRatingApi';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { queryClient } from 'lib/queryClient';

export const usePhotoDetail = () => {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const photoId = params.id as string;

  const [modalStates, setModalStates] = useState({ login: false, edit: false, delete: false });
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: photo, isLoading, isError } = useGetPhoto(photoId, { enabled: !isDeleting });
  const { data: likeData } = useGetLikes(photoId, accessToken, { enabled: !!photoId && !isDeleting });
  const { data: ratingsData } = useGetRatings(photoId, accessToken, {
    enabled: !!photoId && !isDeleting && !!accessToken,
  });
  const { mutate: deletePhoto, isPending, error } = useDeletePhoto();

  const handleModalToggle = (modal: keyof typeof modalStates, isOpen: boolean) => {
    setModalStates((prev) => ({ ...prev, [modal]: isOpen }));
  };

  const handleDelete = () => {
    if (!photo) return;
    setIsDeleting(true);

    deletePhoto(photo._id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['photos'] });

        handleModalToggle('delete', false);
        router.push('/photos');
      },
      onError: () => setIsDeleting(false),
    });
  };

  return {
    photo,
    isLoading,
    isError,
    likeData,
    ratingsData,
    modalStates,
    isDeleting,
    handleModalToggle,
    handleDelete,
    user,
    accessToken,
    isPending,
    error,
  };
};
