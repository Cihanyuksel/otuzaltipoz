//third-party
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoClose as CloseIcon } from 'react-icons/io5';
//project-files
import { Photo } from 'types/photo';
import { useUpdatePhoto } from '@/hooks/usePhotoApi';

interface EditPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo;
  accessToken: string | null;
}

import { z } from 'zod';

export const photoEditSchema = z.object({
  title: z.string().min(1, { message: 'Başlık alanı boş bırakılamaz.' }),
  description: z.string().optional(),
  tags: z.string().optional(),
});

export type PhotoEditFormValues = z.infer<typeof photoEditSchema>;

const EditPhotoModal = ({ onClose, photo, accessToken }: EditPhotoModalProps) => {
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
  });

  const { mutate, isPending, error } = useUpdatePhoto(accessToken);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={handleBackdropClick}>
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Fotoğrafı Düzenle</h3>
          <button
            type="button"
            className="rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
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
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                id="title"
                type="text"
                {...register('title')}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Fotoğraf başlığı"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description')}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                placeholder="Fotoğraf açıklaması (isteğe bağlı)"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Etiketler
              </label>
              <input
                id="tags"
                type="text"
                {...register('tags')}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="doğa, manzara, güneş (virgülle ayırın)"
              />
              {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>}
              <p className="mt-1 text-xs text-gray-500">Etiketleri virgülle ayırarak girebilirsiniz</p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Kaydediliyor...
                  </div>
                ) : (
                  'Kaydet'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPhotoModal;
