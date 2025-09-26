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
        src="/images/login-bg.avif"
        alt="Background"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[rgba(245,240,233,0.9)] to-[rgba(245,240,233,0.4)]"></div>
      <div className="relative z-10 bg-[#f5f0e9] p-8 rounded-2xl shadow-xl w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
