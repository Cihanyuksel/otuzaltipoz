'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { FaCheck } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const schema = z
  .object({
    username: z.string().min(3, 'Username en az 3 karakter olmalı'),
    full_name: z.string().min(3, 'Full_name en az 3 karakter olmalı'),
    email: z.string().email('Geçerli bir e-posta gir'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
    passwordCheck: z.string(),
    profile_img: z.any().optional(),
  })
  .refine((data) => data.password === data.passwordCheck, {
    path: ['passwordCheck'],
    message: 'Şifreler uyuşmuyor',
  });

type FormData = z.infer<typeof schema>;

export default function SignupForm() {
  const { signup } = useAuth();

  const router = useRouter();

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('Dosya Seçilmedi');
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // files null ise undefined olur
    if (file) {
      setFileName(file.name);
      setIsSelected(true);
    } else {
      setFileName('Dosya Seçilmedi');
      setIsSelected(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onsubmit = (data: Record<string, any>) => {
    const formData = new FormData();

    formData.append('username', data.username || '');
    formData.append('full_name', data.full_name || '');
    formData.append('email', data.email || '');
    formData.append('password', data.password || '');

    if (data.profile_img && data.profile_img.length > 0) {
      formData.append('profile_img', data.profile_img[0]);
    }

    signup.mutate(formData, {
      onSuccess: (res: any) => {
        setSuccessMessage(res.message);
        setErrorMessage('');
        setTimeout(() => router.push('/login'), 3000);
      },
      onError: (err: any) => {
        setErrorMessage(err.message);
        setSuccessMessage('');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-4 w-full" encType="multipart/form-data">
      {errorMessage && <div className="bg-red-100 text-red-800 p-2 rounded-md">{errorMessage}</div>}
      {successMessage && <div className="bg-green-100 text-green-800 p-2 rounded-md">{successMessage}</div>}

      <input {...register('username')} placeholder="Kullanıcı Adı" className="border p-2 rounded-md" />
      {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

      <input {...register('full_name')} placeholder="Ad Soyad" className="border p-2 rounded-md" />
      {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}

      <input {...register('email')} placeholder="Email" className="border p-2 rounded-md" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          placeholder="Şifre"
          className="border p-2 rounded-md w-full"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className={`absolute right-2 top-3 cursor-pointer`}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          {...register('passwordCheck')}
          placeholder="Şifre Onayla"
          className="border p-2 rounded-md w-full"
        />
      </div>
      {errors.passwordCheck && <p className="text-red-500 text-sm">{errors.passwordCheck.message}</p>}

      {/* Profil Fotoğrafı */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">Profil Fotoğrafı</label>
        <label className="flex items-center justify-between border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-400 transition duration-200">
          <span className="text-gray-700 truncate">{fileName}</span>
          {isSelected ? (
            <span className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
              <FaCheck /> Seçildi
            </span>
          ) : (
            <span className="bg-[#ef7464] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#ef7464db] transition duration-200">
              Dosya Seç
            </span>
          )}
          <input type="file" accept="image/*" {...register('profile_img')} className="hidden" onChange={handleChange} />
        </label>
      </div>

      <button
        type="submit"
        className="bg-[#ef7464] text-white py-2 rounded-md hover:bg-[#f56b5c] transition mt-2 cursor-pointer"
      >
        Kayıt Ol
      </button>
    </form>
  );
}
