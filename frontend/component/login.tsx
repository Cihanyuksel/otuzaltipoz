'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email: z.string().email('Geçerli bir email giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const { login, user, setAuth } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await login.mutateAsync(data);

      setAuth(result.data);

      setSuccessMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => router.push('/'), 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Email veya şifre yanlış.');
    }
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
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label>Şifre</label>
            <input
              {...register('password')}
              type="password"
              placeholder="********"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#ef7464]"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#ef7464] text-white py-2 rounded-lg hover:bg-[#f56b5c]"
          >
            Giriş Yap
          </button>
        </form>

        {errorMessage && (
          <p className="text-red-500 mt-2 text-center">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-600 mt-2 text-center">{successMessage}</p>
        )}
      </div>
    </div>
  );
}
