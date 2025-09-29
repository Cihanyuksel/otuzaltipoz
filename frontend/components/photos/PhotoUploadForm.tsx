'use client';
//nextjs and react
import { useState } from 'react';
//third-party
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FieldError } from 'react-hook-form';
import { CiCloudOn as CloudIcon } from 'react-icons/ci';
//project-files
import { useAuth } from '@/context/AuthContext';
import { useAddPhoto } from '@/hooks/usePhotoApi';
import Loader from '@/components/common/loader';
import Button from '../common/button';
import { PhotoUploadFormValues, photoUploadSchema } from 'lib/schemas';

export default function PhotoUploadForm() {
  const [fileName, setFileName] = useState('Dosya Seçilmedi');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { accessToken, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PhotoUploadFormValues>({
    resolver: zodResolver(photoUploadSchema),
  });

  const { mutate, isPending } = useAddPhoto(accessToken as string);

  const onSubmit = (data: PhotoUploadFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.tags) {
      formData.append('tags', data.tags);
    }
    formData.append('photo', data.photo[0]);

    mutate(formData, {
      onSuccess: () => {
        setSuccessMessage('Fotoğraf Başarıyla Yüklendi!');
        reset();
        setFileName('Dosya Seçilmedi');
      },
      onError: (error) => {
        console.error('Upload failed:', error);
        setErrorMessage(`Upload failed: ${error.message}`);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName('Dosya Seçilmedi');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 justify-center py-10 px-4">
        <div className="text-center text-xl font-semibold text-gray-700">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 justify-center py-10 px-4 bg-cover bg-center bg-[#f5f1ea]">
      <div className="flex w-full max-w-lg flex-col items-center rounded-xl bg-[#d3deda] p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#1b140e]">Fotoğraf Yükle</h1>
          <p className="mt-2 text-base text-gray-600">Güzel anlarınızı dünyayla paylaşın</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          {successMessage && (
            <div className="p-4 rounded-md bg-green-100 text-green-700">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="p-4 rounded-md bg-red-100 text-red-700">{errorMessage}</div>
          )}

          <div>
            <label className="block pb-2 text-sm font-medium text-[#1b140e]" htmlFor="title">
              Başlık
            </label>
            <input
              className="form-input h-12 w-full flex-1 resize-none rounded-lg border-none bg-[#f5f1ea] p-4 text-base text-[#1b140e] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ef7464]"
              id="title"
              placeholder="e.g., A beautiful sunset"
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
              placeholder="Tell us more about your photo..."
              {...register('description')}
            ></textarea>
            {errors.description && (
              <p className="mt-2 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div>
            <label className="block pb-2 text-sm font-medium text-[#1b140e]" htmlFor="tags">
              Etiketler
            </label>
            <input
              className="form-input h-12 w-full flex-1 resize-none rounded-lg border-none bg-[#f5f1ea] p-4 text-base text-[#1b140e] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ef7464]"
              id="tags"
              placeholder="e.g., nature, travel, sunset"
              type="text"
              {...register('tags')}
            />
            <p className="mt-1 text-xs text-gray-500">
              Etiketleri virgülle ayırarak girebilirsiniz
            </p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#a6b8b1] bg-[#f5f1ea] px-6 py-10 text-center">
            <span className="material-symbols-outlined text-5xl text-gray-400">
              <CloudIcon />
            </span>
            <p className="mt-4 text-lg font-semibold text-gray-500">
              Sürükleyip bırakın veya yüklemek için tıklayın
            </p>
            <p className="mt-1 text-sm text-gray-500">
              <span className="font-bold">{fileName}</span>
            </p>
            <label
              className="mt-6 flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#ef7464] h-10 px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#ef7464df]"
              htmlFor="file-upload"
            >
              <span className="truncate">Fotoğraf seç</span>
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              {...register('photo', { onChange: handleChange })}
            />
          </div>
          {errors.photo && (
            <p className="mt-2 text-sm text-red-600">{(errors.photo as FieldError).message}</p>
          )}

          <div className="flex justify-end pt-4">
            <Button disabled={isPending} type="submit" variant="primary" className='font-bold' size='large'>
              <span className="truncate">{isPending ? 'Yükleniyor...' : 'Yükle'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
