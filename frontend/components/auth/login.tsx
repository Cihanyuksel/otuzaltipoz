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
import Input from '../common/input';
import Button from '../common/button';

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
    mode: 'onChange'
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
          <label className="text-gray-700 font-bold">Email</label>
          <Input name="email" register={register} error={errors.email?.message} placeholder="ornek@email.com" type="email" />
        </div>

        <div>
          <label className="text-gray-700 font-bold">Şifre</label>
          <Input
            name="password"
            register={register}
            error={errors.password?.message}
            placeholder="********"
            type="password"
            className="w-full"
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <input type="checkbox" id="rememberMe" className="mr-2 h-4 w-4 text-[#ef7464] rounded border-gray-300 focus:ring-[#ef7464]" />
            <label htmlFor="rememberMe" className="text-gray-600">
              Beni Hatırla
            </label>
          </div>
          <Link href="/forgot-password" className="text-gray-500 hover:underline">
            Şifrenizi mi unuttunuz?
          </Link>
        </div>

        <Button type="submit" className="w-full" variant="primary">
          Giriş Yap
        </Button>
      </form>
      <div className="flex gap-1 justify-center  text-center mt-4 text-sm text-gray-600">
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
