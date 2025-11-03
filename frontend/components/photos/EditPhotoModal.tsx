//third-pary
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoClose as CloseIcon } from 'react-icons/io5';
//project files
import Button from '@/common/button';
import Input from '@/common/input';
import { useUpdatePhoto } from '@/hooks/api/usePhotoApi';
import { Photo } from 'types/photo';
import { PhotoEditFormValues, photoEditSchema } from 'lib/schemas';

interface IEditPhotoModal {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo;
}

const EditPhotoModal = ({ onClose, photo }: IEditPhotoModal) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PhotoEditFormValues>({
    resolver: zodResolver(photoEditSchema),
    defaultValues: {
      title: photo.title,
      description: photo.description || '',
      tags: photo.tags?.join(', ') || '',
    },
    mode: 'onChange',
  });

  const { mutate, isPending, error } = useUpdatePhoto();

  const onSubmit = (data: PhotoEditFormValues) => {
    const transformedData = {
      ...data,
      tags: data.tags
        ? data.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : undefined,
    };

    mutate(
      { id: photo._id, updatedData: transformedData },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (error) => {
          console.error('Fotoğraf güncelleme hatası:', error);
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const isLoading = isSubmitting || isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f5f1ea]/50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#ef7464]">
          <h3 className="text-lg font-medium text-gray-100 border-b-2">Fotoğrafı Düzenle</h3>
          <button
            type="button"
            className="rounded-md p-2 cursor-pointer text-white hover:text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={handleClose}
            disabled={isLoading}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">
              {error instanceof Error ? error.message : 'Güncelleme sırasında bir hata oluştu. Lütfen tekrar deneyin.'}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Başlık */}
            <Input
              id="title"
              type="text"
              name="title"
              register={register}
              error={errors.title?.message}
              label="Başlık"
              disabled={isLoading}
              placeholder="Fotoğraf başlığı"
            />

            {/* Açıklama */}
            <div className="flex flex-col w-full mt-2 mb-2">
              <label htmlFor="description" className="mb-1 text-sm font-medium text-gray-700">
                Açıklama
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description')}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ef7464] focus:border-[#ef7464] disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                placeholder="Fotoğraf açıklaması (isteğe bağlı)"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            {/* Etiketler */}
            <Input
              id="tags"
              type="text"
              name="tags"
              register={register}
              error={errors.tags?.message}
              label="Etiketler"
              disabled={isLoading}
              placeholder="doğa, manzara, güneş (virgülle ayırın)"
            />
            <p className="mt-1 text-xs text-gray-500">Etiketleri virgülle ayırarak girebilirsiniz</p>

            {/* Footer */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button onClick={handleClose} type="button" variant="tertiary" size="medium" disabled={isLoading}>
                İptal
              </Button>
              <Button disabled={isPending} type="submit" variant="primary" size="medium">
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Kaydediliyor...
                  </div>
                ) : (
                  'Kaydet'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPhotoModal;
