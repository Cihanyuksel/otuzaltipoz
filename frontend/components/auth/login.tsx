'use client';
//nextjs and react
import { useState } from 'react';
import { useRouter } from 'next/navigation';
//third-party
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
//project files
import { LoginFormValues, loginSchema } from 'lib/schemas';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginForm() {
  const { login, setAuth } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
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
          <p className="text-gray-400 text-sm text-center mt-1">
            Aşağıdaki bilgilerinizi girin veya ücretsiz kaydolun
          </p>
        </div>
        <div>
          <label className="text-gray-700 font-bold">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="ornek@email.com"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef7464] transition-colors duration-200"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-gray-700 font-bold">Şifre</label>
          <input
            {...register('password')}
            type="password"
            placeholder="********"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef7464] transition-colors duration-200"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
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

        <button
          type="submit"
          className="w-full bg-[#ef7464] text-white py-3 rounded-lg font-semibold hover:bg-[#f56b5cbe] transition-colors duration-200 cursor-pointer"
        >
          Giriş Yap
        </button>
      </form>
      <div className="flex gap-1 justify-center  text-center mt-4 text-sm text-gray-600">
        <p>Hesabınız yok mu?</p>
        <Link href="/register" className="text-[#ef7464] hover:underline font-semibold">
          Üye Ol
        </Link>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-4 text-center font-medium">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-600 text-sm mt-4 text-center font-medium">{successMessage}</p>
      )}
    </div>
  );
}
