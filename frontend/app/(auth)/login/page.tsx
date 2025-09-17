import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import LoginForm from '@/components/auth/login';

export default async function LoginPage() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (refreshToken) {
    redirect('/');
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1593606497976-50723c6e9573?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Background"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[rgba(245,240,233,0.9)] to-[rgba(245,240,233,0.4)]"></div>
      <div className="relative z-10 bg-[#f5f0e9] p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#ef7464] mb-6 text-center">Giriş Yap</h1>
        <LoginForm />
      </div>
    </div>
  );
}
