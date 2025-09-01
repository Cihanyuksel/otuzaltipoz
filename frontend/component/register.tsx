'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useSignup } from '../hooks/useAuthApi';
import { useAuth } from '../context/AuthContext';

const schema = z
  .object({
    username: z.string().min(3, 'Username en az 3 karakter olmalı'),
    fullname: z.string().min(3, 'Fullname en az 3 karakter olmalı'),
    email: z.string().email('Geçerli bir e-posta gir'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
    passwordCheck: z.string(),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onsubmit = (data: FormData) => {
    signup.mutate(
      {
        username: data.username,
        fullname: data.fullname,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          setSuccessMessage('Signup successful!');
          setErrorMessage('');
          setTimeout(() => router.push('/login'), 3000);
        },
        onError: (err: any) => {
          setErrorMessage(err.message || 'Signup failed');
          setSuccessMessage('');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-4 w-full">
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-2 rounded-md">{successMessage}</div>
      )}
      {errorMessage && <div className="bg-red-100 text-red-800 p-2 rounded-md">{errorMessage}</div>}

      <input {...register('username')} placeholder="Username" className="border p-2 rounded-md" />
      {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

      <input {...register('fullname')} placeholder="Full Name" className="border p-2 rounded-md" />
      {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}

      <input {...register('email')} placeholder="Email" className="border p-2 rounded-md" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <input
        type="password"
        {...register('password')}
        placeholder="Password"
        className="border p-2 rounded-md"
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      <input
        type="password"
        {...register('passwordCheck')}
        placeholder="Confirm Password"
        className="border p-2 rounded-md"
      />
      {errors.passwordCheck && (
        <p className="text-red-500 text-sm">{errors.passwordCheck.message}</p>
      )}

      <button
        type="submit"
        className="bg-[#ef7464] text-white py-2 rounded-md hover:bg-[#f56b5c] transition mt-2 cursor-pointer"
      >
        Sign Up
      </button>
    </form>
  );
}
