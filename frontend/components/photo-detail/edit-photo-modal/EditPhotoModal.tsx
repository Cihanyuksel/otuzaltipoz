'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdatePhoto } from '@/hooks/api/usePhotoApi';
import { Photo } from 'types/photo';
import { PhotoEditFormValues, photoEditSchema } from 'lib/schemas';
import { transformFormData } from './utils';
import { ModalHeader } from './ModalHeader';
import { EditPhotoForm } from './EditPhotoForm';
import { useEffect } from 'react';
import { ModalOverlay } from '@/components/common/modal-overlay';

interface EditPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo;
}

const EditPhotoModal = ({ onClose, photo, isOpen }: EditPhotoModalProps) => {
  const form = useForm<PhotoEditFormValues>({
    resolver: zodResolver(photoEditSchema),
    mode: 'onChange',
  });

  const { mutate, isPending, error } = useUpdatePhoto();

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: photo.title,
        description: photo.description || '',
        tags: photo.tags?.join(', ') || '',
      });
    }
  }, [isOpen, photo, form]);

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

  if (!isOpen) {
    return null;
  }

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
