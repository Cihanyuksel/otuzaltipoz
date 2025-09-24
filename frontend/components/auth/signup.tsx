'use client';
//nextjs and react
import { useState } from 'react';
import { useRouter } from 'next/navigation';
//third-party
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaEye as ShowIcon, FaEyeSlash as HideIcon, FaCheck as CheckIcon } from 'react-icons/fa';
//project files
import { useAuth } from '@/context/AuthContext';
import { RegisterFormValues, registerSchema } from 'lib/schemas';

export default function SignupForm() {
  const { signup } = useAuth();

  const router = useRouter();

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('Dosya Seçilmedi');
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onsubmit = (data: RegisterFormValues) => {
    const formData = new FormData();

    formData.append('username', data.username || '');
    formData.append('full_name', data.full_name || '');
    formData.append('email', data.email || '');
    formData.append('password', data.password || '');

    if (data.profile_img && data.profile_img.length > 0) {
      formData.append('profile_img', data.profile_img[0]);
    }

    signup.mutate(formData, {
      onSuccess: (res) => {
        setSuccessMessage(res.message);
        setErrorMessage('');
        setTimeout(() => router.push('/login'), 3000);
      },
      onError: (err) => {
        setErrorMessage(err.message);
        setSuccessMessage('');
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onsubmit)}
      className="flex flex-col gap-4 w-full"
      encType="multipart/form-data"
    >
      {errorMessage && <div className="bg-red-100 text-red-800 p-2 rounded-md">{errorMessage}</div>}
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-2 rounded-md">{successMessage}</div>
      )}

      <input
        {...register('username')}
        placeholder="Kullanıcı Adı"
        className="border p-2 rounded-md"
      />
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
          {showPassword ? <ShowIcon /> : <HideIcon />}
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
      {errors.passwordCheck && (
        <p className="text-red-500 text-sm">{errors.passwordCheck.message}</p>
      )}

      {/* Profil Fotoğrafı */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">Profil Fotoğrafı</label>
        <label className="flex items-center justify-between border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-400 transition duration-200">
          <span className="text-gray-700 truncate">{fileName}</span>
          {isSelected ? (
            <span className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
              <CheckIcon /> Seçildi
            </span>
          ) : (
            <span className="bg-[#ef7464] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#ef7464db] transition duration-200">
              Dosya Seç
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            {...register('profile_img')}
            className="hidden"
            onChange={handleChange}
          />
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
