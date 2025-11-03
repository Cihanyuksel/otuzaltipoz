'use client';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FieldError } from 'react-hook-form';
import Button from '@/common/button';
import { useAddPhoto } from '@/hooks/api/usePhotoApi';
import { PhotoUploadFormValues, photoUploadSchema } from 'lib/schemas';
import FileUploadArea from './FileUploadArea';
import CategoryDropdown from './CategoryDropdown';

function PhotoUploadForm() {
  const [fileName, setFileName] = useState('Dosya Seçilmedi');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PhotoUploadFormValues>({
    resolver: zodResolver(photoUploadSchema),
  });

  const { mutate, isPending } = useAddPhoto();

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleCategoryError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const onSubmit = (data: PhotoUploadFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (selectedCategories.length < 1) {
      setErrorMessage('En az 1 kategori seçmelisiniz');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.tags) {
      formData.append('tags', data.tags);
    }
    formData.append('categories', selectedCategories.join(','));
    formData.append('photo', data.photo[0]);

    mutate(formData, {
      onSuccess: () => {
        setSuccessMessage('Fotoğraf Başarıyla Yüklendi!');
        reset();
        setFileName('Dosya Seçilmedi');
        setSelectedCategories([]);
      },
      onError: (error) => {
        console.error('Upload failed:', error);
        const errorMsg = (error as Error).message || 'Bilinmeyen bir hata oluştu';
        setErrorMessage(`Yükleme başarısız: ${errorMsg}`);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : 'Dosya Seçilmedi');
  };

  return (
    <div className="flex flex-1 justify-center py-10 px-4 bg-cover bg-center bg-[#f5f1ea]">
      <div className="flex w-full max-w-lg flex-col items-center rounded-xl bg-[#d3deda] p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#1b140e]">Fotoğraf Yükle</h1>
          <p className="mt-2 text-base text-gray-600">Güzel anlarınızı dünyayla paylaşın</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          {successMessage && <div className="p-4 rounded-md bg-green-100 text-green-700">{successMessage}</div>}
          {errorMessage && <div className="p-4 rounded-md bg-red-100 text-red-700">{errorMessage}</div>}

          <div>
            <label className="block pb-2 text-sm font-medium text-[#1b140e]" htmlFor="title">
              Başlık
            </label>
            <input
              className="form-input h-12 w-full flex-1 resize-none rounded-lg border-none bg-[#f5f1ea] p-4 text-base text-[#1b140e] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ef7464]"
              id="title"
              placeholder="ör: Güzel bir gün batımı"
              type="text"
              {...register('title')}
            />
            {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block pb-2 text-sm font-medium text-[#1b140e]" htmlFor="description">
              Açıklama
            </label>
            <textarea
              className="form-textarea min-h-32 w-full flex-1 resize-none rounded-lg border-none bg-[#f5f1ea] p-4 text-base text-[#1b140e] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ef7464]"
              id="description"
              placeholder="Bize fotoğrafın veya kameran hakkında daha fazla bilgi ver..."
              {...register('description')}
            />
            {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <CategoryDropdown
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            onError={handleCategoryError}
          />

          <div>
            <label className="block pb-2 text-sm font-medium text-[#1b140e]" htmlFor="tags">
              Etiketler
            </label>
            <input
              className="form-input h-12 w-full flex-1 resize-none rounded-lg border-none bg-[#f5f1ea] p-4 text-base text-[#1b140e] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ef7464]"
              id="tags"
              placeholder="ör: doğa, seyahat, portre"
              type="text"
              {...register('tags')}
            />
            <p className="mt-1 text-xs text-gray-500">Etiketleri virgülle ayırarak girebilirsiniz</p>
          </div>

          <FileUploadArea
            fileName={fileName}
            onFileChange={handleFileChange}
            register={register('photo')}
            error={(errors.photo as FieldError)?.message}
          />

          <div className="flex justify-end pt-4">
            <Button disabled={isPending} type="submit" variant="primary" className="font-bold" size="large">
              <span className="truncate">{isPending ? 'Yükleniyor...' : 'Yükle'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PhotoUploadForm;
