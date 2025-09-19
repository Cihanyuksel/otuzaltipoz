'use client';
import { IoClose as CloseIcon } from 'react-icons/io5';
import { Photo } from 'types/photo'; 
import { useDeletePhoto } from '@/hooks/usePhotoApi'; 
import { useAuth } from '@/context/AuthContext'; 
import { useRouter } from 'next/navigation';

interface DeletePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo; 
}

const DeletePhotoModal: React.FC<DeletePhotoModalProps> = ({ isOpen, onClose, photo }) => {

  const router = useRouter();
  const { accessToken } = useAuth();
  const { mutate: deletePhoto, isPending, error } = useDeletePhoto(accessToken);

  if (!isOpen) return null; 
  if (!photo) return null; 

  const handleDelete = () => {
    deletePhoto(photo._id, {
      onSuccess: () => {
        console.log(`Fotoğraf başarıyla silindi: ${photo._id}`);
        onClose(); 
        router.push('/photos');
      },
      onError: (err) => {
        console.error(`Fotoğraf silinirken hata oluştu: ${photo._id}`, err);
      },
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isLoading = isPending; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50" onClick={handleBackdropClick}>
      <div
        className="w-full max-w-sm bg-white rounded-lg shadow-xl transform transition-all scale-100 opacity-100" // Küçük bir modal için max-w-sm
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Fotoğrafı Sil</h3>
          <button
            type="button"
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">
              {error instanceof Error ? error.message : 'Silme sırasında bir hata oluştu. Lütfen tekrar deneyin.'}
            </div>
          )}
          <p className="text-gray-700 text-sm mb-6">
            "<span className="font-semibold">{photo.title}</span>" başlıklı fotoğrafı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Siliniyor...
                </div>
              ) : (
                'Sil'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePhotoModal;
