'use client';
//nextjs and react
import { useState, useEffect, useRef } from 'react';
//third-party
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FieldError } from 'react-hook-form';
import { CiCloudOn as CloudIcon } from 'react-icons/ci';
import { IoIosArrowDown as ArrowDown } from 'react-icons/io';
//project-files
import { useAuth } from '@/context/AuthContext';
import { useAddPhoto } from '@/hooks/api/usePhotoApi';
import Loader from '@/components/common/loader';
import Button from '../common/button';
import { PhotoUploadFormValues, photoUploadSchema } from 'lib/schemas';

interface Category {
  _id: string;
  name: string;
}

export default function PhotoUploadForm() {
  const [fileName, setFileName] = useState('Dosya Seçilmedi');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { accessToken, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PhotoUploadFormValues>({
    resolver: zodResolver(photoUploadSchema),
  });

  const { mutate, isPending } = useAddPhoto(accessToken as string);

  const fetchCategories = async () => {
    if (categories.length > 0) {
      return true;
    }

    setLoadingCategories(true);
    try {
      const response = await fetch('http://localhost:4000/api/v1/categories');
      const result = await response.json();
      if (result.status) {
        setCategories(result.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setErrorMessage('Kategoriler yüklenirken bir hata oluştu.');
      return false;
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = async () => {
    if (!isDropdownOpen && categories.length === 0) {
      const success = await fetchCategories();
      if (!success) {
        return;
      }
    }
    setIsDropdownOpen((prev) => !prev);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        if (prev.length >= 3) {
          setErrorMessage('En fazla 3 kategori seçebilirsiniz');
          setTimeout(() => setErrorMessage(null), 3000);
          return prev;
        }
        return [...prev, categoryId];
      }
    });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName('Dosya Seçilmedi');
    }
  };

  const getSelectedCategoryNames = () => {
    return selectedCategories
      .map((id) => {
        const category = categories.find((c) => c._id === id);
        return category ? category.name : 'Bilinmeyen Kategori';
      })
      .join(' | ');
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
          {successMessage && <div className="p-4 rounded-md bg-green-100 text-green-700">{successMessage}</div>}
          {errorMessage && <div className="p-4 rounded-md bg-red-100 text-red-700">{errorMessage}</div>}

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
            {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description.message}</p>}
          </div>

          {/* Kategori Açılır Menü (Dropdown) Alanı */}
          <div className="relative" ref={dropdownRef}>
            <label className="block pb-2 text-sm font-medium text-[#1b140e]">Kategoriler (1-3 adet)</label>
            <button
              type="button"
              onClick={handleDropdownToggle}
              className={`
                    flex h-12 w-full items-center justify-between rounded-lg border-none bg-[#f5f1ea] p-4 text-base text-[#1b140e]
                    focus:outline-none transition-all duration-150 cursor-pointer 
                    ${isDropdownOpen ? 'rounded-none' : ''}
                `}
            >
              <span className={`truncate ${selectedCategories.length === 0 ? 'text-gray-500' : 'text-[#1b140e]'}`}>
                {loadingCategories
                  ? 'Kategoriler yükleniyor...'
                  : selectedCategories.length > 0
                    ? getSelectedCategoryNames()
                    : 'Kategori Seçin'}
              </span>
              <ArrowDown
                className={`ml-2 h-5 w-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>

            {isDropdownOpen && !loadingCategories && (
              <div className="absolute z-10 w-full rounded-b-lg border border-t-0 border-gray-300 bg-white shadow-lg max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    onClick={() => handleCategoryToggle(category._id)}
                    className={`
                                flex justify-between items-center px-4 py-3 cursor-pointer text-[#1b140e] transition-colors
                                hover:bg-[#f5f1ea] text-sm
                                ${selectedCategories.includes(category._id) ? 'bg-[#ef74641a] font-semibold' : ''}
                            `}
                  >
                    {category.name}
                    {selectedCategories.includes(category._id) && <span className="text-[#ef7464]">✓</span>}
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="px-4 py-3 text-center text-gray-500 text-sm">Kategori bulunamadı.</div>
                )}
              </div>
            )}

            <p className="mt-3 text-xs text-gray-600">Seçili: {selectedCategories.length}/3</p>
          </div>
          {/* Kategori Açılır Menü (Dropdown) Alanı Bitiş */}

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
            <p className="mt-1 text-xs text-gray-500">Etiketleri virgülle ayırarak girebilirsiniz</p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#a6b8b1] bg-[#f5f1ea] px-6 py-10 text-center">
            <span className="material-symbols-outlined text-5xl text-gray-400">
              <CloudIcon />
            </span>
            <p className="mt-4 text-lg font-semibold text-gray-500">Sürükleyip bırakın veya yüklemek için tıklayın</p>
            <p className="mt-1 text-sm text-gray-500">
              <span className="font-bold">{fileName}</span>
            </p>
            <label
              className="mt-6 flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#ef7464] h-10 px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#ef7464df]"
              htmlFor="file-upload"
            >
              <span className="truncate">Fotoğraf seç</span>
            </label>
            <input id="file-upload" type="file" className="hidden" {...register('photo', { onChange: handleChange })} />
          </div>
          {errors.photo && <p className="mt-2 text-sm text-red-600">{(errors.photo as FieldError).message}</p>}

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
