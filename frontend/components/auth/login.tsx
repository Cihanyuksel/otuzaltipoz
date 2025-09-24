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
    <div className="flex items-center justify-center bg-cover bg-center">
      <div className="bg-[#f5f0e9] p-8 rounded-2xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="ornek@email.com"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#ef7464]"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label>Şifre</label>
            <input
              {...register('password')}
              type="password"
              placeholder="********"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#ef7464]"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#ef7464] text-white py-2 rounded-lg hover:bg-[#f56b5c] cursor-pointer"
          >
            Giriş Yap
          </button>
        </form>

        {errorMessage && <p className="text-red-500 mt-2 text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 mt-2 text-center">{successMessage}</p>}
      </div>
    </div>
  );
}
