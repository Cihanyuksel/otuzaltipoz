'use client';
//nextjs and react
import { useState } from 'react';
import { useRouter } from 'next/navigation';
//third-party
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaEye as ShowIcon, FaEyeSlash as HideIcon, FaCheck as CheckIcon, FaUserPlus } from 'react-icons/fa';
//project files
import Button from '@/common/button';
import Input from '@/common/input';
import { useAuth } from '@/context/AuthContext';
import { RegisterFormValues, registerSchema } from 'lib/schemas';

export default function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState('Dosya Seçilmedi');
  const [isSelected, setIsSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsSelected(true);
      setSelectedFile(file);
    } else {
      setFileName('Dosya Seçilmedi');
      setIsSelected(false);
      setSelectedFile(null);
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

    if (selectedFile) {
      formData.append('profile_img', selectedFile);
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
    <div className="w-full">
      <div className="text-center mb-5">
        <FaUserPlus className="text-3xl mx-auto text-[#ef7464] mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">Otuzaltıpoz Topluluğuna Katıl</h2>
        <p className="text-sm text-gray-500 mt-1">Hemen kaydol, fotoğraflarını paylaşmaya başla!</p>
      </div>

      <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-3 w-full">
        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-2 rounded-lg border border-red-300 text-sm font-medium">
            **Hata:** {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-2 rounded-lg border border-green-300 text-sm font-medium">
            <span className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4" /> **Başarılı!** {successMessage}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input name="username" register={register} error={errors.username?.message} placeholder="Kullanıcı Adı" />
          <Input name="full_name" register={register} error={errors.full_name?.message} placeholder="Ad Soyad" />
        </div>

        <Input name="email" register={register} error={errors.email?.message} placeholder="Email Adresi" type="email" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Input
              name="password"
              register={register}
              error={errors.password?.message}
              placeholder="Şifre Oluştur"
              type={showPassword ? 'text' : 'password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[#ef7464] text-sm"
            >
              {showPassword ? <ShowIcon className="w-4 h-4" /> : <HideIcon className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <Input
              name="passwordCheck"
              register={register}
              error={errors.passwordCheck?.message}
              placeholder="Şifreyi Onayla"
              type={showPassword ? 'text' : 'password'}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-gray-700">Kısa Biyografi (İsteğe Bağlı)</label>
          <textarea
            {...register('bio')}
            placeholder="Seni ve fotoğrafçılığını anlatan kısa bir biyografi..."
            className="border-2 border-gray-300 bg-white p-2 rounded-lg w-full resize-none text-sm focus:border-[#ef7464] focus:outline-none transition duration-200"
            rows={3}
          />
          {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
        </div>

        <div className="mt-1">
          <label className="block text-xs font-medium mb-1 text-gray-700">Profil Fotoğrafı Seç (İsteğe Bağlı)</label>
          <label className="flex items-center justify-between border-2 border-dashed border-gray-300 rounded-lg p-2 cursor-pointer hover:border-[#ef7464] transition duration-200 bg-gray-50">
            <span className={`text-sm font-medium truncate ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>
              {fileName}
            </span>
            {isSelected ? (
              <span className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                <CheckIcon className="w-3 h-3" /> Seçildi
              </span>
            ) : (
              <span className="bg-[#ef7464] text-white px-2 py-0.5 rounded-full text-xs font-semibold hover:bg-[#ef7464db] transition duration-200">
                Dosya Seç
              </span>
            )}
            <input type="file" key={fileName} accept="image/*" className="hidden" onChange={handleChange} />
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="mt-3 py-2.5 text-base bg-[#ef7464] hover:bg-[#ef7464db] transition duration-200"
        >
          Hemen Kayıt Ol
        </Button>
      </form>
    </div>
  );
}
