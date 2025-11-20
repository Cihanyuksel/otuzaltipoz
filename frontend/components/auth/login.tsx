'use client';
//nextjs and react
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
//third-party
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaSpinner, FaEye as ShowIcon, FaEyeSlash as HideIcon } from 'react-icons/fa';
//project files
import { LoginFormValues, loginSchema } from 'lib/schemas';
import { useAuth } from '@/context/AuthContext';
import Input from '../common/input';
import Button from '../common/button';

export default function LoginForm() {
  const { login, setAuth } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: LoginFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    login.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (result) => {
          setAuth(result.data);
          setSuccessMessage(result.message || 'Giriş başarılı! Yönlendiriliyorsunuz...');
          setErrorMessage('');
          router.push('/');
        },
        onError: (err: any) => {
          setErrorMessage(err.message || 'Email veya şifre yanlış.');
          setSuccessMessage('');
        },
      }
    );
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-[#ef7464] text-center">Giriş Yap</h1>
          <p className="text-gray-400 text-sm text-center mt-1">Aşağıdaki bilgilerinizi girin veya ücretsiz kaydolun</p>
        </div>

        <div>
          <label htmlFor="email" className="text-gray-700 font-bold block mb-1">
            Email
          </label>
          <Input
            id="email"
            name="email"
            register={register}
            error={errors.email?.message}
            placeholder="ornek@email.com"
            type="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-gray-700 font-bold block mb-1">
            Şifre
          </label>
          <div className="relative w-full">
            <Input
              name="password"
              id="password"
              register={register}
              error={errors.password?.message}
              placeholder="********"
              type={showPassword ? 'text' : 'password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute w-5 right-3 top-7 -translate-y-5 text-gray-500 hover:text-[#ef7464] z-10 flex items-center justify-center h-full max-h-[40px]"
              tabIndex={-1}
            >
              {showPassword ? <ShowIcon className="w-4 h-4" /> : <HideIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              className="mr-2 h-4 w-4 text-[#ef7464] rounded border-gray-300 focus:ring-[#ef7464]"
            />
            <label htmlFor="rememberMe" className="text-gray-600">
              Beni Hatırla
            </label>
          </div>
          <Link href="/forgot-password" className="text-gray-500 hover:underline">
            Şifrenizi mi unuttunuz?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
          variant="primary"
          disabled={login.isPending}
        >
          {login.isPending ? <FaSpinner className="animate-spin text-xl" /> : 'Giriş Yap'}
        </Button>
      </form>

      <div className="flex gap-1 justify-center text-center mt-4 text-sm text-gray-600">
        <p>Hesabınız yok mu?</p>
        <Link href="/register" className="text-[#ef7464] hover:underline font-semibold">
          Üye Ol
        </Link>
      </div>

      {errorMessage && <p className="text-red-500 text-sm mt-4 text-center font-medium">{errorMessage}</p>}
      {successMessage && <p className="text-green-600 text-sm mt-4 text-center font-medium">{successMessage}</p>}
    </div>
  );
}
