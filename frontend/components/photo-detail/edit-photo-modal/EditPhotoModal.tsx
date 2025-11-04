'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdatePhoto } from '@/hooks/api/usePhotoApi';
import { Photo } from 'types/photo';
import { PhotoEditFormValues, photoEditSchema } from 'lib/schemas';
import { transformFormData } from './utils';
import { ModalOverlay } from '../../common/modal-overlay';
import { ModalHeader } from './ModalHeader';
import { EditPhotoForm } from './EditPhotoForm';

interface EditPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo;
}

const EditPhotoModal = ({ onClose, photo }: EditPhotoModalProps) => {
  const form = useForm<PhotoEditFormValues>({
    resolver: zodResolver(photoEditSchema),
    defaultValues: {
      title: photo.title,
      description: photo.description || '',
      tags: photo.tags?.join(', ') || '',
    },
    mode: 'onChange',
  });

  const { mutate, isPending, error } = useUpdatePhoto();

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (data: PhotoEditFormValues) => {
    const transformedData = transformFormData(data);

    mutate(
      { id: photo._id, updatedData: transformedData },
      {
        onSuccess: handleClose,
        onError: (error) => {
          console.error('Fotoğraf güncelleme hatası:', error);
        },
      }
    );
  };

  const isLoading = form.formState.isSubmitting || isPending;

  return (
    <ModalOverlay onClose={handleClose} isLoading={isLoading}>
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl transform transition-all">
        <ModalHeader onClose={handleClose} isLoading={isLoading} />

        <EditPhotoForm
          form={form}
          onSubmit={onSubmit}
          onClose={handleClose}
          isLoading={isLoading}
          isPending={isPending}
          error={error}
        />
      </div>
    </ModalOverlay>
  );
};

export default EditPhotoModal;
