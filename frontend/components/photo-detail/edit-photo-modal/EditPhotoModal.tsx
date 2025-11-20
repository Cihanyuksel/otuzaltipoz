'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdatePhoto } from '@/hooks/api/usePhotoApi';
import { transformFormData } from './utils';
import EditPhotoForm from './EditPhotoForm';
import { useEffect } from 'react';
import ModalOverlay from '@/components/common/modal-overlay';
import { Photo } from 'types/photo';
import { PhotoEditFormValues, photoEditSchema } from 'lib/schemas';
import ModalHeader from '@/components/common/modal-header';
import ModalContent from '@/components/common/modal-content';

interface IEditPhotoModal {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo;
}

const EditPhotoModal = ({ onClose, photo, isOpen }: IEditPhotoModal) => {
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
    onClose();
    setTimeout(() => form.reset(), 300);
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
    <ModalOverlay onClose={handleClose} isLoading={isLoading} isModalVisible={isOpen}>
      <ModalContent isOpen={isOpen} className="bg-white rounded-lg">
        <ModalHeader title="Fotoğrafı Düzenle" onClose={handleClose} isLoading={isLoading} />
        <EditPhotoForm
          form={form}
          onSubmit={onSubmit}
          onClose={handleClose}
          isLoading={isLoading}
          isPending={isPending}
          error={error}
        />
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditPhotoModal;
