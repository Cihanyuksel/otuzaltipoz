// components/SignupForm.tsx
'use client';
//nextjs and react
import { useState } from 'react';
import { useRouter } from 'next/navigation';
//third-party
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaEye as ShowIcon, FaEyeSlash as HideIcon, FaCheck as CheckIcon } from 'react-icons/fa';
//project-files
import { useAuth } from '@/context/AuthContext';
import { RegisterFormValues, registerSchema } from 'lib/schemas';
import Button from '../common/button';
import Input from '../common/input';

export default function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState('Dosya Seçilmedi');
  const [isSelected, setIsSelected] = useState(false);

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
    mode: 'onChange',
  });

  const onsubmit = (data: RegisterFormValues) => {
    const formData = new FormData();
    formData.append('username', data.username || '');
    formData.append('full_name', data.full_name || '');
    formData.append('email', data.email || '');
    formData.append('password', data.password || '');
    formData.append('bio', data.bio || '');

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
    <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-4 w-full" encType="multipart/form-data">
      {errorMessage && <div className="bg-red-100 text-red-800 p-2 rounded-md">{errorMessage}</div>}
      {successMessage && <div className="bg-green-100 text-green-800 p-2 rounded-md">{successMessage}</div>}

      <Input name="username" register={register} error={errors.username?.message} placeholder="Kullanıcı Adı" />
      <Input name="full_name" register={register} error={errors.full_name?.message} placeholder="Ad Soyad" />
      <Input name="email" register={register} error={errors.email?.message} placeholder="Email" type="email" />

      <div className="relative">
        <Input
          name="password"
          register={register}
          error={errors.password?.message}
          placeholder="Şifre"
          type={showPassword ? 'text' : 'password'}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-3 cursor-pointer"
        >
          {showPassword ? <ShowIcon /> : <HideIcon />}
        </button>
      </div>

      <div className="relative">
        <Input
          name="passwordCheck"
          register={register}
          error={errors.passwordCheck?.message}
          placeholder="Şifre Onayla"
          type={showPassword ? 'text' : 'password'}
        />
      </div>

      <textarea
        {...register('bio')}
        placeholder="Biyografinizi yazın..."
        className="border border-gray-300 p-2 rounded-md w-full resize-none focus:border-[#ef7464] focus:outline-none"
        rows={3}
      />
      {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}

      {/* Profil Fotoğrafı */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">Profil Fotoğrafı</label>
        <label className="flex items-center justify-between border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-[#ef7464] transition duration-200">
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
          <input type="file" accept="image/*" {...register('profile_img')} className="hidden" onChange={handleChange} />
        </label>
      </div>
      <Button type="submit" variant="primary">
        Kayıt Ol
      </Button>
    </form>
  );
}
